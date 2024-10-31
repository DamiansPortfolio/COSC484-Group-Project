import mongoose from "mongoose"

const jobsSchema = new mongoose.Schema({
  requester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RequesterProfile",
    required: true,
  },
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    default: null, // Make it optional
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyName: { type: String },
  location: {
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  qualifications: [String],
  amount: { type: Number, required: true }, // Changed from Double to Number
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["open", "in_progress", "completed", "closed"],
    default: "open",
  },
  applications: [
    {
      artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
})
const Jobs = mongoose.model("Jobs", jobsSchema, "job_listings")

export default Jobs
