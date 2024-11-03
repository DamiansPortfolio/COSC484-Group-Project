import User from "../models/User.js"
import ArtistProfile from "../models/ArtistSchema.js"
import RequesterProfile from "../models/RequesterSchema.js"

import bcrypt from "bcryptjs" // Use bcryptjs
import jwt from "jsonwebtoken"

// Create a new user and associated profiles based on the role
export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body

    // Check if all required fields are provided
    if (!username || !name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." })
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." })
    }

    // Create the user
    const user = new User({ username, name, email, password, role })
    await user.save()

    // Create associated profile based on user role
    if (role === "artist") {
      const artistProfile = new ArtistProfile({
        userId: user._id,
        portfolioItems: [],
        skills: skills || [], // Assign skills from the request
        bio: "",
        socialLinks: { website: "", instagram: "" },
        reviews: [],
        averageRating: 0,
      })
      await artistProfile.save()
    } else if (role === "requester") {
      const requesterProfile = new RequesterProfile({
        userId: user._id,
        jobsPosted: [],
        notifications: [],
      })
      await requesterProfile.save()
    }

    // Respond with the created user information
    const { passwordHash, ...userData } = user.toObject() // Exclude password from the response
    res
      .status(201)
      .json({ user: userData, message: "User created successfully." })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log("Attempting to fetch all users...")
    const users = await User.find().select("-passwordHash")
    console.log(`Found ${users.length} users`)
    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      message: "Internal server error.",
      error: error.message, // Add this for debugging
    })
  }
}

// Get a user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).select("-passwordHash") // Exclude passwordHash from response

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Update a user
export const updateUser = async (req, res) => {
  const userId = req.params.id
  try {
    const updatedData = req.body

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-passwordHash") // Exclude passwordHash from response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." })
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Delete a user
export const deleteUser = async (req, res) => {
  const userId = req.params.id
  try {
    await ArtistProfile.deleteOne({ userId })
    await RequesterProfile.deleteOne({ userId })

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." })
    }

    res.status(200).json({ message: "User deleted successfully." })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Login user
// Login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user by username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash) // This remains unchanged
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    // Exclude the password from the response
    const { passwordHash, ...userData } = user.toObject()
    res.status(200).json({ user: userData, token })
  } catch (error) {
    console.error("Error logging in user:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
}
