import Requester from "../models/RequesterSchema.js"
import mongoose from "mongoose"

// Get all requesters
export const getAllRequesters = async (req, res) => {
  try {
    const requester = await Requester.find()
    res.status(200).json(requester)
  } catch (error) {
    console.error("Error fetching requester:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getRequesterProfile = async (req, res) => {
  try {
    const userId = req.params.userId
    console.log("Received userId:", userId)

    const objectId = new mongoose.Types.ObjectId(userId)
    console.log("Converting userId to ObjectId:", objectId)

    const requesterProfile = await Requester.findOne({ userId: objectId })
    console.log("Querying requester profile with ObjectId:", objectId)
    console.log("Fetched requester profile:", requesterProfile)

    if (!requesterProfile) {
      console.warn("Requester profile not found for userId:", userId)
      return res.status(404).json({ message: "Requester profile not found" })
    }

    res.json(requesterProfile)
  } catch (error) {
    console.error("Error retrieving requester profile:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update artist profile
export const updateRequesterProfile = async (req, res) => {
  const userId = req.params.userId
  const updatedData = req.body

  console.log("Received userId for update:", userId)
  console.log("Received updated data:", updatedData)

  try {
    // Check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId)
      return res.status(400).json({ message: "Invalid userId format." })
    }

    const updatedProfile = await Requester.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) }, // Ensure userId is ObjectId
      updatedData,
      { new: true }
    )

    console.log("Updated requester profile:", updatedProfile)

    if (!updatedProfile) {
      console.warn(
        "Requester profile not found for update with userId:",
        userId
      )
      return res.status(404).json({ message: "Requester profile not found." })
    }

    res.status(200).json(updatedProfile)
  } catch (error) {
    console.error("Error updating artist profile:", error.message || error)
    res.status(500).json({ message: "Internal server error." })
  }
}
