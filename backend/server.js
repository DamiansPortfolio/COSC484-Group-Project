// server.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import userRoutes from "./routes/UserRoutes/userRoutes.js"
import artistRoutes from "./routes/ArtistRoutes/artistRoutes.js"
import requesterRoutes from "./routes/RequesterRoutes/requesterRoutes.js"
import jobRoutes from "./routes/JobRoutes/jobsRoutes.js"
import messageRoutes from "./routes/MessageRoutes/messageRoutes.js"
import applicationsRoutes from "./routes/ApplicationRoutes/applicationsRoutes.js"
import statisticsRoutes from "./routes/StatisticsRoutes/statisticsRoutes.js"
import { config, connectDB } from "./config/config.js"

dotenv.config()
console.log("Starting server in mode:", process.env.NODE_ENV)

const app = express()
const httpServer = createServer(app)

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())

const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join", (userId) => {
    socket.join(userId)
    console.log("User joined room:", userId)
  })

  socket.on("private-message", async (data) => {
    console.log("Private message received:", data)
    socket.to(data.receiverId).emit("receive-message", data.message)
  })

  socket.on("mark-read", (data) => {
    console.log("Marking messages as read:", data)
    socket.to(data.senderId).emit("messages-read", {
      readBy: data.readBy,
      conversationId: data.conversationId,
    })
  })

  socket.on("typing", (data) => {
    socket.to(data.receiverId).emit("user-typing", data.senderId)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (authHeader?.startsWith("Bearer ")) {
    req.token = authHeader.substring(7)
  }
  next()
})

app.use("/api/users", userRoutes)
app.use("/api/artists", artistRoutes)
app.use("/api/requesters", requesterRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationsRoutes)
app.use("/api/statistics", statisticsRoutes)
app.use("/api/messages", messageRoutes)

app.all("*", (req, res) => {
  res.status(404).json({
    message: `The endpoint ${req.originalUrl} does not exist.`,
    method: req.method,
    availableEndpoints: [
      "/api/users",
      "/api/artists",
      "/api/requesters",
      "/api/jobs",
      "/api/applications",
      "/api/statistics",
      "/api/messages",
    ],
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message })
})

const startServer = async () => {
  try {
    await connectDB()
    if (process.env.NODE_ENV === "local") {
      httpServer.listen(config.port, () => {
        console.log(
          `Server running in ${config.name} mode on port ${config.port}`
        )
        console.log(`Frontend URL: ${config.cors.origin}`)
      })
    } else {
      console.log(
        "Running in production mode - server will be handled by AWS Lambda"
      )
    }
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer()
}

export default app
