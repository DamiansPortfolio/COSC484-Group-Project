import express from "express"
import {
  updateUser,
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
} from "../controllers/userController.js"

const router = express.Router()

// POST route for logging in a user
router.post("/login", loginUser)

// POST route for creating a user
router.post("/register", createUser)

// GET route for retrieving all users
router.get("/", getAllUsers)

// GET route for retrieving a user by their ID
router.get("/:id", getUserById)

// PUT route for updating user
router.put("/:id", updateUser)

export default router
