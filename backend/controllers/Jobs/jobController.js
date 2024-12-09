/**
 * Jobs Controller
 *
 * Manages job listings with functionality for:
 * - Job CRUD operations
 * - Application processing
 * - Search and filtering
 * - Statistics tracking
 * - Access control for requesters/artists
 */
import Job from "../../models/JobModels/JobsSchema.js"
import Requester from "../../models/RequesterModels/RequesterSchema.js"
import Artist from "../../models/ArtistModels/ArtistSchema.js"
import Application from "../../models/JobModels/ApplicationSchema.js"

const jobController = {
  getAllJobs: async (req, res) => {
    try {
      // Only return public jobs without accepted artists
      const jobs = await Job.find({
        visibility: "public",
        acceptedArtistId: null,
        status: "open",
      })
        .populate("requesterId", "company.name location")
        .select("-applications")
      res.status(200).json(jobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  getJobById: async (req, res) => {
    try {
      console.log("Fetching job with ID:", req.params.jobId)

      const job = await Job.findById(req.params.jobId)
        .populate({
          path: "requesterId",
          select: "_id userId",
          populate: {
            path: "userId",
            select: "username avatarUrl",
          },
        })
        .populate("acceptedArtistId")
        .populate({
          path: "applications",
          populate: {
            path: "artistProfileId",
            populate: {
              path: "userId",
              select: "username avatarUrl",
            },
          },
        })

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      console.log("Found job:", {
        _id: job._id,
        requesterId: job.requesterId,
        applicationCount: job.applications?.length,
      })

      res.json(job)
    } catch (error) {
      console.error("Error fetching job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  createJob: async (req, res) => {
    try {
      const job = new Job({
        ...req.body,
        requesterId: req.user.id,
        status: "open",
        visibility: "public",
      })
      await job.save()

      const createdJob = await Job.findById(job._id)
      if (!createdJob) {
        throw new Error("Failed to retrieve the newly created job")
      }

      const requesterProfile = await Requester.findOne({
        userId: createdJob.requesterId,
      })
      if (!requesterProfile) {
        throw new Error("Requester profile not found for the user ID")
      }

      await Requester.updateOne(
        { _id: requesterProfile._id },
        {
          $inc: { "statistics.totalJobsPosted": 1 },
          $push: { jobs: createdJob._id },
        }
      )

      res.status(201).json(createdJob)
    } catch (error) {
      console.error("Error creating job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  updateJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId)

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      if (job.requesterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }

      const updatedJob = await Job.findByIdAndUpdate(
        req.params.jobId,
        req.body,
        { new: true }
      )

      res.json(updatedJob)
    } catch (error) {
      console.error("Error updating job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  deleteJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId)

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      if (job.requesterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }

      // Delete all associated applications first
      await Application.deleteMany({ jobId: job._id })

      await Job.findByIdAndDelete(req.params.jobId)

      await Requester.updateOne(
        { userId: req.user._id },
        {
          $inc: { "statistics.totalJobsPosted": -1 },
          $pull: { jobs: req.params.jobId },
        }
      )

      res.json({ message: "Job deleted successfully" })
    } catch (error) {
      console.error("Error deleting job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  searchJobs: async (req, res) => {
    try {
      const { category, type } = req.query
      const query = {
        visibility: "public",
        acceptedArtistId: null,
        status: "open",
      }

      if (category) query.category = category
      if (type) query.type = type

      const jobs = await Job.find(query)
        .populate({
          path: "requesterId",
          populate: {
            path: "userId",
            select: "name username location",
          },
        })
        .select("-applications")

      res.json(jobs)
    } catch (error) {
      console.error("Error searching jobs:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  applyToJob: async (req, res) => {
    const userId = req.user.id || req.user._id

    try {
      const artist = await Artist.findOne({ userId })
      if (!artist) {
        return res.status(404).json({ message: "Artist profile not found" })
      }

      const job = await Job.findById(req.params.jobId)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      // Check if job is still open
      if (job.status !== "open" || job.acceptedArtistId) {
        return res
          .status(400)
          .json({ message: "This job is no longer accepting applications" })
      }

      const existingApplication = await Application.findOne({
        artistProfileId: artist._id,
        jobId: job._id,
      })

      if (existingApplication) {
        return res.status(400).json({ message: "Already applied to this job" })
      }

      const application = new Application({
        artistProfileId: artist._id,
        jobId: job._id,
        coverLetter: req.body.coverLetter,
        proposedAmount: req.body.proposedAmount,
        status: "pending",
        appliedAt: new Date(),
      })

      const savedApplication = await application.save()

      // Add application reference to job
      job.applications.push(savedApplication._id)
      await job.save()

      res.status(201).json({
        message: "Application submitted successfully",
        applicationId: savedApplication._id,
      })
    } catch (error) {
      console.error("Error applying to job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  updateApplication: async (req, res) => {
    try {
      const { jobId, applicationId } = req.params
      const { status } = req.body

      console.log("Updating application:", { jobId, applicationId, status })

      // Find the job and verify ownership
      const job = await Job.findById(jobId)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      // Verify requester ownership
      if (job.requesterId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this job" })
      }

      // Find the application
      const application = await Application.findById(applicationId)
      if (!application) {
        return res.status(404).json({ message: "Application not found" })
      }

      // If accepting the application
      if (status === "accepted") {
        // Check if job already has an accepted artist
        if (job.acceptedArtistId) {
          return res
            .status(400)
            .json({ message: "Job already has an accepted artist" })
        }

        // Update job with accepted artist
        job.acceptedArtistId = application.artistProfileId
        job.acceptedApplicationId = applicationId
        job.status = "in_progress"
        job.startedAt = new Date()

        // Optionally hide from public view
        job.visibility = "private"

        await job.save()

        // Reject other applications
        await Application.updateMany(
          {
            jobId: jobId,
            _id: { $ne: applicationId },
          },
          {
            status: "rejected",
            decidedAt: new Date(),
          }
        )
      }

      // Update the application status
      application.status = status
      application.decidedAt = new Date()
      await application.save()

      res.json({ message: "Application updated successfully" })
    } catch (error) {
      console.error("Error updating application:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  getRequesterJobs: async (req, res) => {
    try {
      const requesterId = req.params.requesterId

      const jobs = await Job.find({ requesterId })
        .populate({
          path: "acceptedArtistId",
          populate: {
            path: "userId",
            select: "username avatarUrl",
          },
        })
        .populate({
          path: "applications",
          populate: [
            {
              path: "artistProfileId",
              populate: {
                path: "userId",
                select: "username avatarUrl",
              },
            },
          ],
        })
        .sort({ createdAt: -1 })

      res.json(jobs)
    } catch (error) {
      console.error("Error fetching requester jobs:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  completeJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId)

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      if (job.requesterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }

      job.status = "completed"
      job.completedAt = new Date()
      await job.save()

      res.json({ message: "Job marked as completed successfully" })
    } catch (error) {
      console.error("Error completing job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },
}

export default jobController
