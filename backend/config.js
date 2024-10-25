import dotenv from "dotenv"

dotenv.config({ path: "../.env" })

export const mongoUri = process.env.MONGODB_URI // MongoDB connection string
export const usersDB = process.env.DB_USERS // Users Database string
