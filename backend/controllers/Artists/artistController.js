import Artist from "../../models/ArtistModels/ArtistSchema.js";
import mongoose from "mongoose";

// Helper function to check if user owns the profile
const checkProfileOwnership = (artistId, authenticatedUserId) => {
  return artistId.toString() === authenticatedUserId.toString();
};

// Helper function to sanitize portfolio item
const sanitizePortfolioItem = (item) => {
  return {
    title: item.title,
    description: item.description || "",
    imageUrl: item.imageUrl,
    category: item.category || "Other",
    tags: Array.isArray(item.tags) ? item.tags : [],
    featured: Boolean(item.featured),
    metadata: {
      fileType: item.metadata?.fileType || "",
      dimensions: {
        width: Number(item.metadata?.dimensions?.width) || 0,
        height: Number(item.metadata?.dimensions?.height) || 0,
      },
      software: Array.isArray(item.metadata?.software)
        ? item.metadata.software
        : [],
      fileSize: Number(item.metadata?.fileSize) || 0,
      license: item.metadata?.license || "",
    },
  };
};

// Get all artists (public endpoint)
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find()
      .populate({
        path: "userId",
        select: "name username avatarUrl location",
      })
      .select(
        "skills.primary averageRating professionalInfo.availability portfolioItems.imageUrl portfolioItems.title"
      );

    // Remove sensitive or unnecessary information for public listing
    const publicArtists = artists.map((artist) => ({
      _id: artist._id,
      userId: artist.userId,
      skills: artist.skills.primary,
      averageRating: artist.averageRating,
      availability:
        artist.professionalInfo?.availability?.status || "unavailable",
      featuredWork: artist.portfolioItems
        .filter((item) => item.featured)
        .slice(0, 3)
        .map((item) => ({
          imageUrl: item.imageUrl,
          title: item.title,
        })),
    }));

    res.status(200).json(publicArtists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { skills, availability } = req.query;

    let query = {};

    // Filter by skills if provided
    if (skills) {
      const skillsList = skills.split(",").map((s) => s.trim());
      query["skills.primary.name"] = { $in: skillsList };
    }

    // Filter by availability if provided
    if (availability) {
      query["professionalInfo.availability.status"] = availability;
    }

    const artists = await Artist.find(query)
      .populate({
        path: "userId",
        select: "name username avatarUrl location",
      })
      .select("skills averageRating professionalInfo.availability")
      .sort({ averageRating: -1, "reviews.length": -1 })
      .limit(10);

    const recommendations = artists.map((artist) => ({
      _id: artist._id,
      userId: artist.userId,
      skills: artist.skills.primary,
      averageRating: artist.averageRating,
      availability: artist.professionalInfo?.availability?.status,
    }));

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    res.status(500).json({
      message: "Error fetching recommendations",
    });
  }
};

// Get artist profile
export const getArtistProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const artistProfile = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate({
      path: "userId",
      select: "name username avatarUrl location",
    });

    if (!artistProfile) {
      return res.status(404).json({ message: "Artist profile not found." });
    }

    // If not the profile owner, return limited information
    if (!checkProfileOwnership(artistProfile.userId._id, req.user._id)) {
      const publicProfile = {
        _id: artistProfile._id,
        userId: artistProfile.userId,
        skills: artistProfile.skills,
        portfolioItems: artistProfile.portfolioItems
          .filter((item) => !item.private)
          .map((item) => ({
            imageUrl: item.imageUrl,
            title: item.title,
            description: item.description,
            category: item.category,
            tags: item.tags,
          })),
        bio: artistProfile.bio,
        socialLinks: artistProfile.socialLinks,
        averageRating: artistProfile.averageRating,
        reviews: artistProfile.reviews.length,
        professionalInfo: {
          availability: artistProfile.professionalInfo?.availability,
          ratePerHour: artistProfile.professionalInfo?.ratePerHour,
          preferredJobTypes: artistProfile.professionalInfo?.preferredJobTypes,
        },
      };
      return res.json(publicProfile);
    }

    res.json(artistProfile);
  } catch (error) {
    console.error("Error retrieving artist profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update artist profile
export const updateArtistProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user is updating their own profile
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const updatedData = req.body;

    // Prevent updating sensitive fields
    delete updatedData.reviews;
    delete updatedData.statistics;
    delete updatedData.averageRating;
    delete updatedData.verificationStatus;

    // Validate professional info if provided
    if (updatedData.professionalInfo) {
      if (updatedData.professionalInfo.ratePerHour) {
        if (updatedData.professionalInfo.ratePerHour.amount < 0) {
          return res
            .status(400)
            .json({ message: "Rate per hour cannot be negative" });
        }
      }
    }

    const updatedProfile = await Artist.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "userId",
      select: "name username avatarUrl location",
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Artist profile not found." });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating artist profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Add portfolio item
export const addPortfolioItem = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user is adding to their own portfolio
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this portfolio" });
    }

    const artist = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found." });
    }

    // Validate required fields
    if (!req.body.imageUrl || !req.body.title) {
      return res
        .status(400)
        .json({ message: "Image URL and title are required." });
    }

    // Sanitize and add the new item
    const newItem = {
      ...sanitizePortfolioItem(req.body),
      createdAt: new Date(),
    };

    artist.portfolioItems.push(newItem);
    await artist.save();

    // Return populated artist data
    const populatedArtist = await Artist.findById(artist._id).populate({
      path: "userId",
      select: "name username avatarUrl location",
    });

    res.status(201).json({
      message: "Portfolio item added successfully",
      portfolioItems: populatedArtist.portfolioItems,
    });
  } catch (error) {
    console.error("Error adding portfolio item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Verify user is updating their own portfolio
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this portfolio" });
    }

    const artist = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found." });
    }

    const itemIndex = artist.portfolioItems.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }

    // Sanitize the updated data
    const sanitizedUpdate = sanitizePortfolioItem({
      ...artist.portfolioItems[itemIndex].toObject(),
      ...req.body,
    });

    // Update the item
    artist.portfolioItems[itemIndex] = sanitizedUpdate;

    await artist.save();

    // Return populated artist data
    const populatedArtist = await Artist.findById(artist._id).populate({
      path: "userId",
      select: "name username avatarUrl location",
    });

    res.json({
      message: "Portfolio item updated successfully",
      portfolioItems: populatedArtist.portfolioItems,
    });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Verify user is deleting from their own portfolio
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this portfolio" });
    }

    const artist = await Artist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found." });
    }

    const initialLength = artist.portfolioItems.length;
    artist.portfolioItems = artist.portfolioItems.filter(
      (item) => item._id.toString() !== itemId
    );

    if (artist.portfolioItems.length === initialLength) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }

    await artist.save();
    res.json({
      message: "Portfolio item deleted successfully",
      remainingItems: artist.portfolioItems.length,
    });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default {
  getAllArtists,
  getRecommendations,
  getArtistProfile,
  updateArtistProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};
