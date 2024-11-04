// routes/jobsRoutes.js
import express from "express"
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

// Basic CRUD
router.get("/", getAllJobs)
router.get("/search", searchJobs)
router.get("/:jobId", getJobById)
router.post("/", createJob)
router.put("/:jobId", updateJob)
router.delete("/:jobId", deleteJob)

// Applications
router.post("/:jobId/apply", applyToJob)
router.put("/:jobId/applications/:applicationId", updateApplication)

// Milestones
router.post("/:jobId/milestones", addMilestone)
router.put("/:jobId/milestones/:milestoneId", updateMilestone)

// Jobs
router.get("/artist/:artistId", getJobsByArtist)

export default router
