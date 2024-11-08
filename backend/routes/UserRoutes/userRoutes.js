import express from "express"
import {
  updateUser,
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../../controllers/Users/userController.js"
import { protect, verifyRefreshToken } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/login", loginUser)
router.post("/register", createUser)
router.post("/refresh-token", verifyRefreshToken, refreshToken)

// Protected routes
router.post("/logout", protect, logoutUser)
router.put("/:id", protect, updateUser)

export default router
