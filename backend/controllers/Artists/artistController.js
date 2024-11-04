// controllers/artistProfileController.js
import Artist from "../../models/ArtistModels/ArtistSchema.js"
import mongoose from "mongoose"

// Get all artists
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().populate({
      path: "userId",
      model: "User",
      select: "name username avatarUrl location",
    })
    res.status(200).json(artists)
  } catch (error) {
    console.error("Error fetching artists:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getRecommendations = async (req, res) => {
  try {
    console.log("Fetching recommendations...") // Debug log

    const artists = await Artist.find()
      .populate({
        path: "userId",
        model: "User",
        select: "name username avatarUrl location",
      })
      .select("userId skills averageRating professionalInfo.availability")
      .sort({ averageRating: -1 })
      .limit(10) // Limit to 10 recommendations

    console.log(`Found ${artists.length} recommendations`) // Debug log

    res.status(200).json(artists)
  } catch (error) {
    console.error("Error in getRecommendations:", error)
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    })
  }
}

// Update the getArtistProfile to be more specific about userId check
export const getArtistProfile = async (req, res) => {
  try {
    const userId = req.params.userId

    // Only check for valid userId format if it's not "recommendations"
    if (
      userId !== "recommendations" &&
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid userId format." })
    }

    const artistProfile = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate({
      path: "userId",
      model: "User",
      select: "name username avatarUrl location",
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

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format." })
  }

  try {
    const updatedProfile = await Artist.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updatedData,
      { new: true }
    ).populate({
      path: "userId",
      model: "User",
      select: "name username avatarUrl location",
    })

    if (!updatedProfile) {
      return res.status(404).json({ message: "Artist profile not found." })
    }

    res.status(200).json(updatedProfile)
  } catch (error) {
    console.error("Error updating artist profile:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Add portfolio item
export const addPortfolioItem = async (req, res) => {
  const userId = req.params.userId
  const portfolioItem = req.body

  try {
    const artist = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found." })
    }

    // Validate required fields
    if (!portfolioItem.imageUrl || !portfolioItem.title) {
      return res
        .status(400)
        .json({ message: "Image URL and title are required." })
    }

    // Add defaults for new fields
    const newItem = {
      ...portfolioItem,
      category: portfolioItem.category || "Other",
      tags: portfolioItem.tags || [],
      featured: portfolioItem.featured || false,
      createdAt: new Date(),
      metadata: portfolioItem.metadata || {},
    }

    artist.portfolioItems.push(newItem)
    await artist.save()

    // Return populated artist data
    const populatedArtist = await Artist.findById(artist._id).populate({
      path: "userId",
      model: "User",
      select: "name username avatarUrl location",
    })

    res.status(201).json(populatedArtist)
  } catch (error) {
    console.error("Error adding portfolio item:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  const { userId, itemId } = req.params
  const updates = req.body

  try {
    const artist = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found." })
    }

    const itemIndex = artist.portfolioItems.findIndex(
      (item) => item._id.toString() === itemId
    )

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Portfolio item not found." })
    }

    // Update the item
    artist.portfolioItems[itemIndex] = {
      ...artist.portfolioItems[itemIndex].toObject(),
      ...updates,
    }

    await artist.save()

    // Return populated artist data
    const populatedArtist = await Artist.findById(artist._id).populate({
      path: "userId",
      model: "User",
      select: "name username avatarUrl location",
    })

    res.json(populatedArtist)
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  const { userId, itemId } = req.params

  try {
    const artist = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found." })
    }

    artist.portfolioItems = artist.portfolioItems.filter(
      (item) => item._id.toString() !== itemId
    )

    await artist.save()
    res.json({ message: "Portfolio item deleted successfully." })
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export default {
  getAllArtists,
  getRecommendations,
  getArtistProfile,
  updateArtistProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
}
