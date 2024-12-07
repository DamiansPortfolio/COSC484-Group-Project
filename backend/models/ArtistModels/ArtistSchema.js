/**
 * Artist Schema
 *
 * Professional profile management for artists including:
 * - Portfolio management
 * - Skills and experience tracking
 * - Project history and statistics
 * - Professional availability and rates
 * - Review/rating system
 * - Achievement tracking
 */
import mongoose from "mongoose"

const portfolioItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "Default Description" },
  category: {
    type: String,
    enum: [
      "3D Model",
      "Character Design",
      "Illustration",
      "Animation",
      "Texturing",
      "Other",
    ],
    default: "Other",
  },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  metadata: {
    fileType: String,
    dimensions: {
      width: Number,
      height: Number,
    },
    software: { type: [String], default: [] },
    fileSize: { type: Number, min: 0 },
    license: String,
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
})

const reviewFromRequesterSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Requester",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
})

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "Default Company" },
  period: {
    from: { type: Date },
    to: { type: Date },
  },
  description: { type: String, default: "Default Description" },
})

const artistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioItems: { type: [portfolioItemSchema], default: [] },
    skills: {
      primary: [
        {
          name: { type: String, required: true },
          level: {
            type: String,
            enum: ["beginner", "intermediate", "expert"],
            default: "beginner",
          },
        },
      ],
      secondary: { type: [String], default: ["Being Awesome"] },
    },
    experience: { type: [experienceSchema], default: [] },
    education: [
      {
        institution: { type: String, default: "default institution" },
        degree: { type: String, default: "default degree" },
        field: { type: String, default: "default field" },
        year: { type: Number, min: 1900, max: new Date().getFullYear() },
      },
    ],
    bio: { type: String, default: "Default Bio" },
    socialLinks: {
      website: { type: String, default: "http://www.staggeringbeauty.com" },
      instagram: { type: String, default: "@socialmediasucks" },
      artstation: { type: String, default: "@artstation" },
      behance: { type: String, default: "@behance" },
      linkedin: { type: String, default: "@getmeajobprettypls" },
    },
    professionalInfo: {
      availability: {
        status: {
          type: String,
          enum: ["available", "busy", "not_available"],
          default: "available",
        },
        hoursPerWeek: { type: Number, min: 0 },
        timezone: { type: String, default: "" },
      },
      ratePerHour: {
        amount: { type: Number, min: 0 },
        currency: { type: String, default: "USD" },
      },
      preferredJobTypes: [
        {
          type: String,
          enum: ["full-time", "part-time", "contract", "one-time"],
        },
      ],
      languages: [
        {
          language: { type: String, required: true },
          proficiency: {
            type: String,
            enum: ["basic", "intermediate", "fluent", "native"],
          },
        },
      ],
    },
    statistics: {
      totalProjects: { type: Number, default: 0, min: 0 },
      completedProjects: { type: Number, default: 0, min: 0 },
      totalEarned: { type: Number, default: 0, min: 0 },
      responseRate: { type: Number, default: 0, min: 0, max: 100 },
      onTimeDelivery: { type: Number, default: 0, min: 0, max: 100 },
      activeApplications: { type: Number, default: 0, min: 0 },
      completedJobs: { type: Number, default: 0, min: 0 },
      totalApplications: { type: Number, default: 0, min: 0 },
      currentRating: { type: Number, default: 0, min: 0, max: 5 },
    },
    reviews: { type: [reviewFromRequesterSchema], default: [] },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    badges: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        awardedAt: { type: Date, default: Date.now },
      },
    ],
    preferences: {
      jobAlerts: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      visibility: {
        type: String,
        enum: ["public", "private", "connections_only"],
        default: "public",
      },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "unverified"],
      default: "pending",
    },
  },
  { timestamps: true }
)

artistSchema.virtual("totalReviews").get(function () {
  return this.reviews.length
})

const Artist = mongoose.model("Artist", artistSchema, "artist_profiles")
export default Artist
