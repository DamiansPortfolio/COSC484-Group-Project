import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, "../.env.production") })

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    users: process.env.DB_USERS,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    port: process.env.PORT || 5001,
    env: process.env.NODE_ENV || "development",
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
}
