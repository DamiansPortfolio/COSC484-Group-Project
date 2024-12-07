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
      const job = await Job.findById(req.params.jobId).populate({
        path: "requesterId",
        populate: {
          path: "userId",
          select: "username avatarUrl",
        },
      });
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  createJob: async (req, res) => {
    try {
      // Step 1: Create the job
      const job = new Job({
        ...req.body,
        requesterId: req.user.id, // Ensure the user ID is attached
      });
      await job.save();
  
      // Step 2: Query the created job to confirm it exists
      const createdJob = await Job.findById(job._id);
      if (!createdJob) {
        throw new Error("Failed to retrieve the newly created job");
      }
  
      // Step 3: Find the Requester Profile using the requesterId from the job
      const requesterProfile = await Requester.findOne({ userId: createdJob.requesterId });
      if (!requesterProfile) {
        throw new Error("Requester profile not found for the user ID");
      }
  
      // Step 4: Append the job ID to the requester's jobs and update statistics
      await Requester.updateOne(
        { _id: requesterProfile._id },
        {
          $inc: { "statistics.totalJobsPosted": 1 },
          $push: { jobs: createdJob._id },
        }
      );
  
      // Send a response with the newly created job
      res.status(201).json(createdJob);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Internal server error." });
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

      const jobs = await Job.find()
      .populate({
        path: 'requesterId',
        populate: {
          path: 'userId',
          select: 'name username location'
        }
      })
        .select("-applications")

      res.json(jobs)
    } catch (error) {
      console.error("Error searching jobs:", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },

  applyToJob: async (req, res) => {

    const userId = req.user.id || req.user._id;

    console.log("User ID from token:", userId);
    console.log("Job ID in request:", req.params.jobId);
    

    try {
        // Get artist profile using user ID from auth token
        const artist = await Artist.findOne({ userId })
        if (!artist) {
            return res.status(404).json({ message: "Artist profile not found" })
        }

        // Get job and verify it exists
        const job = await Job.findById(req.params.jobId)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        // Check for existing application using artistProfileId
        const existingApplication = job.applications.find(
            (app) => app.artistProfileId?.toString() === artist._id.toString()
        )
        if (existingApplication) {
            return res.status(400).json({ message: "Already applied to this job" })
        }

        // Create new Application document
        const application = new Application({
            artistProfileId: artist._id,  // Using artist profile ID
            jobId: job._id,
            coverLetter: req.body.coverLetter,
            proposedAmount: req.body.proposedAmount,
            status: "pending",
            appliedAt: new Date()
        })

        // Save the application first to get its _id
        const savedApplication = await application.save()

        // Add application reference to job
        job.applications.push(savedApplication._id)
        await job.save()

        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: savedApplication._id
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

  getApplicationById: async (req, res) => {
    try {
      const { applicationId } = req.params;

      // Find the application by ID and populate the related job details
      const application = await Application.findById(applicationId).populate({
        path: "jobId",
        select: "title description category type requesterId",
        populate: {
          path: "requesterId",
          select: "userId",
          populate: {
            path: "userId",
            select: "username avatarUrl",
          },
        },
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found." });
      }

      res.status(200).json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
}

export default jobController
