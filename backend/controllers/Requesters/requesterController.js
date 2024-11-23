  /**
   * Requester Controller
   *
   * Handles requester profile operations including:
   * - Profile management (CRUD operations)
   * - Job listing and management
   * - Activity tracking
   * - Statistics management
   * - Review system
   */
  import Requester from "../../models/RequesterModels/RequesterSchema.js"
  import mongoose from "mongoose"
  import Job from "../../models/JobModels/JobsSchema.js"

  const requesterController = {
    getAllRequesters: async (req, res) => {
      try {
        const requesters = await Requester.find()
          .populate("userId", "name username location")
          .select("-paymentMethods -preferences -statistics -reviews")
        res.status(200).json(requesters)
      } catch (error) {
        console.error("Error fetching requesters:", error)
        res.status(500).json({ message: "Internal server error." })
      }
    },

    getRequesterProfile: async (req, res) => {
      try {
        const requesterProfile = await Requester.findOne({
          userId: new mongoose.Types.ObjectId(req.params.userId),
        })
          .populate("userId", "name username location")
          .populate("jobs", "title status createdAt")

        if (!requesterProfile) {
          return res.status(404).json({ message: "Requester profile not found" })
        }

        const isOwner =
          requesterProfile.userId.toString() === req.user._id.toString()

        if (!isOwner) {
          const publicProfile = requesterProfile.toObject()
          delete publicProfile.paymentMethods
          delete publicProfile.preferences
          delete publicProfile.statistics
          return res.json(publicProfile)
        }

        res.json(requesterProfile)
      } catch (error) {
        console.error("Error retrieving requester profile:", error)
        res.status(500).json({ message: "Server error" })
      }
    },

    updateRequesterProfile: async (req, res) => {
      try {
        const userId = req.params.userId

        if (userId !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized" })
        }

        const updatedData = { ...req.body }
        delete updatedData.paymentMethods
        delete updatedData.statistics
        delete updatedData.reviews

        const updatedProfile = await Requester.findOneAndUpdate(
          { userId: new mongoose.Types.ObjectId(userId) },
          updatedData,
          { new: true, runValidators: true }
        ).populate("userId", "name username location")

        if (!updatedProfile) {
          return res.status(404).json({ message: "Requester profile not found." })
        }

        res.status(200).json(updatedProfile)
      } catch (error) {
        console.error("Error updating requester profile:", error)
        res.status(500).json({ message: "Internal server error." })
      }
    },

    getRequesterJobs: async (req, res) => {
      try {
        const requester = await Requester.findOne({
          userId: new mongoose.Types.ObjectId(req.params.userId),
        }).populate({
          path: "jobs",
          select: "title status category createdAt",
          populate: {
            path: "applications.artistId",
            select: "userId skills averageRating",
          },
        })

        if (!requester) {
          return res.status(404).json({ message: "Requester not found" })
        }

        const isOwner = req.params.userId === req.user._id.toString()

        if (!isOwner) {
          const publicJobs = requester.jobs.map((job) => ({
            _id: job._id,
            title: job.title,
            status: job.status,
            category: job.category,
            createdAt: job.createdAt,
          }))
          return res.json(publicJobs)
        }

        res.json(requester.jobs)
      } catch (error) {
        console.error("Error fetching requester jobs:", error)
        res.status(500).json({ message: "Internal server error." })
      }
    },

    getRequesterStatistics: async (req, res) => {
      try {
        const requesterProfile = await Requester.findOne({
          userId: req.params.userId,
        }).select("statistics")

        if (!requesterProfile) {
          return res.status(404).json({ message: "Requester profile not found" })
        }

        res.json({
          activeJobs: requesterProfile.statistics?.activeJobs || 0,
          totalApplications: requesterProfile.statistics?.totalApplications || 0,
          completedJobs: requesterProfile.statistics?.completedJobs || 0,
        })
      } catch (error) {
        console.error("Error fetching statistics:", error)
        res.status(500).json({ message: "Error fetching statistics" })
      }
    },

    addReview: async (req, res) => {
      try {
        const { userId } = req.params
        const { jobId, rating, comment } = req.body

        if (!rating || rating < 1 || rating > 5) {
          return res
            .status(400)
            .json({ message: "Valid rating (1-5) is required" })
        }

        const requester = await Requester.findOne({
          userId: new mongoose.Types.ObjectId(userId),
        })

        if (!requester) {
          return res.status(404).json({ message: "Requester not found" })
        }

        if (req.user.role !== "artist") {
          return res
            .status(403)
            .json({ message: "Only artists can leave reviews" })
        }

        const reviewData = {
          artistId: req.user._id,
          jobId,
          rating,
          comment: comment || "",
          createdAt: new Date(),
        }

        requester.reviews.push(reviewData)
        requester.averageRating = Number(
          (
            requester.reviews.reduce((sum, review) => sum + review.rating, 0) /
            requester.reviews.length
          ).toFixed(1)
        )

        await requester.save()

        res.status(201).json({
          review: reviewData,
          averageRating: requester.averageRating,
        })
      } catch (error) {
        console.error("Error adding review:", error)
        res.status(500).json({ message: "Internal server error." })
      }
    },

    getRequesterActivities: async (req, res) => {
      try {
        const userId = req.params.userId

        const [requesterProfile, jobs] = await Promise.all([
          Requester.findOne({ userId }).populate("reviews"),
          Job.find({ requesterId: userId }).populate("applications.artistId"),
        ])

        if (!requesterProfile) {
          return res.status(404).json({ message: "Requester profile not found" })
        }

        const activities = [
          ...jobs.map((job) => ({
            _id: job._id,
            type: "job_posted",
            description: `Posted new job: "${job.title}"`,
            createdAt: job.createdAt,
          })),
          ...jobs.flatMap((job) =>
            job.applications.map((app) => ({
              _id: app._id,
              type: "application_received",
              description: `Received application for "${job.title}"`,
              createdAt: app.appliedAt,
            }))
          ),
          ...requesterProfile.reviews.map((review) => ({
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
        console.error("Error fetching requester activities:", error)
        res.status(500).json({ message: "Error fetching activities" })
      }
    },
  }

  export default requesterController
