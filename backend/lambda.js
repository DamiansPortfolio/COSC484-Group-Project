import serverless from "@vendia/serverless-express"
import { connectDB } from "./config/config.js"
import app from "./server.js"

let cachedDb = null

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  console.log("Starting Lambda handler")

  try {
    if (!cachedDb) {
      console.log("Attempting database connection...")
      cachedDb = await Promise.race([
        connectDB(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB Connection Timeout")), 10000)
        ),
      ])
      console.log("Database connection successful")
    } else {
      console.log("Using cached database connection")
    }

    const serverlessHandler = serverless({ app })
    const response = await serverlessHandler(event, context)
    console.log("Lambda response:", response)
    return response
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
        type: error.name,
      }),
    }
  }
}
