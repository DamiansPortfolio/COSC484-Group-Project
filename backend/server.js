import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import serverless from "@vendia/serverless-express"
import mongoose from "mongoose"
import rateLimit from "express-rate-limit"
import { connectToDatabase } from "./config/db.js"
import { protect, authorize } from "./middleware/authMiddleware.js"
import userRoutes from "./routes/UserRoutes/userRoutes.js"
import artistRoutes from "./routes/ArtistRoutes/artistRoutes.js"
import requesterRoutes from "./routes/RequesterRoutes/requesterRoutes.js"
import jobRoutes from "./routes/JobRoutes/jobsRoutes.js"

dotenv.config()

const app = express()

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow the origin from the environment variable
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

// Apply CORS before other middleware
app.use(cors(corsOptions))

// Apply CORS before other middleware
app.use(cors(corsOptions))

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
  })
)

app.use(express.json({ limit: "10kb" }))
app.use(cookieParser())

// Enhanced security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  )
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5173"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end()
  }
  next()
})

// Database connection setup
let isConnected = false
const connectDb = async () => {
  if (isConnected) return
  await connectToDatabase()
  isConnected = true

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err)
    isConnected = false
  })

  mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully")
    isConnected = true
  })

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected")
    isConnected = false
  })
}

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting to all API routes
app.use("/api/", limiter)

// Health check route
app.get("/", (req, res) => res.send("API is running"))

// API routes
app.use("/api/users", userRoutes)
app.use("/api/artists", artistRoutes)
app.use("/api/requesters", requesterRoutes)
app.use("/api/jobs", jobRoutes)

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    })
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    })
  }

  // Handle CORS errors
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      status: "error",
      message: "CORS error: Request origin not allowed",
    })
  }

  res.status(err.status || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  })
})

// Lambda handler configuration
const serverlessHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await connectDb()

  // Add CORS headers to Lambda response
  const handler = serverless({
    app,
    binarySettings: {
      isBinary: true,
    },
  })
  return handler(event, context)
}

export const handler = serverlessHandler

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001
  connectDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
}
