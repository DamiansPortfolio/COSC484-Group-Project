// routes/UserRoutes/userRoutes.js
import express from "express"
import userController from "../../controllers/Users/userController.js"
import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/login", userController.loginUser)
router.post("/register", userController.createUser)
router.get("/check-auth", userController.checkAuth)
router.post("/logout", userController.logoutUser)
router.put("/:id", protect, userController.updateUser)

export default router
