import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, "../.env") })

// Environment configuration
export const config = {
  name: process.env.NODE_ENV || "local",
  port: process.env.PORT || 5001,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}

// Database connection
export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB")
      return
    }
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`MongoDB Connected in ${config.name} mode`)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Helper functions
export const isProduction = () => process.env.NODE_ENV === "production"
export const isLocal = () => process.env.NODE_ENV === "local"
