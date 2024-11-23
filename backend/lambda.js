import serverless from "@vendia/serverless-express"
import { connectDB } from "./config/config.js"
import express from "./server.js"
import dotenv from "dotenv"

dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  console.log("Request Type:", event.httpMethod)
  console.log("Request Headers:", JSON.stringify(event.headers))

  const corsHeaders = {
    "Access-Control-Allow-Origin": FRONTEND_URL,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" }
  }

  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB Connection Timeout")), 2500)
      ),
    ])

    const serverlessHandler = serverless({
      app: express,
      respondWithErrors: true,
    })

    const response = await Promise.race([
      serverlessHandler(event, context),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request Timeout")), 5000)
      ),
    ])

    response.headers = { ...response.headers, ...corsHeaders }

    console.log("Response headers:", JSON.stringify(response.headers))

    return response
  } catch (error) {
    console.error("Lambda handler error:", error)
    return {
      statusCode: error.message.includes("Timeout") ? 504 : 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    }
  }
}
