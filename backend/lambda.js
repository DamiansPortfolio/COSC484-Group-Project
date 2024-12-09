import serverless from "@vendia/serverless-express"
import { connectDB } from "./config/config.js"
import app from "./server.js"

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  console.log("Request Type:", event.httpMethod)
  console.log("Request Headers:", JSON.stringify(event.headers))

  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB Connection Timeout")), 2500)
      ),
    ])

    const serverlessHandler = serverless({ app, respondWithErrors: true })

    const response = await Promise.race([
      serverlessHandler(event, context),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request Timeout")), 5000)
      ),
    ])

    return response
  } catch (error) {
    console.error("Lambda handler error:", error)
    return {
      statusCode: error.message.includes("Timeout") ? 504 : 500,
      headers: {
        "Access-Control-Allow-Origin":
          process.env.FRONTEND_URL || "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    }
  }
}
