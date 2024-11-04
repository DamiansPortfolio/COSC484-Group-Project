// models/RequesterSchema.js
import mongoose from "mongoose"

const reviewFromArtistSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const requesterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    name: { type: String },
    website: { type: String },
    description: { type: String },
    logo: { type: String },
  },
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  preferences: {
    jobAlerts: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    currency: { type: String, default: "USD" },
  },
  statistics: {
    totalJobsPosted: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  reviews: [reviewFromArtistSchema],
  averageRating: { type: Number, default: 0 },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "unverified"],
    default: "pending",
  },
  paymentMethods: [
    {
      type: { type: String },
      isDefault: { type: Boolean },
      lastFour: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

// Create and export the model
const Requester = mongoose.model("Requester", requesterSchema, "requesters")
export default Requester
