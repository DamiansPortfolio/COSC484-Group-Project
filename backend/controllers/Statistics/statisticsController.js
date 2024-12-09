// controllers/Statistics/statisticsController.js
import Job from "../../models/JobModels/JobsSchema.js"
import Application from "../../models/JobModels/ApplicationSchema.js"
import Artist from "../../models/ArtistModels/ArtistSchema.js"
import Requester from "../../models/RequesterModels/RequesterSchema.js"

const statisticsController = {
  getRequesterStats: async (req, res) => {
    try {
      const userId = req.params.requesterId
      console.log("Fetching stats for requester userId:", userId)

      // First find the requester profile
      const requesterProfile = await Requester.findOne({ userId })

      if (!requesterProfile) {
        console.log("No requester profile found for userId:", userId)
        return res.status(404).json({ message: "Requester profile not found" })
      }

      console.log("Found requester profile:", requesterProfile._id)

      // Get all jobs by this requester using their profile ID
      const jobs = await Job.find({ requesterId: requesterProfile._id })
      console.log("Found jobs:", jobs.length)

      // Get all applications for all jobs
      const jobIds = jobs.map((job) => job._id)
      const allApplications = await Application.find({
        jobId: { $in: jobIds },
      })

      console.log("Found applications:", allApplications.length)

      // Calculate statistics
      const stats = {
        activeJobs: jobs.filter(
          (job) => job.status === "open" || job.status === "in_progress"
        ).length,
        totalApplications: allApplications.length,
        completedJobs: jobs.filter((job) => job.status === "completed").length,
      }

      console.log("Calculated requester stats:", stats)
      res.status(200).json(stats)
    } catch (error) {
      console.error("Error fetching requester statistics:", error)
      res.status(500).json({
        message: "Error fetching statistics",
        error: error.message,
      })
    }
  },

  getArtistStats: async (req, res) => {
    try {
      const userId = req.params.artistId
      console.log("Fetching stats for artist userId:", userId)

      // First find the artist profile
      const artistProfile = await Artist.findOne({ userId })

      if (!artistProfile) {
        console.log("No artist profile found for userId:", userId)
        return res.status(404).json({ message: "Artist profile not found" })
      }

      console.log("Found artist profile:", artistProfile._id)

      // Get all applications by this artist using their profile ID
      const applications = await Application.find({
        artistProfileId: artistProfile._id,
      }).populate("jobId")

      console.log("Found applications:", applications.length)
      console.log(
        "Application IDs:",
        applications.map((app) => app._id)
      )

      // Calculate active applications (pending or accepted but job not completed)
      const activeApplications = applications.filter(
        (app) =>
          app.status === "pending" ||
          (app.status === "accepted" && app.jobId?.status !== "completed")
      )

      // Calculate completed jobs (accepted applications with completed jobs)
      const completedJobs = applications.filter(
        (app) => app.status === "accepted" && app.jobId?.status === "completed"
      )

      const stats = {
        activeApplications: activeApplications.length,
        completedJobs: completedJobs.length,
        totalApplications: applications.length,
      }

      console.log("Calculated artist stats:", stats)
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
