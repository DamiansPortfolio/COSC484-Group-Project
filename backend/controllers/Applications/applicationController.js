// controllers/Applications/applicationController.js
import Application from "../../models/JobModels/ApplicationSchema.js"
import Job from "../../models/JobModels/JobsSchema.js"
import Artist from "../../models/ArtistModels/ArtistSchema.js"

const applicationController = {
  // Get a single application by ID
  getApplicationById: async (req, res) => {
    try {
      const { applicationId } = req.params

      const application = await Application.findById(applicationId)
        .populate({
          path: "jobId",
          populate: {
            path: "requesterId",
            populate: {
              path: "userId",
              select: "username avatarUrl",
            },
          },
        })
        .populate({
          path: "artistProfileId",
          populate: {
            path: "userId",
            select: "username avatarUrl",
          },
        })

      if (!application) {
        return res.status(404).json({ message: "Application not found" })
      }

      res.status(200).json(application)
    } catch (error) {
      console.error("Error fetching application:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  // Get all applications for a specific artist
  getArtistApplications: async (req, res) => {
    try {
      const { artistId } = req.params

      const applications = await Application.find({ artistProfileId: artistId })
        .populate({
          path: "jobId",
          select: "title description category type budget requesterId",
          populate: {
            path: "requesterId",
            populate: {
              path: "userId",
              select: "username avatarUrl",
            },
          },
        })
        .sort({ createdAt: -1 })

      res.status(200).json(applications)
    } catch (error) {
      console.error("Error fetching artist applications:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  // Update application status
  updateApplicationStatus: async (req, res) => {
    try {
      const { applicationId } = req.params
      const { status } = req.body

      const application = await Application.findById(applicationId)

      if (!application) {
        return res.status(404).json({ message: "Application not found" })
      }

      application.status = status
      application.updatedAt = new Date()
      await application.save()

      res.status(200).json(application)
    } catch (error) {
      console.error("Error updating application:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },
}

export default applicationController
