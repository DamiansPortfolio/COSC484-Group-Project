import mongoose from "mongoose"

// Define the requirement schema first
const requirementSchema = new mongoose.Schema({
  skillRequired: { type: String, required: true },
  experienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "expert"],
    required: true,
  },
  description: { type: String },
})

// Define the milestone schema
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

// Main job schema
const jobSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Requester",
    required: true,
  },
  // Add accepted artist field
  acceptedArtistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    default: null,
  },
  // Add accepted application reference
  acceptedApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    default: null,
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
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
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
  startedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
})

// Add methods to handle artist acceptance
jobSchema.methods.acceptArtist = async function (applicationId) {
  const application = await this.model("Application").findById(applicationId)
  if (!application) {
    throw new Error("Application not found")
  }

  this.acceptedArtistId = application.artistProfileId
  this.acceptedApplicationId = applicationId
  this.status = "in_progress"
  this.startedAt = new Date()
  this.visibility = "private"

  return this.save()
}

const Job = mongoose.model("Job", jobSchema, "job_listings")
export default Job
