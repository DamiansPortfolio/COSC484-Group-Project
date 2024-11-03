import mongoose from "mongoose" // MongoDB ODM for Node.js

// MongoDB connection function
export const connectToDatabase = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export { connectToDatabase }
