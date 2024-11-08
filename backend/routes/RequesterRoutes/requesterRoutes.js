import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import {
  getAllRequesters,
  getRequesterProfile,
  updateRequesterProfile,
  addPaymentMethod,
  removePaymentMethod,
  updatePreferences,
  getRequesterStats,
  getRequesterJobs,
  addReview,
  getRequesterStatistics,
  getRequesterActivities,
} from "../../controllers/Requesters/requesterController.js"

const router = express.Router()

// All routes need auth
router.use(protect)
router.use(authorize("requester"))

// Requester-specific routes
router.get("/", getAllRequesters)
router.get("/:userId", getRequesterProfile)
router.get("/:userId/statistics", getRequesterStatistics)
router.get("/:userId/activities", getRequesterActivities)
router.put("/:userId", updateRequesterProfile)
router.post("/:userId/payment-methods", addPaymentMethod)
router.delete("/:userId/payment-methods/:methodId", removePaymentMethod)
router.put("/:userId/preferences", updatePreferences)
router.get("/:userId/jobs", getRequesterJobs)
router.post("/:userId/reviews", addReview)

export default router
