// controllers/Statistics/statisticsController.js
import Job from "../../models/JobModels/JobsSchema.js"
import Application from "../../models/JobModels/ApplicationSchema.js"
import Artist from "../../models/ArtistModels/ArtistSchema.js"
import Requester from "../../models/RequesterModels/RequesterSchema.js"

const statisticsController = {
  getRequesterStats: async (req, res) => {
    try {
      const userId = req.params.requesterId
      console.log("Looking up stats for userId:", userId)

      // Get all jobs for this requester
      const jobs = await Job.find({
        requesterId: userId,
        status: { $ne: "draft" }, // Exclude draft jobs
      }).exec()

      console.log("Found jobs:", jobs.length)

      // Get all applications for these jobs
      const jobIds = jobs.map((job) => job._id)
      const applications = await Application.find({
        jobId: { $in: jobIds },
      }).exec()

      console.log("Found applications:", applications.length)

      const stats = {
        activeJobs: jobs.filter(
          (job) => job.status === "open" || job.status === "in_progress"
        ).length,
        totalJobs: jobs.length,
        jobsWithHires: jobs.filter((job) => job.acceptedArtistId !== null)
          .length,
        avgApplicationsPerJob:
          jobs.length > 0 ? (applications.length / jobs.length).toFixed(1) : 0,
        totalApplications: applications.length,
      }

      console.log("Calculated stats:", stats)
      res.status(200).json(stats)
    } catch (error) {
      console.error("Error fetching requester statistics:", error)
      res.status(500).json({ message: "Error fetching statistics" })
    }
  },

  getArtistStats: async (req, res) => {
    try {
      const userId = req.params.artistId

      // First find the artist profile using userId
      const artistProfile = await Artist.findOne({ userId })
      if (!artistProfile) {
        return res.status(404).json({ message: "Artist profile not found" })
      }

      // Get all applications by this artist
      const applications = await Application.find({
        artistProfileId: artistProfile._id,
      }).populate("jobId")

      // Calculate active applications
      const activeApplications = applications.filter(
        (app) =>
          app.status === "pending" ||
          (app.status === "accepted" && app.jobId?.status !== "completed")
      ).length

      // Calculate completed jobs
      const completedJobs = applications.filter(
        (app) => app.status === "accepted" && app.jobId?.status === "completed"
      ).length

      // Calculate acceptance rate
      const acceptedApplications = applications.filter(
        (app) => app.status === "accepted"
      ).length

      const acceptanceRate =
        applications.length > 0
          ? ((acceptedApplications / applications.length) * 100).toFixed(1)
          : 0

      const stats = {
        activeApplications,
        completedJobs,
        totalApplications: applications.length,
        acceptanceRate,
        // Add project success rate
        successRate:
          acceptedApplications > 0
            ? ((completedJobs / acceptedApplications) * 100).toFixed(1)
            : 0,
      }

      res.status(200).json(stats)
    } catch (error) {
      console.error("Error fetching artist statistics:", error)
      res.status(500).json({
        message: "Error fetching statistics",
        error: error.message,
      })
    }
  },
}

export default statisticsController
