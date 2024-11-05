// routes/JobRoutes/jobsRoutes.js
import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import {
  getAllJobs,
  getJobById,
  getJobsByArtist,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  updateApplication,
  addMilestone,
  updateMilestone,
  searchJobs,
} from "../../controllers/Jobs/jobController.js"

const router = express.Router()

// Public routes
router.get("/", getAllJobs)
router.get("/search", searchJobs)
router.get("/:jobId", getJobById)

// Protected routes
router.use(protect)

// Requester-only routes
router.post("/", authorize("requester"), createJob)
router.put("/:jobId", authorize("requester"), updateJob)
router.delete("/:jobId", authorize("requester"), deleteJob)
router.post("/:jobId/milestones", authorize("requester"), addMilestone)
router.put(
  "/:jobId/milestones/:milestoneId",
  authorize("requester"),
  updateMilestone
)

// Artist-only routes
router.post("/:jobId/apply", authorize("artist"), applyToJob)
router.get("/artist/:artistId", authorize("artist"), getJobsByArtist)

// Shared routes (both roles can access)
router.put("/:jobId/applications/:applicationId", updateApplication)

export default router
