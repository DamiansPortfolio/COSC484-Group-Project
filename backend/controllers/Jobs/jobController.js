// controllers/jobsController.js
import Job from "../../models/JobModels/JobsSchema.js"
import Requester from "../../models/RequesterModels/RequesterSchema.js"

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("requesterId", "company.name location")
      .select("-applications")
    res.status(200).json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId)
      .populate("requesterId", "company.name location")
      .populate("applications.artistId", "userId skills averageRating")

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body)
    await job.save()

    // Update requester statistics
    await Requester.updateOne(
      { userId: job.requesterId },
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
}

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const updates = req.body

    const job = await Job.findByIdAndUpdate(jobId, updates, { new: true })

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json(job)
  } catch (error) {
    console.error("Error updating job:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findByIdAndDelete(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Update requester statistics and remove job reference
    await Requester.updateOne(
      { userId: job.requesterId },
      {
        $inc: { "statistics.totalJobsPosted": -1 },
        $pull: { jobs: jobId },
      }
    )

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const searchJobs = async (req, res) => {
  try {
    const { category, type, status, minBudget, maxBudget, skills } = req.query

    let query = {}

    if (category) query.category = category
    if (type) query.type = type
    if (status) query.status = status
    if (minBudget || maxBudget) {
      query.budget = {}
      if (minBudget) query.budget.min = { $gte: parseFloat(minBudget) }
      if (maxBudget) query.budget.max = { $lte: parseFloat(maxBudget) }
    }
    if (skills) {
      query.requirements = {
        $elemMatch: { skillRequired: { $in: skills.split(",") } },
      }
    }

    const jobs = await Job.find(query).populate(
      "requesterId",
      "company.name location"
    )

    res.json(jobs)
  } catch (error) {
    console.error("Error searching jobs:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const applicationData = req.body

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    job.applications.push(applicationData)
    await job.save()

    // Update metadata
    job.metadata.applicationCount += 1
    await job.save()

    res.status(201).json(job)
  } catch (error) {
    console.error("Error applying to job:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const updateApplication = async (req, res) => {
  try {
    const { jobId, applicationId } = req.params
    const updates = req.body

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    const applicationIndex = job.applications.findIndex(
      (app) => app._id.toString() === applicationId
    )

    if (applicationIndex === -1) {
      return res.status(404).json({ message: "Application not found" })
    }

    job.applications[applicationIndex] = {
      ...job.applications[applicationIndex].toObject(),
      ...updates,
    }

    await job.save()
    res.json(job)
  } catch (error) {
    console.error("Error updating application:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const addMilestone = async (req, res) => {
  try {
    const { jobId } = req.params
    const milestoneData = req.body

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    job.milestones.push(milestoneData)
    await job.save()

    res.status(201).json(job)
  } catch (error) {
    console.error("Error adding milestone:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const updateMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params
    const updates = req.body

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    const milestoneIndex = job.milestones.findIndex(
      (m) => m._id.toString() === milestoneId
    )

    if (milestoneIndex === -1) {
      return res.status(404).json({ message: "Milestone not found" })
    }

    job.milestones[milestoneIndex] = {
      ...job.milestones[milestoneIndex].toObject(),
      ...updates,
    }

    await job.save()
    res.json(job)
  } catch (error) {
    console.error("Error updating milestone:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const getJobsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params

    const jobs = await Job.find({
      "applications.artist_id": artistId,
    })

    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: "Internal server error." })
  }
}

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  applyToJob,
  updateApplication,
  addMilestone,
  updateMilestone,
  getJobsByArtist,
}
