import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import artistRoutes from "./routes/artistRoutes.js"
import { connectToDatabase } from "./db.js" // Import the connect function

// Load environment variables from .env file
dotenv.config({ path: "../.env" })
const app = express()

// Enable CORS to allow requests from the frontend (configured via .env)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
)

app.use(express.json())

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    await connectToDatabase() // from db.js
    // Remove this log to avoid duplication
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err)
    process.exit(1) // Exit process if connection fails
  }
}

// Call the database connection function once at startup
connectDatabase()

// Base route for checking server connection
app.get("/", (req, res) => {
  res.send("Welcome to the website connection API")
})

// Artist API routes
app.use("/api/artists", artistRoutes)

// Start the server
const PORT = process.env.PORT || 5001 // Fallback to 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
