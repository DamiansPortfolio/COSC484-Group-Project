import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import serverless from "@vendia/serverless-express"
import { connectToDatabase } from "./db.js"
import userRoutes from "./routes/userRoutes.js"
import artistRoutes from "./routes/artistRoutes.js"
import requesterRoutes from "./routes/requesterRoutes.js"
import jobRoutes from "./routes/jobsRoutes.js"
import mongoose from "mongoose"

dotenv.config({ path: "../.env" })

const app = express()

// Middleware configuration
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: [
      "https://backend-damian.d3kvzqxa3unfxb.amplifyapp.com",
      "http://localhost:5173",
      "https://wr7krqz4g5.execute-api.us-east-1.amazonaws.com",
    ],
  })
)

// Configure routes
const configureRoutes = () => {
  app.get("/", (req, res) => res.send("Welcome to the website connection API"))
  app.use("/api/users", userRoutes)
  app.use("/api/artists", artistRoutes)
  app.use("/api/requesters", requesterRoutes)
  app.use("/api/jobs", jobRoutes)
  app.get("/api/test", (req, res) => {
    res.json({
      message: "API is working",
      env: process.env.NODE_ENV,
      mongoConnected: mongoose.connection.readyState === 1,
    })
  })
}

// Initialize the app
const initializeApp = async () => {
  try {
    await connectToDatabase()
    configureRoutes()
  } catch (err) {
    console.error("Failed to initialize app:", err)
    throw err
  }
}

// Initialize the serverless handler
let serverlessInstance

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false // Prevent waiting for the event loop

  if (!serverlessInstance) {
    await initializeApp()
    serverlessInstance = serverless({ app })
  }

  // Call the serverless instance
  const response = await serverlessInstance(event, context)

  // Ensure CORS headers are added
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // You can change this to your specific frontend URL
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders,
    },
  }
}
