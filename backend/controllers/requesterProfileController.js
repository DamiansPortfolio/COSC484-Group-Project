// controllers/requesterProfileController.js
import Requester from "../models/RequesterSchema.js"
import mongoose from "mongoose"

export const getAllRequesters = async (req, res) => {
  try {
    const requesters = await Requester.find()
      .populate("userId", "name username location")
      .populate("jobs", "title status createdAt")
    res.status(200).json(requesters)
  } catch (error) {
    console.error("Error fetching requesters:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getRequesterProfile = async (req, res) => {
  try {
    const userId = req.params.userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." })
    }

    const requesterProfile = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("userId", "name username location")
      .populate("jobs", "title status createdAt")

    if (!requesterProfile) {
      return res.status(404).json({ message: "Requester profile not found" })
    }

    res.json(requesterProfile)
  } catch (error) {
    console.error("Error retrieving requester profile:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateRequesterProfile = async (req, res) => {
  const userId = req.params.userId
  const updatedData = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." })
    }

    const updatedProfile = await Requester.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updatedData,
      { new: true }
    )

    if (!updatedProfile) {
      return res.status(404).json({ message: "Requester profile not found." })
    }

    res.status(200).json(updatedProfile)
  } catch (error) {
    console.error("Error updating requester profile:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const addPaymentMethod = async (req, res) => {
  try {
    const { userId } = req.params
    const paymentMethod = req.body

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" })
    }

    requester.paymentMethods.push(paymentMethod)
    await requester.save()

    res.status(201).json(requester)
  } catch (error) {
    console.error("Error adding payment method:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const removePaymentMethod = async (req, res) => {
  try {
    const { userId, methodId } = req.params

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" })
    }

    requester.paymentMethods = requester.paymentMethods.filter(
      (method) => method._id.toString() !== methodId
    )

    await requester.save()
    res.json({ message: "Payment method removed successfully" })
  } catch (error) {
    console.error("Error removing payment method:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const updatePreferences = async (req, res) => {
  try {
    const { userId } = req.params
    const preferences = req.body

    const requester = await Requester.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { preferences },
      { new: true }
    )

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" })
    }

    res.json(requester)
  } catch (error) {
    console.error("Error updating preferences:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getRequesterStats = async (req, res) => {
  try {
    const { userId } = req.params

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" })
    }

    res.json(requester.statistics)
  } catch (error) {
    console.error("Error fetching statistics:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getRequesterJobs = async (req, res) => {
  try {
    const { userId } = req.params

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate({
      path: "jobs",
      populate: {
        path: "applications.artistId",
        select: "userId skills averageRating",
      },
    })

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" })
    }

    res.json(requester.jobs)
  } catch (error) {
    console.error("Error fetching requester jobs:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const addReview = async (req, res) => {
  try {
    const { userId } = req.params
    const reviewData = req.body

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" })
    }

    // Add the review
    requester.reviews.push(reviewData)

    // Recalculate average rating
    const totalRating = requester.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    requester.averageRating = totalRating / requester.reviews.length

    await requester.save()
    res.status(201).json(requester)
  } catch (error) {
    console.error("Error adding review:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export default {
  getAllRequesters,
  getRequesterProfile,
  updateRequesterProfile,
  addPaymentMethod,
  removePaymentMethod,
  updatePreferences,
  getRequesterStats,
  getRequesterJobs,
  addReview,
}
