import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, "../.env") }) // Always use .env

// Combined configuration
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
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
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}
