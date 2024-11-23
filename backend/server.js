import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/UserRoutes/userRoutes.js"
import artistRoutes from "./routes/ArtistRoutes/artistRoutes.js"
import requesterRoutes from "./routes/RequesterRoutes/requesterRoutes.js"
import jobRoutes from "./routes/JobRoutes/jobsRoutes.js"

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

// Token extraction middleware (optional, but can be helpful)
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.token = authHeader.substring(7)
  }
  next()
})

// Register API routes
app.use("/api/users", userRoutes)
app.use("/api/artists", artistRoutes)
app.use("/api/requesters", requesterRoutes)
app.use("/api/jobs", jobRoutes)

// Wildcard route to handle all other endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    message: `The endpoint ${req.originalUrl} does not exist.`,
    method: req.method,
    availableEndpoints: [
      "/api/users",
      "/api/artists",
      "/api/requesters",
      "/api/jobs",
    ],
  })
})

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message,
  })
})

export default app
