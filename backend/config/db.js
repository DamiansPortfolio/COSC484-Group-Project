import mongoose from "mongoose"
import { config } from "./config.js"

export const connectToDatabase = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    const conn = await mongoose.connect(config.mongodb.uri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}
