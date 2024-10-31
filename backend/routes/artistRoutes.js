import express from "express"
import {
  getAllArtists,
  getArtistProfile,
  updateArtistProfile,
} from "../controllers/artistProfileController.js"

const router = express.Router()

// Get route for retrieving all artists
router.get("/", getAllArtists)

// GET route for retrieving artist profile by user ID
router.get("/:userId", getArtistProfile)

// PUT route for updating artist profile by user ID
router.put("/:userId", updateArtistProfile)

export default router
