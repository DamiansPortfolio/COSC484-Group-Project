// routes/StatisticsRoutes/statisticsRoutes.js
import express from "express"
import statisticsController from "../../controllers/Statistics/statisticsController.js"
import { verifyToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Routes for statistics
router.get(
  "/requesters/:requesterId",
  verifyToken,
  statisticsController.getRequesterStats
)
router.get(
  "/artists/:artistId",
  verifyToken,
  statisticsController.getArtistStats
)

export default router
