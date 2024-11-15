// server.js
import { configureServer } from "./config/server.js"
import { connectToDatabase } from "./config/db.js"
import { config } from "./config/config.js"
import serverless from "@vendia/serverless-express"
import { configureRoutes } from "./config/routes.js"
import { errorHandler } from "./middleware/errorHandler.js"

let isConnected = false
const app = configureServer()

// Database connection handler
const connectDb = async () => {
  if (!isConnected) {
    await connectToDatabase()
    isConnected = true
  }
}

// Configure routes before error handler
configureRoutes(app)

// Global error handler - must be last middleware
app.use(errorHandler)

// Lambda handler for production
export const handler = async (event, context) => {
  await connectDb()
  const serverlessHandler = serverless({ app })
  return serverlessHandler(event, context)
}

// Development server
if (config.app.env !== "production") {
  connectDb()
    .then(() => {
      app.listen(config.app.port, () => {
        console.log(
          `Server running in ${config.app.env} mode on port ${config.app.port}`
        )
        console.log(`Frontend URL: ${config.app.frontendUrl}`)
      })
    })
    .catch((error) => {
      console.error("Failed to start server:", error)
      process.exit(1)
    })
}
