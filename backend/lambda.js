import serverless from "@vendia/serverless-express"
import { connectDB } from "./config/config.js"
import app from "./server.js"

// Cache database connection
let cachedDb = null

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  console.log("Request Type:", event.httpMethod)
  console.log("Request Headers:", JSON.stringify(event.headers))

  const corsHeaders = {
    "Access-Control-Allow-Origin":
      "https://damiansbranch.d3kvzqxa3unfxb.amplifyapp.com",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  }

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    }
  }

  try {
    if (!cachedDb) {
      cachedDb = await Promise.race([
        connectDB(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB Connection Timeout")), 10000)
        ),
      ])
    }

    const serverlessHandler = serverless({ app })
    const response = await serverlessHandler(event, context)

    return {
      ...response,
      headers: {
        ...response.headers,
        ...corsHeaders,
      },
    }
  } catch (error) {
    console.error("Lambda handler error:", error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
        details: error.stack,
      }),
    }
  }
}
