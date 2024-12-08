import express from "express";
import jobController from "../../controllers/Jobs/jobController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Route to get an application by its ID
router.get("/:applicationId", verifyToken, jobController.getApplicationById);

export default router;