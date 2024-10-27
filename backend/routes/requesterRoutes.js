import express from "express"
import {
  getAllRequesters,
  getRequesterProfile,
  updateRequesterProfile,
} from "../controllers/requesterProfileController.js"

const router = express.Router()

// Get route for retrieving all artists
router.get("/", getAllRequesters)

// GET route for retrieving requester profile by user ID
router.get("/:userId", getRequesterProfile)

// PUT route for updating requester profile by user ID
router.put("/:userId", updateRequesterProfile)

export default router
