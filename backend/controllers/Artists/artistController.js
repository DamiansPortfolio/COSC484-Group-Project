/**
 * Artist Controller
 *
 * Handles artist profile management including:
 * - Public and private profile views
 * - Portfolio management
 * - Activity tracking
 * - Statistics and analytics
 * - Profile updates with security checks
 */
import Artist from "../../models/ArtistModels/ArtistSchema.js"
import Job from "../../models/JobModels/JobsSchema.js"
import mongoose from "mongoose"
import Application from "../../models/JobModels/ApplicationSchema.js"

const artistController = {
  getAllArtists: async (req, res) => {
    try {
      const artists = await Artist.find()
        .populate({
          path: "userId",
          select: "name username avatarUrl location",
        })
        .select(
          "skills.primary averageRating portfolioItems.imageUrl portfolioItems.title"
        )

      console.log("Artists fetched:", artists) // Add logging here

      const publicArtists = artists.map((artist) => ({
        _id: artist._id,
        userId: artist.userId,
        skills: artist.skills.primary,
        averageRating: artist.averageRating,
        featuredWork: artist.portfolioItems
          .filter((item) => item.featured)
          .slice(0, 3)
          .map((item) => ({
            imageUrl: item.imageUrl,
            title: item.title,
          })),
      }))

      res.status(200).json(publicArtists)
    } catch (error) {
      console.error("Error fetching artists:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  getArtistProfile: async (req, res) => {
    try {
      const artistProfile = await Artist.findOne({
        userId: req.params.userId,
      }).populate({
        path: "userId",
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
  },

  updateArtistProfile: async (req, res) => {
    try {
      if (req.params.userId !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }

      const updatedData = { ...req.body }
      delete updatedData.reviews
      delete updatedData.statistics
      delete updatedData.averageRating

      const updatedProfile = await Artist.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(req.params.userId) },
        updatedData,
        { new: true, runValidators: true }
      ).populate({
        path: "userId",
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
  },

  addPortfolioItem: async (req, res) => {
    try {
      if (req.params.userId !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }

      const artist = await Artist.findOne({
        userId: new mongoose.Types.ObjectId(req.params.userId),
      })

      if (!artist) {
        return res.status(404).json({ message: "Artist profile not found." })
      }

      if (!req.body.imageUrl || !req.body.title) {
        return res
          .status(400)
          .json({ message: "Image URL and title are required." })
      }

      const newItem = {
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        description: req.body.description || "",
        createdAt: new Date(),
      }

      artist.portfolioItems.push(newItem)
      await artist.save()

      res.status(201).json({
        message: "Portfolio item added successfully",
        portfolioItems: artist.portfolioItems,
      })
    } catch (error) {
      console.error("Error adding portfolio item:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  getArtistStatistics: async (req, res) => {
    try {
      const artistProfile = await Artist.findOne({
        userId: req.params.userId,
      }).select("statistics averageRating")

      if (!artistProfile) {
        return res.status(404).json({ message: "Artist profile not found" })
      }

      res.json({
        completedJobs: artistProfile.statistics?.completedJobs || 0,
        averageRating: artistProfile.averageRating || 0,
        totalProjects: artistProfile.statistics?.totalProjects || 0,
      })
    } catch (error) {
      console.error("Error fetching statistics:", error)
      res.status(500).json({ message: "Error fetching statistics" })
    }
  },

  getArtistActivities: async (req, res) => {
    try {
      const [artistProfile, jobs] = await Promise.all([
        Artist.findOne({ userId: req.params.userId }).populate("reviews"),
        Job.find({ "applications.artistId": req.params.userId }),
      ])

      if (!artistProfile) {
        return res.status(404).json({ message: "Artist profile not found" })
      }

      const activities = [
        ...jobs.map((job) => ({
          _id: job._id,
          type: "application_submitted",
          description: `Applied to job: ${job.title}`,
          createdAt:
            job.applications.find(
              (app) => app.artistId.toString() === artistProfile._id.toString()
            )?.appliedAt || job.createdAt,
        })),
        ...artistProfile.reviews.map((review) => ({
          _id: review._id,
          type: "review_received",
          description: `Received a ${review.rating}-star review`,
          createdAt: review.createdAt,
        })),
      ]

      const sortedActivities = activities
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)

      res.json(sortedActivities)
    } catch (error) {
      console.error("Error fetching artist activities:", error)
      res.status(500).json({ message: "Error fetching activities" })
    }
  },

  getArtistApplications: async (req, res) => {
    try {
      const userId = req.user.id || req.user._id;
      
      const artist = await Artist.findOne({ userId });
      if (!artist) {
        return res.status(404).json({ message: "Artist profile not found." });
      }

      const applications = await Application.find({ artistProfileId: artist._id })
      .populate({
        path: "jobId",
        select: "title description category type requesterId",
        populate: {
          path: "requesterId",
          select: "userId",
          populate: {
            path: "userId",
            select: "username",
          },
        },
      })
      .sort({ appliedAt: -1 }); // Sort by most recent applications

    console.log("Found applications:", applications); // Debug log
    
    const formattedApplications = applications.map((app) => ({
      _id: app._id,
      status: app.status || "pending",
      appliedAt: app.appliedAt,
      coverLetter: app.coverLetter,
      proposedAmount: app.proposedAmount,
      job: {
        _id: app.jobId._id,
        title: app.jobId.title,
        description: app.jobId.description,
        category: app.jobId.category,
        type: app.jobId.type,
        requester: {
          username: app.jobId.requesterId?.userId?.username || "Unknown User",
        },
      },
    }));

      console.log("Processed applications:", formattedApplications); // Debug log

      res.json(formattedApplications);
    } catch (error) {
      console.error("Error fetching artist applications:", error);
      res.status(500).json({ message: "Error fetching applications." });
    }
  },

}

export default artistController
