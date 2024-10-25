import { MongoClient } from "mongodb"
import { mongoUri, usersDB } from "./config.js" // Import usersDB

let dbClient
let db

const connectToDatabase = async () => {
  if (!db) {
    try {
      dbClient = new MongoClient(mongoUri)
      await dbClient.connect()
      db = dbClient.db(usersDB) // Specify the userData database here
      console.log("Connected to MongoDB at", new Date().toISOString())
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error)
      throw error
    }
  } else {
    console.log(
      "Using existing MongoDB connection at",
      new Date().toISOString()
    )
  }
  return db // Return the database instance
}

export { connectToDatabase }
