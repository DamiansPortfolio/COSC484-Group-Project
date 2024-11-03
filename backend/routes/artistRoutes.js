// routes/artistRoutes.js
import express from "express"
import {
  getAllArtists,
  getArtistProfile,
  updateArtistProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/artistProfileController.js"

const router = express.Router()

// Get all artists
router.get("/", getAllArtists)

// Get artist profile by user ID
router.get("/:userId", getArtistProfile)

// Update artist profile
router.put("/:userId", updateArtistProfile)

// Portfolio item routes
router.post("/:userId/portfolio", addPortfolioItem)
router.put("/:userId/portfolio/:itemId", updatePortfolioItem)
router.delete("/:userId/portfolio/:itemId", deletePortfolioItem)

export default router
