// routes/JobRoutes/jobsRoutes.js
import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  applyToJob,
  updateApplication,
} from "../../controllers/Jobs/jobController.js"

const router = express.Router()

// Public routes (no auth needed)
router.get("/", getAllJobs)
router.get("/search", searchJobs)
router.get("/:jobId", getJobById)

// Protected routes
router.use(protect)

// Requester-only routes
router.post("/", authorize("requester"), createJob)
router.put("/:jobId", authorize("requester"), updateJob)
router.delete("/:jobId", authorize("requester"), deleteJob)

// Artist-only routes
router.post("/:jobId/apply", authorize("artist"), applyToJob)

// Shared routes (both roles can access)
router.put("/:jobId/applications/:applicationId", updateApplication)

export default router
