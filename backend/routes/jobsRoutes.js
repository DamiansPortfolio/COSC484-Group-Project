import express from "express"
import { getAllJobs } from "../controllers/jobsController.js"

const router = express.Router()

// GET route for retrieving all users
router.get("/", getAllJobs)

export default router
