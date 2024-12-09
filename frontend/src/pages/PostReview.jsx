/**
 * 
 *
 * This page is supposed to be used
 * when creating a new review.
 * currently not routed in App.jsx
 * currently not set up to link review to 
 * specific profile
 * using the PostJob page template
 */

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSelector } from "react-redux"
import { Loader2 } from "lucide-react"

const PostReview = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useSelector(state => state.user)

  // Initial state matches our JobsSchema.js structure
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: "",
    type: "one-time",
    budget: {
      min: "",
      max: "",
      currency: "USD"
    },
    timeline: {
      startDate: "",
      deadline: "",
      duration: ""
    },
    requirements: [{
      skillRequired: "",
      experienceLevel: "intermediate",
      description: ""
    }],
    status: "open",
    visibility: "public",
    metadata: {
      views: 0,
      applicationCount: 0,
      lastModified: new Date().toISOString()
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!user?._id) {
      setError("User not authenticated")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      
      // Using our backend POST /api/jobs endpoint (from jobController.js)
      // This endpoint already handles:
      // 1. Creating the job
      // 2. Updating requester statistics
      // 3. Adding job reference to requester
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...jobData,
          // The backend will handle linking this to the requester
          // through the user's token in jobController.createJob
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create job')
      }

      // Job created successfully - navigate to my jobs page
      navigate("/jobs/my-posts")
      
    } catch (err) {
      console.error("Error creating job:", err)
      setError(err.message || "Failed to create job posting")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Post a Review</h1>
        <p className="text-gray-600">Create a review</p>
      </header>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label>Rating</label>
              <Select 
                value={jobData.category}
                onValueChange={(value) => setJobData({...jobData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label>Comment:</label>
              <Textarea
                value={jobData.description}
                onChange={(e) => setJobData({...jobData, description: e.target.value})}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostReview