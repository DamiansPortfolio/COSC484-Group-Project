import { handler as serverHandler } from "./server.js"

export const handler = async (event, context) => {
  // Handle OPTIONS requests for CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin":
          process.env.FRONTEND_URL || "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    }
  }

  // Handle regular requests
  const response = await serverHandler(event, context)

  // Ensure CORS headers are present in all responses
  if (response.headers) {
    response.headers = {
      ...response.headers,
      "Access-Control-Allow-Origin":
        process.env.FRONTEND_URL || "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With",
      "Access-Control-Allow-Credentials": true,
    }
  }

  return response
}
