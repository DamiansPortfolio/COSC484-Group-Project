import mongoose from "mongoose"
import bcrypt from "bcryptjs" // Use bcryptjs

// In your User model (User.js)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "/path/to/avatar.jpg" },
    location: { type: String, default: "" },
    role: { type: String, enum: ["artist", "requester"], required: true },
  },
  {
    timestamps: true,
  }
)

// Add a virtual for password
userSchema.virtual("password").set(function (password) {
  this._password = password
  this.passwordHash = password
})

// Modify the pre-save hook
userSchema.pre("save", async function (next) {
  if (this._password) {
    const saltRounds = 10
    this.passwordHash = await bcrypt.hash(this._password, saltRounds) // This remains unchanged
  }
  next()
})

const User = mongoose.model("User", userSchema, "users")
export default User
