// routes/RequesterRoutes/requesterRoutes.js
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
} from "../../controllers/Requesters/requesterController.js"

const router = express.Router()

// All routes require authentication and requester role
router.use(protect)
router.use(authorize("requester"))

router.get("/", getAllRequesters)
router.get("/:userId", getRequesterProfile)
router.put("/:userId", updateRequesterProfile)
router.post("/:userId/payment-methods", addPaymentMethod)
router.delete("/:userId/payment-methods/:methodId", removePaymentMethod)
router.put("/:userId/preferences", updatePreferences)
router.get("/:userId/statistics", getRequesterStats)
router.get("/:userId/jobs", getRequesterJobs)
router.post("/:userId/reviews", addReview)

export default router
