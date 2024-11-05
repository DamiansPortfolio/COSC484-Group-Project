import Job from "../../models/JobModels/JobsSchema.js";
import Requester from "../../models/RequesterModels/RequesterSchema.js";

// Public endpoint - no auth needed
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("requesterId", "company.name location")
      .select("-applications"); // Don't expose applications in public listing
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Public endpoint - no auth needed
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate(
      "requesterId",
      "company.name location"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // If viewer is not the job owner, don't show all application details
    if (!req.user || job.requesterId.toString() !== req.user._id.toString()) {
      job.applications = job.applications.map((app) => ({
        _id: app._id,
        artistId: app.artistId,
        status: app.status,
        appliedAt: app.appliedAt,
      }));
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Requester only endpoint
export const createJob = async (req, res) => {
  try {
    // Set the authenticated user as the requester
    const jobData = {
      ...req.body,
      requesterId: req.user._id,
    };

    const job = new Job(jobData);
    await job.save();

    // Update requester statistics
    await Requester.updateOne(
      { userId: req.user._id },
      {
        $inc: { "statistics.totalJobsPosted": 1 },
        $push: { jobs: job._id },
      }
    );

    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Requester only endpoint
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user owns the job
    if (job.requesterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
    });

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Requester only endpoint
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user owns the job
    if (job.requesterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);

    // Update requester statistics
    await Requester.updateOne(
      { userId: req.user._id },
      {
        $inc: { "statistics.totalJobsPosted": -1 },
        $pull: { jobs: jobId },
      }
    );

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Public endpoint with optional auth
export const searchJobs = async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = {};

    if (category) query.category = category;
    if (type) query.type = type;

    const jobs = await Job.find(query)
      .populate("requesterId", "company.name location")
      .select("-applications");

    res.json(jobs);
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Artist only endpoint
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if artist has already applied
    const existingApplication = job.applications.find(
      (app) => app.artistId.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    const applicationData = {
      ...req.body,
      artistId: req.user._id,
      status: "pending",
      appliedAt: new Date(),
    };

    job.applications.push(applicationData);
    job.metadata.applicationCount += 1;
    await job.save();

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: job.applications[job.applications.length - 1]._id,
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update application status - accessible by both artist and requester
export const updateApplication = async (req, res) => {
  try {
    const { jobId, applicationId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only allow requester or the applying artist to update
    if (
      job.requesterId.toString() !== req.user._id.toString() &&
      application.artistId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    Object.assign(application, req.body);
    await job.save();

    res.json({ message: "Application updated successfully" });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  applyToJob,
  updateApplication,
};
