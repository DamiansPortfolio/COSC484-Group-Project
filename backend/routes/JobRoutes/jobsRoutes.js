// routes/JobRoutes/jobsRoutes.js
import express from "express"
import { protect, authorize } from "../../middleware/authMiddleware.js"
import jobController from "../../controllers/Jobs/jobController.js"

const router = express.Router()

// Public routes
router.get("/", jobController.getAllJobs)
router.get("/search", jobController.searchJobs)
router.get("/:jobId", jobController.getJobById)

// Protected routes
router.use(protect)

// Requester-only routes
const requesterRoutes = express.Router()
requesterRoutes.use(authorize("requester"))
requesterRoutes.post("/", jobController.createJob)
requesterRoutes.put("/:jobId", jobController.updateJob)
requesterRoutes.delete("/:jobId", jobController.deleteJob)

// Artist-only routes
const artistRoutes = express.Router()
artistRoutes.use(authorize("artist"))
artistRoutes.post("/:jobId/apply", jobController.applyToJob)

router.use(requesterRoutes)
router.use(artistRoutes)
router.put(
  "/:jobId/applications/:applicationId",
  jobController.updateApplication
)

export default router
