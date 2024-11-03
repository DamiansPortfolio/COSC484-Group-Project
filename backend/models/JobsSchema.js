// models/JobSchema.js
import mongoose from "mongoose"

// Schema for job requirements
const requirementSchema = new mongoose.Schema({
  skillRequired: { type: String, required: true },
  experienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "expert"],
    required: true,
  },
  description: { type: String },
})

// Schema for job milestones
const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  amount: { type: Number },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "approved"],
    default: "pending",
  },
  deliverables: [
    {
      title: { type: String },
      description: { type: String },
      fileUrl: { type: String },
    },
  ],
})

// Schema for job applications
const applicationSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  coverLetter: { type: String },
  proposedAmount: { type: Number },
  status: {
    type: String,
    enum: ["pending", "shortlisted", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
  portfolio: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId },
      title: { type: String },
      imageUrl: { type: String },
    },
  ],
})

// Main job schema
const jobSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RequesterProfile",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "3D Modeling",
      "Character Design",
      "Illustration",
      "Animation",
      "Texturing",
      "Other",
    ],
    required: true,
  },
  type: {
    type: String,
    enum: ["one-time", "ongoing", "contract"],
    default: "one-time",
  },
  budget: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "USD" },
  },
  timeline: {
    startDate: { type: Date },
    deadline: { type: Date },
    duration: { type: Number }, // in days
  },
  requirements: [requirementSchema],
  milestones: [milestoneSchema],
  applications: [applicationSchema],
  status: {
    type: String,
    enum: ["draft", "open", "in_progress", "completed", "cancelled"],
    default: "draft",
  },
  visibility: {
    type: String,
    enum: ["public", "private", "invited"],
    default: "public",
  },
  metadata: {
    views: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now },
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
})

const Job = mongoose.model("Job", jobSchema, "jobs")
export default Job
