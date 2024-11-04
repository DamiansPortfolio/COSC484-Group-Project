import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
)

// Modify the virtual to properly handle the password
userSchema.virtual("password").set(function (password) {
  // Store the password temporarily
  this._password = password
  // Hash it immediately
  if (password) {
    const salt = bcrypt.genSaltSync(10)
    this.passwordHash = bcrypt.hashSync(password, salt)
  }
})

// Remove the pre-save middleware since we're handling password hashing in the virtual

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

const User = mongoose.model("User", userSchema, "users")
export default User
