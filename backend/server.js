import dotenv from "dotenv" // Load environment variables
import express from "express" // Web framework for Node.js
import cors from "cors" // Middleware for CORS
import { connectToDatabase } from "./db.js" // Database connection function
import userRoutes from "./routes/userRoutes.js"
import artistRoutes from "./routes/artistRoutes.js"
import requesterRoutes from "./routes/requesterRoutes.js"

dotenv.config({ path: "../.env" }) // Load .env variables

// Create an Express application
const app = express()

// Middleware configuration
const configureMiddleware = () => {
  // Configure CORS
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
  app.use(cors({ origin: frontendUrl }))

  app.use(express.json()) // Parse incoming JSON requests
}

// Route definitions
const configureRoutes = () => {
  app.get("/", (req, res) => res.send("Welcome to the website connection API"))
  app.use("/api/users", userRoutes) // Base route for user operations
  app.use("/api/artists", artistRoutes) // Base route for artist profile operations
  app.use("/api/requesters", requesterRoutes) // Base route for requester profile operations
}

// Start the server
const startServer = async () => {
  try {
    await connectToDatabase() // Connect to MongoDB
    configureMiddleware() // Configure app middleware
    configureRoutes() // Configure app routes

    const PORT = process.env.PORT || 5001
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}

// Global error handling for uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
  process.exit(1)
})

startServer() // Start the server
