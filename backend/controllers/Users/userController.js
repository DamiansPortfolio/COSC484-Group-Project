// controllers/Users/userController.js
import User from "../../models/UserModels/UserSchema.js"
import { generateToken } from "../../middleware/authMiddleware.js"

const userController = {
  loginUser: async (req, res) => {
    console.log("Login attempt received", { body: req.body })
    try {
      const { username, password } = req.body

      if (!username?.trim() || !password) {
        console.log("Missing credentials")
        return res
          .status(400)
          .json({ message: "Username and password are required" })
      }

      const user = await User.findOne({ username: username.toLowerCase() })
      console.log("User found:", user ? "yes" : "no")

      if (!user || !(await user.comparePassword(password))) {
        console.log("Invalid credentials")
        return res.status(401).json({ message: "Invalid credentials" })
      }

      const token = generateToken(user._id)
      console.log("Token generated")

      const userData = user.toObject()
      delete userData.passwordHash

      console.log("Login successful")
      res.status(200).json({
        user: userData,
        token,
        message: "Login successful",
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Login failed" })
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, name, email, password, role } = req.body

      if (
        !username?.trim() ||
        !name?.trim() ||
        !email?.trim() ||
        !password ||
        !role
      ) {
        return res.status(400).json({ message: "All fields are required" })
      }

      const existingUser = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: email.toLowerCase() },
        ],
      })

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" })
      }

      const user = await User.create({
        username: username.toLowerCase(),
        name,
        email: email.toLowerCase(),
        password, // This will be hashed by the schema
        role,
      })

      const token = generateToken(user._id)

      const userData = user.toObject()
      delete userData.passwordHash

      res.status(201).json({
        user: userData,
        token,
        message: "User created successfully",
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Failed to create user" })
    }
  },

  logoutUser: async (req, res) => {
    // With local storage, logout is handled on the client side
    // We just send a success response
    res.status(200).json({ message: "Logged out successfully" })
  },

  checkAuth: async (req, res) => {
    try {
      const userId = req.user?.id // Updated to match `verifyToken`
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const user = await User.findById(userId).select("-passwordHash")

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      res.status(200).json({
        user,
        message: "Auth valid",
      })
    } catch (error) {
      console.error("Check Auth - Error:", error)
      res.status(401).json({ message: "Authentication failed" })
    }
  },

  updateUser: async (req, res) => {
    try {
      const updates = req.body
      delete updates.password
      delete updates.passwordHash

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-passwordHash")

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.status(200).json({ user })
    } catch (error) {
      console.error("Update error:", error)
      res.status(500).json({ message: "Error updating user" })
    }
  },
}

export default userController
