/**
 * User Controller
 *
 * Handles user authentication and profile management:
 * - User registration with role-specific profiles (Artist/Requester)
 * - Authentication with JWT tokens
 * - Session management with secure cookies
 * - Profile updates and authorization checks
 */
import User from "../../models/UserModels/UserSchema.js"
import ArtistProfile from "../../models/ArtistModels/ArtistSchema.js"
import RequesterProfile from "../../models/RequesterModels/RequesterSchema.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set")
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  })
}

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  })
}

const userController = {
  createUser: async (req, res) => {
    try {
      const { username, name, email, password, role, skills } = req.body

      if (
        !username?.trim() ||
        !name?.trim() ||
        !email?.trim() ||
        !password ||
        !role
      ) {
        return res.status(400).json({ message: "All fields are required." })
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
          .json({ message: "Username or email already exists." })
      }

      const user = new User({
        username: username.toLowerCase(),
        name,
        email: email.toLowerCase(),
        role,
        password,
      })
      await user.save()

      const profileModel = role === "artist" ? ArtistProfile : RequesterProfile
      await new profileModel({
        userId: user._id,
        ...(role === "artist" && {
          skills: { primary: skills?.primary || [] },
        }),
      }).save()

      const token = generateToken(user._id)
      setAuthCookie(res, token)

      const userData = user.toObject()
      delete userData.passwordHash

      res.status(201).json({
        user: userData,
        message: "User created successfully.",
      })
    } catch (error) {
      console.error("Error creating user:", error)
      res.status(500).json({ message: "Failed to create user." })
    }
  },

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username?.trim() || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required." })
      }

      const user = await User.findOne({ username: username.toLowerCase() })
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials." })
      }

      const token = generateToken(user._id)
      setAuthCookie(res, token)

      const userData = user.toObject()
      delete userData.passwordHash

      res.status(200).json({
        user: userData,
        message: "Login successful",
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  logoutUser: async (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
      console.error("Logout error:", error)
      res.status(200).json({ message: "Logged out successfully" })
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id

      if (req.user.id !== userId) {
        return res.status(403).json({ message: "Not authorized" })
      }

      const updates = req.body
      delete updates.password
      delete updates.passwordHash

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true, select: "-passwordHash" }
      )

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.status(200).json({ user })
    } catch (error) {
      console.error("Update error:", error)
      res.status(500).json({ message: "Error updating user" })
    }
  },

  checkAuth: async (req, res) => {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: "Not authorized - no token" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select("-passwordHash")

      if (!user || !user.active) {
        return res
          .status(401)
          .json({ message: "Not authorized - invalid user" })
      }

      res.status(200).json({ user, message: "Auth valid" })
    } catch (error) {
      res.status(401).json({ message: "Not authorized - token failed" })
    }
  },
}

export default userController
