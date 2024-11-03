// models/ArtistSchema.js
import mongoose from "mongoose"

const portfolioItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
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
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  metadata: {
    fileType: String,
    dimensions: {
      width: Number,
      height: Number,
    },
    software: [String], // e.g., ["Blender", "Maya", "ZBrush"]
    fileSize: Number, // in bytes
    license: String, // e.g., "Commercial", "Personal"
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
    ref: "RequesterProfile",
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

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  period: {
    from: { type: Date },
    to: { type: Date },
  },
  description: { type: String },
})

const artistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioItems: [portfolioItemSchema],
    skills: {
      primary: [
        {
          name: String,
          level: { type: String, enum: ["beginner", "intermediate", "expert"] },
        },
      ],
      secondary: [String],
    },
    experience: [experienceSchema],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        year: Number,
      },
    ],
    bio: { type: String },
    socialLinks: {
      website: { type: String },
      instagram: { type: String },
      artstation: { type: String },
      behance: { type: String },
      linkedin: { type: String },
    },
    professionalInfo: {
      availability: {
        status: { type: String, enum: ["available", "busy", "not_available"] },
        hoursPerWeek: Number,
        timezone: String,
      },
      ratePerHour: {
        amount: Number,
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
          language: String,
          proficiency: {
            type: String,
            enum: ["basic", "intermediate", "fluent", "native"],
          },
        },
      ],
    },
    statistics: {
      totalProjects: { type: Number, default: 0 },
      completedProjects: { type: Number, default: 0 },
      totalEarned: { type: Number, default: 0 },
      responseRate: { type: Number, default: 0 },
      onTimeDelivery: { type: Number, default: 0 },
    },
    reviews: [reviewFromRequesterSchema],
    averageRating: { type: Number, default: 0 },
    badges: [
      {
        name: String,
        description: String,
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
  {
    timestamps: true,
  }
)

// Add virtual for total reviews count
artistSchema.virtual("totalReviews").get(function () {
  return this.reviews.length
})

// Add index for search
artistSchema.index({
  "skills.primary.name": 1,
  "skills.secondary": 1,
  "professionalInfo.availability.status": 1,
})

const Artist = mongoose.model("Artist", artistSchema, "artist_profiles")
export default Artist
