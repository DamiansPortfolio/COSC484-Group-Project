import Jobs from "../models/JobsSchema.js"

// Get all users
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find()
    res.status(200).json(jobs)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export default {
  getAllJobs,
}
