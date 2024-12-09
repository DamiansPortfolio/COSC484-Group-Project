import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/UserRoutes/userRoutes.js"
import artistRoutes from "./routes/ArtistRoutes/artistRoutes.js"
import requesterRoutes from "./routes/RequesterRoutes/requesterRoutes.js"
import jobRoutes from "./routes/JobRoutes/jobsRoutes.js"
import applicationsRoutes from "./routes/ApplicationRoutes/applicationsRoutes.js"
import statisticsRoutes from "./routes/StatisticsRoutes/statisticsRoutes.js"

import { config, connectDB } from "./config/config.js"

// Load environment variables
dotenv.config()

// Log environment mode at startup
console.log("Starting server in mode:", process.env.NODE_ENV)

const app = express()

// Add CORS middleware
app.use(cors(config.cors))

// Middleware
app.use(express.json())

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.token = authHeader.substring(7)
  }
  next()
})

// Register API routes
app.use("/api/users", userRoutes)
app.use("/api/artists", artistRoutes)
app.use("/api/requesters", requesterRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationsRoutes)
app.use("/api/statistics", statisticsRoutes) // Add this line

// Update wildcard route to include new endpoint
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
    ],
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message,
  })
})

// Server startup logic
const startServer = async () => {
  try {
    // Always connect to MongoDB regardless of environment
    await connectDB()

    // Only start Express server in local mode
    if (process.env.NODE_ENV === "local") {
      app.listen(config.port, () => {
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

// Start server based on environment
if (process.env.NODE_ENV !== "test") {
  // Don't auto-start in test environment
  startServer()
}

export default app
