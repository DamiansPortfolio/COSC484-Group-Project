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
      default: undefined, // Ensure no default value
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

// Password virtual
userSchema.virtual("password").set(function (password) {
  this._password = password
})

// Pre-save middleware
userSchema.pre("save", async function (next) {
  try {
    if (this._password) {
      const salt = await bcrypt.genSalt(10)
      this.passwordHash = await bcrypt.hash(this._password, salt)
    }
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model("User", userSchema, "users")
export default User
