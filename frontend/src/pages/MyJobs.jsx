import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useSelector } from 'react-redux'

const JobCard = ({ job }) => {
  const navigate = useNavigate()
  const formatDate = (date) => new Date(date).toLocaleDateString()

  return (
    // Card component to display job details, navigates to job status on click
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/jobs/${job._id}/status`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <Badge variant="outline">{job.status}</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.category}</Badge>
            <Badge variant="secondary">{job.type}</Badge>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Applications: {job.applications?.length || 0}</span>
            <span>Posted: {formatDate(job.createdAt)}</span>
          </div>

          {job.budget && (
            <p className="text-sm font-medium">
              Budget: {job.budget.currency} {job.budget.min} - {job.budget.max}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// MyJobs component manages and displays a list of jobs posted by the user
const MyJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    // Fetch jobs posted by the user
    const fetchJobs = async () => {
      if (!user?._id) return

      try {
        const token = localStorage.getItem('token')
        // Fetch requester profile 
        const requesterResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/requesters/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (!requesterResponse.ok) throw new Error('Failed to fetch requester profile')
        const requesterData = await requesterResponse.json()

        // Fetch job details for each job ID in the requester's jobs array
        const jobPromises = requesterData.jobs.map(jobId => 
          fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json())
        )

        const jobsData = await Promise.all(jobPromises)
        setJobs(jobsData) 
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load jobs')
      } finally {
        setLoading(false) 
      }
    }

    fetchJobs()
  }, [user])

  // Display loading spinner if data is still loading
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Display error message if there's an error
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  // Main content for displaying jobs posted by the user
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Posted Jobs</h1>
        <p className="text-gray-600">Manage your job listings</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1">
            {jobs.length === 0 ? (
              <p className="text-center text-gray-500 col-span-2">
                No jobs posted yet
              </p>
            ) : (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyJobs