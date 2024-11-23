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

const jobController = {
  getAllJobs: async (req, res) => {
    try {
      const jobs = await Job.find()
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
      const job = await Job.findById(req.params.jobId).populate(
        "requesterId",
        "company.name location"
      )

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      const isOwner =
        req.user && job.requesterId.toString() === req.user._id.toString()
      if (!isOwner) {
        job.applications = job.applications.map((app) => ({
          _id: app._id,
          artistId: app.artistId,
          status: app.status,
          appliedAt: app.appliedAt,
        }))
      }

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
        requesterId: req.user._id,
      })

      await job.save()

      await Requester.updateOne(
        { userId: req.user._id },
        {
          $inc: { "statistics.totalJobsPosted": 1 },
          $push: { jobs: job._id },
        }
      )

      res.status(201).json(job)
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
      const query = {}

      if (category) query.category = category
      if (type) query.type = type

      const jobs = await Job.find(query)
        .populate("requesterId", "company.name location")
        .select("-applications")

      res.json(jobs)
    } catch (error) {
      console.error("Error searching jobs:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  applyToJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId)

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      const existingApplication = job.applications.find(
        (app) => app.artistId.toString() === req.user._id.toString()
      )

      if (existingApplication) {
        return res.status(400).json({ message: "Already applied to this job" })
      }

      job.applications.push({
        artistId: req.user._id,
        status: "pending",
        appliedAt: new Date(),
        ...req.body,
      })

      await job.save()

      res.status(201).json({
        message: "Application submitted successfully",
        applicationId: job.applications[job.applications.length - 1]._id,
      })
    } catch (error) {
      console.error("Error applying to job:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  updateApplication: async (req, res) => {
    try {
      const { jobId, applicationId } = req.params
      const job = await Job.findById(jobId)

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      const application = job.applications.id(applicationId)
      if (!application) {
        return res.status(404).json({ message: "Application not found" })
      }

      const isAuthorized =
        job.requesterId.toString() === req.user._id.toString() ||
        application.artistId.toString() === req.user._id.toString()

      if (!isAuthorized) {
        return res.status(403).json({ message: "Not authorized" })
      }

      Object.assign(application, req.body)
      await job.save()

      res.json({ message: "Application updated successfully" })
    } catch (error) {
      console.error("Error updating application:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },
}

export default jobController
