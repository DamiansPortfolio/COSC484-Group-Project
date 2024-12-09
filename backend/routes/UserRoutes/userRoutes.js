// routes/UserRoutes/userRoutes.js
import express from "express";
import userController from "../../controllers/Users/userController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", userController.loginUser);
router.post("/register", userController.createUser);
router.get("/check-auth", verifyToken, userController.checkAuth);
router.post("/logout", verifyToken, userController.logoutUser);
router.put("/:id", verifyToken, userController.updateUser);

router.get("/search", verifyToken, userController.searchUsers);
router.get("/all", verifyToken, userController.getAllUsers);

export default router;
