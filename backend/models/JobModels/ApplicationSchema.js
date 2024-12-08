import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
  // Relationship links
  artistProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  
  // Application form data
  coverLetter: {
    type: String,
    required: true
  },
  proposedAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Status tracking
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "withdrawn"],
    default: "pending"
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Communication history
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Additional metadata
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Application = mongoose.model("Application", applicationSchema, "applications")
export default Application