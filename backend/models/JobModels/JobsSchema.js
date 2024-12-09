/**
 * Job Schema
 *
 * Core schema for managing art commission jobs. Handles the complete lifecycle
 * from posting to completion, including:
 * - Job details and requirements
 * - Application processing
 * - Milestone tracking
 * - Project timeline management
 */
import mongoose from "mongoose"

const requirementSchema = new mongoose.Schema({
  skillRequired: { type: String, required: true },
  experienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "expert"],
    required: true,
  },
  description: { type: String },
})

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

const jobSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Requester",
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
    duration: { type: Number },
  },
  requirements: [requirementSchema],
  milestones: [milestoneSchema],
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application"
}],
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

const Job = mongoose.model("Job", jobSchema, "job_listings")  // Changed collection name to "job_listings"
export default Job
