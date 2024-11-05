import Requester from "../../models/RequesterModels/RequesterSchema.js";
import mongoose from "mongoose";

// Helper function to check if user owns the profile
const checkProfileOwnership = (requesterId, authenticatedUserId) => {
  return requesterId.toString() === authenticatedUserId.toString();
};

export const getAllRequesters = async (req, res) => {
  try {
    // Only show public information for listing
    const requesters = await Requester.find()
      .populate("userId", "name username location")
      .select("-paymentMethods -preferences -statistics -reviews");
    res.status(200).json(requesters);
  } catch (error) {
    console.error("Error fetching requesters:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getRequesterProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const requesterProfile = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("userId", "name username location")
      .populate("jobs", "title status createdAt");

    if (!requesterProfile) {
      return res.status(404).json({ message: "Requester profile not found" });
    }

    // If not the profile owner, return limited information
    if (!checkProfileOwnership(requesterProfile.userId, req.user._id)) {
      const publicProfile = requesterProfile.toObject();
      delete publicProfile.paymentMethods;
      delete publicProfile.preferences;
      delete publicProfile.statistics;
      return res.json(publicProfile);
    }

    res.json(requesterProfile);
  } catch (error) {
    console.error("Error retrieving requester profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRequesterProfile = async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    // Verify user is updating their own profile
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    // Prevent updating sensitive fields
    delete updatedData.paymentMethods;
    delete updatedData.statistics;
    delete updatedData.reviews;
    delete updatedData.verificationStatus;

    const updatedProfile = await Requester.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId", "name username location");

    if (!updatedProfile) {
      return res.status(404).json({ message: "Requester profile not found." });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating requester profile:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: process.env.NODE_ENV === "production" ? null : error.message,
    });
  }
};

export const addPaymentMethod = async (req, res) => {
  try {
    const { userId } = req.params;
    const paymentMethod = req.body;

    // Verify user is adding their own payment method
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify payment methods" });
    }

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    // Validate payment method data
    if (!paymentMethod.type || !paymentMethod.lastFour) {
      return res.status(400).json({
        message: "Payment method type and last four digits are required",
      });
    }

    // Only store necessary payment info
    const sanitizedPaymentMethod = {
      type: paymentMethod.type,
      lastFour: paymentMethod.lastFour.slice(-4),
      isDefault: paymentMethod.isDefault || false,
    };

    // If this is the first payment method or marked as default, update other methods
    if (
      sanitizedPaymentMethod.isDefault ||
      requester.paymentMethods.length === 0
    ) {
      requester.paymentMethods.forEach((method) => (method.isDefault = false));
      sanitizedPaymentMethod.isDefault = true;
    }

    requester.paymentMethods.push(sanitizedPaymentMethod);
    await requester.save();

    res.status(201).json({
      message: "Payment method added successfully",
      paymentMethods: requester.paymentMethods,
    });
  } catch (error) {
    console.error("Error adding payment method:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const removePaymentMethod = async (req, res) => {
  try {
    const { userId, methodId } = req.params;

    // Verify user is removing their own payment method
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove payment methods" });
    }

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    const methodToRemove = requester.paymentMethods.find(
      (method) => method._id.toString() === methodId
    );

    if (!methodToRemove) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    // If removing default payment method, make the next one default
    const wasDefault = methodToRemove.isDefault;
    requester.paymentMethods = requester.paymentMethods.filter(
      (method) => method._id.toString() !== methodId
    );

    if (wasDefault && requester.paymentMethods.length > 0) {
      requester.paymentMethods[0].isDefault = true;
    }

    await requester.save();
    res.json({
      message: "Payment method removed successfully",
      paymentMethods: requester.paymentMethods,
    });
  } catch (error) {
    console.error("Error removing payment method:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;

    // Verify user is updating their own preferences
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update preferences" });
    }

    // Validate preferences
    const validPreferences = {
      jobAlerts: Boolean(preferences.jobAlerts),
      emailNotifications: Boolean(preferences.emailNotifications),
      currency: preferences.currency || "USD",
    };

    const requester = await Requester.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { preferences: validPreferences },
      { new: true }
    ).select("preferences");

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    res.json({ preferences: requester.preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getRequesterStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is accessing their own stats
    if (userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these statistics" });
    }

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).select("statistics");

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    res.json(requester.statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getRequesterJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate({
      path: "jobs",
      select: "-applications.coverLetter -applications.proposedAmount",
      populate: {
        path: "applications.artistId",
        select: "userId skills averageRating",
      },
    });

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    // If not the owner, return only public job information
    if (userId !== req.user._id.toString()) {
      const publicJobs = requester.jobs.map((job) => ({
        _id: job._id,
        title: job.title,
        status: job.status,
        category: job.category,
        createdAt: job.createdAt,
      }));
      return res.json(publicJobs);
    }

    res.json(requester.jobs);
  } catch (error) {
    console.error("Error fetching requester jobs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const addReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { jobId, rating, comment } = req.body;

    // Basic validation
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Valid rating (1-5) is required" });
    }

    const requester = await Requester.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    // Verify the review is from an artist
    if (req.user.role !== "artist") {
      return res
        .status(403)
        .json({ message: "Only artists can leave reviews" });
    }

    // Check if the artist has already reviewed this requester for this job
    const existingReview = requester.reviews.find(
      (review) =>
        review.artistId.toString() === req.user._id.toString() &&
        review.jobId.toString() === jobId
    );

    if (existingReview) {
      return res
        .status(400)
        .json({
          message: "You have already reviewed this requester for this job",
        });
    }

    // Add the review
    const reviewData = {
      artistId: req.user._id,
      jobId,
      rating,
      comment: comment || "",
      createdAt: new Date(),
    };

    requester.reviews.push(reviewData);

    // Recalculate average rating
    const totalRating = requester.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    requester.averageRating = (totalRating / requester.reviews.length).toFixed(
      1
    );

    await requester.save();

    // Return only the new review and updated average
    res.status(201).json({
      review: reviewData,
      averageRating: requester.averageRating,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default {
  getAllRequesters,
  getRequesterProfile,
  updateRequesterProfile,
  addPaymentMethod,
  removePaymentMethod,
  updatePreferences,
  getRequesterStats,
  getRequesterJobs,
  addReview,
};
