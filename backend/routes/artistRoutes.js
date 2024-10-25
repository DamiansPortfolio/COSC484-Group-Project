import express from "express"
import { getArtists, getArtistById } from "../controllers/artistController.js"

const router = express.Router()

// Artist API routes
router.get("/", getArtists)
router.get("/:id", getArtistById)

export default router
