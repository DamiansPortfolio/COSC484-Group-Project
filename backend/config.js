import dotenv from "dotenv"

dotenv.config({ path: "../.env" })

export const { MONGODB_URI: mongoUri, DB_USERS: usersDB } = process.env
