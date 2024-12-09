// routes/ApplicationRoutes/applicationsRoutes.js
import express from "express"
import applicationController from "../../controllers/Applications/applicationController.js"
import { verifyToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Get single application
router.get(
  "/:applicationId",
  verifyToken,
  applicationController.getApplicationById
)

// Get all applications for an artist
router.get(
  "/artist/:artistId",
  verifyToken,
  applicationController.getArtistApplications
)

// Update application status
router.patch(
  "/:applicationId/status",
  verifyToken,
  applicationController.updateApplicationStatus
)

export default router
