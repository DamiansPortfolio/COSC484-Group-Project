// routes/RequesterRoutes/requesterRoutes.js
import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import requesterController from "../../controllers/Requesters/requesterController.js"

const router = express.Router()

router.use(protect)
router.use(authorize("requester"))

router.get("/", requesterController.getAllRequesters)
router.get("/:userId", requesterController.getRequesterProfile)
router.get("/:userId/statistics", requesterController.getRequesterStatistics)
router.get("/:userId/activities", requesterController.getRequesterActivities)
router.get("/:userId/jobs", requesterController.getRequesterJobs)
router.put("/:userId", requesterController.updateRequesterProfile)
router.post("/:userId/reviews", requesterController.addReview)

export default router
