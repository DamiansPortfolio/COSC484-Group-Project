import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { checkAuthStatus } from "../redux/actions/userActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

const JobRequirementBadge = ({ requirement }) => (
  <Badge variant="secondary" className="text-sm">
    {requirement.skillRequired} ({requirement.experienceLevel})
  </Badge>
)

const JobApplicationForm = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, loading: userLoading } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [job, setJob] = useState(null)

  const [formData, setFormData] = useState({
    coverLetter: "",
    proposedAmount: "",
    portfolio: []
  })

  useEffect(() => {
    if (!user && !userLoading) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, user, userLoading])

  useEffect(() => {
    const fetchJob = async () => {
      if (!user?._id) return

      try {
        const token = localStorage.getItem("token")
        console.log('Fetching job:', jobId) // Debug log
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
        if (!response.ok) {
          throw new Error("Failed to load job details")
        }

        const data = await response.json()
        console.log('Job details:', data) // Debug log
        setJob(data)
      } catch (err) {
        console.error('Error fetching job:', err) // Debug log
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchJob()
    }
  }, [jobId, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      if (!formData.coverLetter.trim()) {
        throw new Error("Cover letter is required")
      }
      if (!formData.proposedAmount || formData.proposedAmount <= 0) {
        throw new Error("Please enter a valid amount")
      }
  
      const token = localStorage.getItem("token")
      console.log("Job ID:", jobId);
      console.log("Token:", localStorage.getItem("token"));
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coverLetter: formData.coverLetter,
            proposedAmount: Number(formData.proposedAmount),
          }),
        }
      )
  
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
  
      navigate("/applications")
    } catch (err) {
      console.error('Submission error:', err)
      setError(err.message)
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to apply for jobs.</p>
        </CardContent>
      </Card>
    )
  }

  if (!job) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Job not found</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const existingApplication = job.applications?.find(
    app => app.artistId?.toString() === user._id?.toString()
  )

  if (existingApplication) {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <Card>
          <CardContent className="p-6">
            <Alert>
              <AlertDescription>
                You have already applied to this job. View your application in the Applications section.
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => navigate("/applications")}>
                View My Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submit Application</h1>
        <p className="text-gray-600">Apply for: {job.title}</p>
      </header>

      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{job.category}</Badge>
                <Badge variant="outline">{job.type}</Badge>
                {job.budget && (
                  <Badge variant="outline">
                    Budget: {job.budget.currency || 'USD'} {job.budget.min} - {job.budget.max}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <JobRequirementBadge key={index} requirement={req} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Letter
                </label>
                <Textarea
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData({ ...formData, coverLetter: e.target.value })
                  }
                  placeholder="Introduce yourself and explain why you're a good fit for this position..."
                  className="h-40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Proposed Amount ({job.budget?.currency || 'USD'})
                </label>
                <Input
                  type="number"
                  value={formData.proposedAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, proposedAmount: e.target.value })
                  }
                  placeholder="Enter your proposed amount"
                  required
                  min={job.budget?.min}
                  max={job.budget?.max}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default JobApplicationForm