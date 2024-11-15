import { handler as serverHandler } from "./server.js"

export const handler = async (event, context) => {
  // Handle OPTIONS requests (CORS preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    }
  }

  try {
    const response = await serverHandler(event, context)

    // Ensure response has headers (without adding CORS headers here)
    if (!response.headers) {
      response.headers = {}
    }

    return response
  } catch (error) {
    console.error("Lambda handler error:", error)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    }
  }
}
