// routes/JobRoutes/jobsRoutes.js
import express from "express"
import jobController from "../../controllers/Jobs/jobController.js"
import { verifyToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", jobController.getAllJobs)
router.get("/search", jobController.searchJobs)
router.get("/:jobId", jobController.getJobById)
router.post("/", verifyToken, jobController.createJob)
router.put("/:jobId", verifyToken, jobController.updateJob)
router.delete("/:jobId", verifyToken, jobController.deleteJob)
router.post("/:jobId/apply", verifyToken, jobController.applyToJob)
router.put(
  "/:jobId/applications/:applicationId",
  verifyToken,
  jobController.updateApplication
)

export default router
