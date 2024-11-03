// routes/requesterRoutes.js
import express from "express"
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
} from "../controllers/requesterProfileController.js"

const router = express.Router()

// Profile management
router.get("/", getAllRequesters)
router.get("/:userId", getRequesterProfile)
router.put("/:userId", updateRequesterProfile)

// Payment methods
router.post("/:userId/payment-methods", addPaymentMethod)
router.delete("/:userId/payment-methods/:methodId", removePaymentMethod)

// Preferences and stats
router.put("/:userId/preferences", updatePreferences)
router.get("/:userId/statistics", getRequesterStats)
router.get("/:userId/jobs", getRequesterJobs)

// Reviews
router.post("/:userId/reviews", addReview)

export default router
