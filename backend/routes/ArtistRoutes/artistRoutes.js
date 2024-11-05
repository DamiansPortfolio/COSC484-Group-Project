// routes/ArtistRoutes/artistRoutes.js
import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import {
  getAllArtists,
  getArtistProfile,
  updateArtistProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getRecommendations,
} from "../../controllers/Artists/artistController.js"

const router = express.Router()

// Public routes
router.get("/", getAllArtists)
router.get("/recommendations", getRecommendations)

// Mixed route - public profile view with enhanced access for owner
router.get("/:userId", getArtistProfile)

// Protected artist-only routes
router.use(protect)
router.use(authorize("artist"))

router.put("/:userId", updateArtistProfile)
router.post("/:userId/portfolio", addPortfolioItem)
router.put("/:userId/portfolio/:itemId", updatePortfolioItem)
router.delete("/:userId/portfolio/:itemId", deletePortfolioItem)

export default router
