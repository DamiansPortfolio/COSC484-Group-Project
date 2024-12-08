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

// Defining the PostJob component
const PostJob = () => {
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

  // Handler function for form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Checking if the user is authenticated
    if (!user?._id) {
      setError("User not authenticated")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      
      // Using our backend POST /api/jobs endpoint (from jobController.js)
      // Makes a POST request to create the job, update requester statistics, add job reference to requester
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
        <h1 className="text-2xl font-bold">Post a New Job</h1>
        <p className="text-gray-600">Create a new job listing</p>
      </header>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label>Job Title</label>
              <Input
                value={jobData.title}
                onChange={(e) => setJobData({...jobData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label>Category</label>
              <Select 
                value={jobData.category}
                onValueChange={(value) => setJobData({...jobData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3D Modeling">3D Modeling</SelectItem>
                  <SelectItem value="Character Design">Character Design</SelectItem>
                  <SelectItem value="Illustration">Illustration</SelectItem>
                  <SelectItem value="Animation">Animation</SelectItem>
                  <SelectItem value="Texturing">Texturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label>Description</label>
              <Textarea
                value={jobData.description}
                onChange={(e) => setJobData({...jobData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <label>Required Skill</label>
              <Input
                value={jobData.requirements[0].skillRequired}
                onChange={(e) => setJobData({
                  ...jobData,
                  requirements: [{ 
                    ...jobData.requirements[0], 
                    skillRequired: e.target.value 
                  }]
                })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Start Date</label>
                <Input
                  type="date"
                  value={jobData.timeline.startDate}
                  onChange={(e) => setJobData({
                    ...jobData, 
                    timeline: {...jobData.timeline, startDate: e.target.value}
                  })}
                  required
                />
              </div>
              <div>
                <label>Deadline</label>
                <Input
                  type="date"
                  value={jobData.timeline.deadline}
                  onChange={(e) => setJobData({
                    ...jobData, 
                    timeline: {...jobData.timeline, deadline: e.target.value}
                  })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Min Budget (USD)</label>
                <Input
                  type="number"
                  value={jobData.budget.min}
                  onChange={(e) => setJobData({
                    ...jobData, 
                    budget: {...jobData.budget, min: e.target.value}
                  })}
                  required
                />
              </div>
              <div>
                <label>Max Budget (USD)</label>
                <Input
                  type="number"
                  value={jobData.budget.max}
                  onChange={(e) => setJobData({
                    ...jobData, 
                    budget: {...jobData.budget, max: e.target.value}
                  })}
                  required
                />
              </div>
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
                {loading ? "Creating..." : "Create Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostJob