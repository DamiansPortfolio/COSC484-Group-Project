import express from "express"
import artistController from "../../controllers/Artists/artistController.js"
import { verifyToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

// routes/ArtistRoutes/artistRoutes.js
router.get("/", artistController.getAllArtists)
router.get("/:userId", verifyToken, artistController.getArtistProfile)
router.get(
  "/:userId/statistics",
  verifyToken,
  artistController.getArtistStatistics
)
router.get(
  "/:userId/activities",
  verifyToken,
  artistController.getArtistActivities
)
router.post(
  "/:userId/portfolio",
  verifyToken,
  artistController.addPortfolioItem
)
router.put("/:userId", verifyToken, artistController.updateArtistProfile)

export default router
