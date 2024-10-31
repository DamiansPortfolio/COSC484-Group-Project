import Artist from "../models/ArtistSchema.js"
import mongoose from "mongoose"

// Get all artists
export const getAllArtists = async (req, res) => {
  try {
    const artist = await Artist.find()
    res.status(200).json(artist)
  } catch (error) {
    console.error("Error fetching artists:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getArtistProfile = async (req, res) => {
  try {
    const userId = req.params.userId

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." })
    }

    const artistProfile = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!artistProfile) {
      return res.status(404).json({ message: "Artist profile not found." })
    }

    res.json(artistProfile)
  } catch (error) {
    console.error("Error retrieving artist profile:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update artist profile
export const updateArtistProfile = async (req, res) => {
  const userId = req.params.userId
  const updatedData = req.body

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format." })
  }

  try {
    const updatedProfile = await Artist.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updatedData,
      { new: true }
    )

    if (!updatedProfile) {
      return res.status(404).json({ message: "Artist profile not found." })
    }

    res.status(200).json(updatedProfile)
  } catch (error) {
    console.error("Error updating artist profile:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}
