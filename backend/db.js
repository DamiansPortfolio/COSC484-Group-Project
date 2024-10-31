import mongoose from "mongoose" // MongoDB ODM for Node.js

// MongoDB connection function
const connectToDatabase = async () => {
  try {
    // Connect to MongoDB with connection options
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Successfully connected to MongoDB")
  } catch (err) {
    console.error("Error connecting to MongoDB:", err)
    // Optionally, rethrow the error to let the caller handle it
    throw err
  }
}

export { connectToDatabase }
