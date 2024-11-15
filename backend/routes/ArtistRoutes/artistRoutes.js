import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import artistController from "../../controllers/Artists/artistController.js"

const router = express.Router()

router.get("/", artistController.getAllArtists)
router.get("/:userId", artistController.getArtistProfile)
router.get("/:userId/statistics", artistController.getArtistStatistics)
router.get("/:userId/activities", artistController.getArtistActivities)

router.use(protect)
router.use(authorize("artist"))

router.put("/:userId", artistController.updateArtistProfile)
router.post("/:userId/portfolio", artistController.addPortfolioItem)

export default router
