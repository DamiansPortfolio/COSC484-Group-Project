/**
 * Requester Schema
 *
 * Manages client/commissioner profiles including:
 * - Company/organization details
 * - Job posting history and statistics
 * - Artist review management
 * - Payment preferences
 * - Account verification status
 */
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
    name: { type: String, default: "Default Company" },
    website: { type: String, default: "https://cat-bounce.com" },
    description: { type: String, default: "Default Company Description" },
    logo: { type: String,  default: "path\to\logo.jpg" },
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
    totalProjects: { type: Number, default: 0, min: 0 },
    completedProjects: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0, min: 0 },
    responseRate: { type: Number, default: 0, min: 0, max: 100 },
    onTimeDelivery: { type: Number, default: 0, min: 0, max: 100 },
    activeApplications: [{ type: Number, default: 0, min: 0, max: 100 }],
    completedJobs: { type: Number, default: 0, min: 0 },
    totalApplications: [{ type: Number, default: 0, min: 0, max: 100 }],
    currentRating: { type: Number, default: 0, min: 0, max: 5 },
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

const Requester = mongoose.model(
  "Requester",
  requesterSchema,
  "requester_profiles"
)
export default Requester
