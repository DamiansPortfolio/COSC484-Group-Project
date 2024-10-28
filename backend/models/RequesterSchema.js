import mongoose from "mongoose"

const requesterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  jobsPosted: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      status: { type: String, enum: ["open", "closed"], default: "open" },
      applications: [
        {
          applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User for applicants
          status: {
            type: String,
            enum: ["applied", "interview", "hired", "rejected"],
            default: "applied",
          },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  notifications: [{ type: String }], // For job-related notifications
})

// Create the RequesterProfile model
const Requester = mongoose.model(
  "RequesterProfile",
  requesterProfileSchema,
  "requester_profiles" // Use a custom collection name if desired
)

export default Requester
