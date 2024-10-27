import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "/path/to/default_avatar.jpg" },
    location: { type: String, default: "" },
    role: { type: String, enum: ["artist", "requester"], required: true },
    // Add any other fields as needed...
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
)

// If password hashing is required, consider using pre-save hook
userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    // Hash password here, e.g., using bcrypt
    const bcrypt = await import("bcrypt")
    const saltRounds = 10
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds)
  }
  next()
})

const User = mongoose.model("User", userSchema)
export default User
