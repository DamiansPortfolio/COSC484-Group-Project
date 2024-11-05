import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import serverless from "@vendia/serverless-express";
import mongoose from "mongoose";
import { connectToDatabase } from "./config/db.js";
import userRoutes from "./routes/UserRoutes/userRoutes.js";
import artistRoutes from "./routes/ArtistRoutes/artistRoutes.js";
import requesterRoutes from "./routes/RequesterRoutes/requesterRoutes.js";
import jobRoutes from "./routes/JobRoutes/jobsRoutes.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(express.json({ limit: "10kb" })); // Limit JSON payload size
app.use(cookieParser()); // For handling HttpOnly cookies

// Enhanced CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Restrict to your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required for cookies
    maxAge: 86400, // CORS preflight cache time in seconds
  })
);

// Database connection setup (your existing code remains the same)
let isConnected = false;
const connectDb = async () => {
  if (isConnected) return;
  await connectToDatabase();
  isConnected = true;

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    isConnected = false;
  });

  mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully");
    isConnected = true;
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
    isConnected = false;
  });
};

// Basic security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});

// Create auth middleware (we'll implement this next)
const protect = async (req, res, next) => {
  // We'll implement this in the next step
  next();
};

// Rate limiting setup (basic example - consider using redis for production)
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

app.use("/api/", rateLimit);

// Routes with appropriate middleware
app.get("/", (req, res) => res.send("API is running"));
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/requesters", requesterRoutes);
app.use("/api/jobs", jobRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// Your existing Lambda and local development setup remains the same
const serverlessHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDb();
  const handler = serverless({ app });
  return handler(event, context);
};

export const handler = serverlessHandler;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  connectDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
