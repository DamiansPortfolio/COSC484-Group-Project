import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import {
  getAllArtists,
  getArtistProfile,
  updateArtistProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getArtistStatistics,
  getArtistActivities, // Add this
} from "../../controllers/Artists/artistController.js"

const router = express.Router()

// Public routes
router.get("/", getAllArtists) // Keep public for discovery

// Protected routes
router.use(protect)
router.use(authorize("artist"))

// Artist-specific routes
router.get("/:userId", getArtistProfile)
router.get("/:userId/statistics", getArtistStatistics)
router.get("/:userId/activities", getArtistActivities)
router.put("/:userId", updateArtistProfile)
router.post("/:userId/portfolio", addPortfolioItem)
router.put("/:userId/portfolio/:itemId", updatePortfolioItem)
router.delete("/:userId/portfolio/:itemId", deletePortfolioItem)

export default router
