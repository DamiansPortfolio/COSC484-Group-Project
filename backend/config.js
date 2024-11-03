import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, ".env.production") })

export const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  DB_USERS: process.env.DB_USERS,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
}
