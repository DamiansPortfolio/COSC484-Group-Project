import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, "../.env") })

const frontendUrl =
  process.env.FRONTEND_URL ||
  "https://damiansbranch.d3kvzqxa3unfxb.amplifyapp.com"

export const config = {
  name: process.env.NODE_ENV || "local",
  port: process.env.PORT || 5001,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-Amz-Date",
      "X-Api-Key",
      "X-Amz-Security-Token",
    ],
    credentials: true,
    maxAge: 600,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}

export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Using existing MongoDB connection")
      return mongoose.connection
    }

    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected in ${config.name} mode`)
    return mongoose.connection
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export const isProduction = () => process.env.NODE_ENV === "production"
export const isLocal = () => process.env.NODE_ENV === "local"
