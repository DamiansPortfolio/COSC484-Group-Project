// routes/UserRoutes/userRoutes.js
import express from "express";
import {
  updateUser,
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  refreshToken,
} from "../../controllers/Users/userController.js";
import {
  protect,
  verifyRefreshToken,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", createUser);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/logout", protect, logoutUser);

// Protected routes
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

export default router;
