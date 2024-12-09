import express from "express"
import jobController from "../../controllers/Jobs/jobController.js"
import { verifyToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", jobController.getAllJobs)
router.get("/search", jobController.searchJobs)
router.get("/:jobId", jobController.getJobById)

// Protected routes
router.get(
  "/requester/:requesterId",
  verifyToken,
  jobController.getRequesterJobs
)
router.post("/", verifyToken, jobController.createJob)
router.put("/:jobId", verifyToken, jobController.updateJob)
router.delete("/:jobId", verifyToken, jobController.deleteJob)
router.post("/:jobId/apply", verifyToken, jobController.applyToJob)
router.put("/:jobId/complete", verifyToken, jobController.completeJob)
router.put(
  "/:jobId/applications/:applicationId",
  verifyToken,
  jobController.updateApplication
)

export default router
