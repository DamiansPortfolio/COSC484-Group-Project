/**
 * User Schema
 *
 * Core authentication and user management schema handling:
 * - User authentication and security
 * - Role-based access control
 * - Account verification
 * - Password reset/recovery
 * - Rate limiting for failed login attempts
 */
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

userSchema.virtual("password").set(function (password) {
  if (password) {
    const salt = bcrypt.genSaltSync(10)
    this.passwordHash = bcrypt.hashSync(password, salt)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.accountLockUntil && this.accountLockUntil > Date.now()) {
    throw new Error("Account is temporarily locked. Please try again later.")
  }

  const isMatch = await bcrypt.compare(candidatePassword, this.passwordHash)

  if (!isMatch) {
    this.failedLoginAttempts += 1
    if (this.failedLoginAttempts >= 5) {
      this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000)
    }
    await this.save()
    throw new Error("Invalid password")
  }

  if (this.failedLoginAttempts > 0) {
    this.failedLoginAttempts = 0
    this.accountLockUntil = undefined
    await this.save()
  }

  return true
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

userSchema.index({ emailVerificationToken: 1 }, { sparse: true })
userSchema.index({ passwordResetToken: 1 }, { sparse: true })

const User = mongoose.model("User", userSchema, "users")
export default User
