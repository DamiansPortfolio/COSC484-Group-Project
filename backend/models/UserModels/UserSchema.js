import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["artist", "requester"],
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "/path/to/avatar.jpg",
    },
    location: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockUntil: Date,
    lastLogin: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Optimize password hashing with a more efficient approach
userSchema.virtual("password").set(function (password) {
  if (password) {
    try {
      const salt = bcrypt.genSaltSync(10)
      this.passwordHash = bcrypt.hashSync(password, salt)
    } catch (error) {
      console.error("Password hashing error:", error)
      throw new Error("Error setting password")
    }
  }
})

// Optimized password comparison with timeout and better error handling
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Check for account lock first
    if (this.accountLockUntil && this.accountLockUntil > Date.now()) {
      const waitTime = Math.ceil(
        (this.accountLockUntil - Date.now()) / 1000 / 60
      )
      throw new Error(
        `Account is locked. Please try again in ${waitTime} minutes.`
      )
    }

    // Add timeout to bcrypt compare
    const isMatch = await Promise.race([
      bcrypt.compare(candidatePassword, this.passwordHash),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Password comparison timeout")), 4000)
      ),
    ])

    if (!isMatch) {
      // Increment failed attempts but don't wait for save
      this.failedLoginAttempts += 1
      if (this.failedLoginAttempts >= 5) {
        this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000)
      }
      this.save().catch((err) =>
        console.error("Error saving failed attempts:", err)
      )
      throw new Error("Invalid credentials")
    }

    // Reset failed attempts in background
    if (this.failedLoginAttempts > 0) {
      this.failedLoginAttempts = 0
      this.accountLockUntil = undefined
      this.save().catch((err) =>
        console.error("Error resetting failed attempts:", err)
      )
    }

    // Update last login time in background
    this.lastLogin = new Date()
    this.save().catch((err) => console.error("Error updating last login:", err))

    return true
  } catch (error) {
    // Log the error but don't expose internal details
    console.error("Password comparison error:", error)
    if (error.message.includes("timeout")) {
      throw new Error("Login request timed out. Please try again.")
    }
    throw new Error(
      error.message.includes("Account is locked")
        ? error.message
        : "Invalid credentials"
    )
  }
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetToken
}

// Optimize indexes
userSchema.index({ username: 1, email: 1 })
userSchema.index({ emailVerificationToken: 1 }, { sparse: true })
userSchema.index({ passwordResetToken: 1 }, { sparse: true })

const User = mongoose.model("User", userSchema, "users")
export default User
