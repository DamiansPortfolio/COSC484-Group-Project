import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { config } from "./config.js"

export const configureServer = () => {
  const app = express()

  app.use(helmet())
  app.use(cors(config.cors))
  app.use(express.json())
  app.use(cookieParser())

  return app
}
