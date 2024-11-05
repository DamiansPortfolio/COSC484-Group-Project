// routes/UserRoutes/userRoutes.js
import express from "express"
import { protect, verifyRefreshToken } from "../../middleware/authMiddleware.js"
import {
  updateUser,
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  refreshToken,
} from "../../controllers/Users/userController.js"

const router = express.Router()

// Public authentication routes
router.post("/login", loginUser)
router.post("/register", createUser)
router.post("/refresh-token", verifyRefreshToken, refreshToken)

// Protected routes
router.post("/logout", protect, logoutUser)
router.get("/", protect, getAllUsers)
router.get("/:id", protect, getUserById)
router.put("/:id", protect, updateUser)

export default router
