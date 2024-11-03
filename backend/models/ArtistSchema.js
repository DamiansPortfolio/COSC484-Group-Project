import mongoose from "mongoose"

const portfolioItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // e.g., "3D Model", "Illustration", "Animation"
  tags: [String], // For searchable keywords
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false }, // To highlight best work
  metadata: {
    fileType: String, // e.g., "image/jpeg", "image/png"
    dimensions: {
      // For image/canvas dimensions
      width: Number,
      height: Number,
    },
  },
})

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const artistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  portfolioItems: [portfolioItemSchema],
  skills: { type: [String], default: [] },
  bio: { type: String },
  socialLinks: {
    website: { type: String },
    instagram: { type: String },
  },
  reviews: [reviewSchema], // Use the reviewSchema here for structured data
  averageRating: { type: Number, default: 0 },
})

const Artist = mongoose.model("Artist", artistSchema, "artist_profiles")
export default Artist
