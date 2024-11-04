import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import serverless from "@vendia/serverless-express"
import { connectToDatabase } from "./config/db.js"
import userRoutes from "./routes/UserRoutes/userRoutes.js"
import artistRoutes from "./routes/ArtistRoutes/artistRoutes.js"
import requesterRoutes from "./routes/RequesterRoutes/requesterRoutes.js"
import jobRoutes from "./routes/JobRoutes/jobsRoutes.js"

dotenv.config()

const app = express()

// Simple CORS setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

app.use(express.json())

// Connect to database before setting up routes
let isConnected = false
const connectDb = async () => {
  if (isConnected) return
  await connectToDatabase()
  isConnected = true
}

// Basic routes without auth middleware
app.get("/", (req, res) => res.send("API is running"))
app.use("/api/users", userRoutes)
app.use("/api/artists", artistRoutes)
app.use("/api/requesters", requesterRoutes)
app.use("/api/jobs", jobRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something broke!" })
})

// For Lambda
const serverlessHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await connectDb()
  const handler = serverless({ app })
  return handler(event, context)
}

export const handler = serverlessHandler

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001
  connectDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
}
