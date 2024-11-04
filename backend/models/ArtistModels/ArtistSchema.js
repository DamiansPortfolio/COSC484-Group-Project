// models/ArtistSchema.js
import mongoose from "mongoose"

// Schema for individual portfolio items
const portfolioItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
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
    default: "Other", // Optional default value
  },
  tags: { type: [String], default: [] }, // Default to an empty array
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  metadata: {
    fileType: String,
    dimensions: {
      width: Number,
      height: Number,
    },
    software: { type: [String], default: [] }, // Default to an empty array
    fileSize: { type: Number, min: 0 }, // Non-negative file size
    license: String,
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
})

// Schema for reviews from requesters
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
  rating: { type: Number, required: true, min: 1, max: 5 }, // Enforce rating limits
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
})

// Schema for experience entries
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "" },
  period: {
    from: { type: Date },
    to: { type: Date },
  },
  description: { type: String, default: "" },
})

// Main artist schema
const artistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioItems: { type: [portfolioItemSchema], default: [] }, // Ensure default is an empty array
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
      secondary: { type: [String], default: [] },
    },
    experience: { type: [experienceSchema], default: [] }, // Ensure default is an empty array
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        year: { type: Number, min: 1900, max: new Date().getFullYear() }, // Validate year range
      },
    ],
    bio: { type: String, default: "" },
    socialLinks: {
      website: { type: String, default: "" },
      instagram: { type: String, default: "" },
      artstation: { type: String, default: "" },
      behance: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    professionalInfo: {
      availability: {
        status: {
          type: String,
          enum: ["available", "busy", "not_available"],
          default: "available",
        },
        hoursPerWeek: { type: Number, min: 0 }, // Non-negative hours
        timezone: { type: String, default: "" },
      },
      ratePerHour: {
        amount: { type: Number, min: 0 }, // Non-negative rate
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
          language: { type: String, required: true }, // Make language required
          proficiency: {
            type: String,
            enum: ["basic", "intermediate", "fluent", "native"],
          },
        },
      ],
    },
    statistics: {
      totalProjects: { type: Number, default: 0, min: 0 }, // Non-negative projects
      completedProjects: { type: Number, default: 0, min: 0 },
      totalEarned: { type: Number, default: 0, min: 0 }, // Non-negative earnings
      responseRate: { type: Number, default: 0, min: 0, max: 100 }, // Validate response rate
      onTimeDelivery: { type: Number, default: 0, min: 0, max: 100 }, // Validate on-time delivery
    },
    reviews: { type: [reviewFromRequesterSchema], default: [] }, // Ensure default is an empty array
    averageRating: { type: Number, default: 0, min: 0, max: 5 }, // Validate average rating
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

// Create and export the model
const Artist = mongoose.model("Artist", artistSchema, "artist_profiles")
export default Artist
