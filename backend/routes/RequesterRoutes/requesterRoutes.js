// routes/RequesterRoutes/requesterRoutes.js
import express from "express"
import requesterController from "../../controllers/Requesters/requesterController.js"
import { verifyToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", requesterController.getAllRequesters)
router.get("/:userId", verifyToken, requesterController.getRequesterProfile)
router.get(
  "/:userId/statistics",
  verifyToken,
  requesterController.getRequesterStatistics
)
router.get(
  "/:userId/activities",
  verifyToken,
  requesterController.getRequesterActivities
)
router.get("/:userId/jobs", verifyToken, requesterController.getRequesterJobs)
router.put("/:userId", verifyToken, requesterController.updateRequesterProfile)
router.post("/:userId/reviews", verifyToken, requesterController.addReview)
router.get("/profile/:userId/jobs", verifyToken, requesterController.getRequesterProfile);

export default router
