import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import serverless from "@vendia/serverless-express"
import { connectToDatabase } from "./db.js"
import userRoutes from "./routes/userRoutes.js"
import artistRoutes from "./routes/artistRoutes.js"
import requesterRoutes from "./routes/requesterRoutes.js"
import jobRoutes from "./routes/jobsRoutes.js"

dotenv.config({ path: "../.env" })

const app = express()

// Middleware configuration
app.use(
  cors({
    origin: [
      "https://backend-damian.d3kvzqxa3unfxb.amplifyapp.com",
      "http://localhost:5173",
    ],
  })
)

// Route definitions
const configureRoutes = () => {
  app.get("/", (req, res) => res.send("Welcome to the website connection API"))
  app.use("/api/users", userRoutes)
  app.use("/api/artists", artistRoutes)
  app.use("/api/requesters", requesterRoutes)
  app.use("/api/jobs", jobRoutes)
}

// Initialize the app
const initializeApp = async () => {
  try {
    await connectToDatabase()
    configureMiddleware()
    configureRoutes()
  } catch (err) {
    console.error("Failed to initialize app:", err)
    throw err
  }
}

// Initialize app and create handler
let serverlessInstance

export const handler = async (event, context) => {
  if (!serverlessInstance) {
    await initializeApp()
    serverlessInstance = serverless({ app })
  }
  return serverlessInstance(event, context)
}

// Keep the local development server
if (process.env.NODE_ENV !== "production") {
  const startLocalServer = async () => {
    try {
      await initializeApp()
      const PORT = process.env.PORT || 5001
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (err) {
      console.error("Failed to start server:", err)
      process.exit(1)
    }
  }
  startLocalServer()
}

// Global error handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
  process.exit(1)
})
