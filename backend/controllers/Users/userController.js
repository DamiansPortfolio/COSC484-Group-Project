import User from "../../models/UserModels/UserSchema.js"
import { generateToken } from "../../middleware/authMiddleware.js"
import Artist from "../../models/ArtistModels/ArtistSchema.js"
import Requester from "../../models/RequesterModels/RequesterSchema.js"

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

      // Log the incoming request data
      console.log("Registration attempt:", { username, name, email, role })

      if (
        !username?.trim() ||
        !name?.trim() ||
        !email?.trim() ||
        !password ||
        !role
      ) {
        return res.status(400).json({ message: "All fields are required" })
      }

      if (
        username.length < 3 ||
        username.length > 24 ||
        password.length <= 7 ||
        /\d/.test(password) === false ||
        /[^a-zA-Z0-9]/.test(password) === false ||
        /[A-Z]/.test(password) === false
      ) {
        var error = []

        //test if the username is between 3 and 24 characters
        if (username.length < 3) {
          error.push("Username must be greater than 3 characters")
        } else if (username.length > 24) {
          error.push("Username must be less than 24 characters")
        }

        //test if password if greater than 8 characters
        if (password.length <= 7) {
          error.push("Password must be greater than 8 characters")
        }

        //test if there is a number in the password
        if (!/\d/.test(password)) {
          error.push("Password must contain at least one number")
        }

        //test if there is a special character in the password
        if (!/[^a-zA-Z0-9]/.test(password)) {
          error.push("Password must contain a special character")
        }

        //test if there is a capital letter in the password
        if (!/[A-Z]/.test(password)) {
          error.push("password must contain a capital letter")
        }

        var errMessage = ""
        error.forEach(function (x, i) {
          if (i === error.length - 1) {
            errMessage += x
          } else {
            errMessage += x + ", "
          }
        })

        return res.status(400).json({ message: errMessage })
      }

      if (
        username.length < 3 ||
        username.length > 24 ||
        password.length <= 7 ||
        /\d/.test(password) === false ||
        /[^a-zA-Z0-9]/.test(password) === false ||
        /[A-Z]/.test(password) === false
      ) {
        var error = []

        //test if the username is between 3 and 24 characters
        if (username.length < 3) {
          error.push("Username must be greater than 3 characters")
        } else if (username.length > 24) {
          error.push("Username must be less than 24 characters")
        }

        //test if password if greater than 8 characters
        if (password.length <= 7) {
          error.push("Password must be greater than 8 characters")
        }

        //test if there is a number in the password
        if (!/\d/.test(password)) {
          error.push("Password must contain at least one number")
        }

        //test if there is a special character in the password
        if (!/[^a-zA-Z0-9]/.test(password)) {
          error.push("Password must contain a special character")
        }

        //test if there is a capital letter in the password
        if (!/[A-Z]/.test(password)) {
          error.push("password must contain a capital letter")
        }

        var errMessage = ""
        error.forEach(function (x, i) {
          if (i === error.length - 1) {
            errMessage += x
          } else {
            errMessage += x + ", "
          }
        })

        return res.status(400).json({ message: errMessage })
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
        password,
        role,
      })

      // Create the corresponding profile based on role
      try {
        if (role === "artist") {
          await Artist.create({ userId: user._id })
        } else if (role === "requester") {
          await Requester.create({ userId: user._id })
        }
      } catch (profileError) {
        await User.findByIdAndDelete(user._id)
        throw new Error("Failed to create user profile")
      }

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
      res.status(500).json({
        message: error.message || "Failed to create user",
      })
    }
  },

  logoutUser: async (req, res) => {
    // With local storage, logout is handled on the client side
    // We just send a success response
    res.status(200).json({ message: "Logged out successfully" })
  },

  searchUsers: async (req, res) => {
    try {
      const { role } = req.query
      let query = {
        active: true,
        _id: { $ne: req.user.id }, // Exclude current user
      }

      // Only add role filter if specified (either 'artist' or 'requester')
      if (role && role !== "all") {
        query.role = role
      }

      const users = await User.find(query)
        .select("username name role avatarUrl")
        .sort("name")

      res.status(200).json(users)
    } catch (error) {
      console.error("Search users error:", error)
      res.status(500).json({ message: "Failed to search users" })
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({
        active: true,
        _id: { $ne: req.user.id },
      })
        .select("username name role avatarUrl")
        .sort("name")

      res.status(200).json(users)
    } catch (error) {
      console.error("Get all users error:", error)
      res.status(500).json({ message: "Failed to get users" })
    }
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

  getProfileType: async (req, res) => {
    try {
      const { id } = req.params

      // Check if it's an Artist profile
      const isArtist = await Artist.findOne({ userId: id })
      if (isArtist) {
        return res.status(200).json({ type: "artist" })
      }

      // Check if it's a Requester profile
      const isRequester = await Requester.findOne({ userId: id })
      if (isRequester) {
        return res.status(200).json({ type: "requester" })
      }

      // If neither, return not found
      return res.status(404).json({ message: "Profile type not found" })
    } catch (error) {
      console.error("Error fetching profile type:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  },
}

export default userController
