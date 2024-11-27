import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import QuickStats from "../components/dashboard/QuickStats"
import { checkAuthStatus } from "../redux/actions/userActions"

const JobPreviewCard = ({ job }) => {
  const navigate = useNavigate()

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <Badge variant="outline" className="text-sm">
            {job.type}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{job.category}</Badge>
            {job.requirements?.map((req, index) => (
              <Badge key={index} variant="secondary">
                {req.experienceLevel}
              </Badge>
            ))}
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Budget: {job.budget?.currency || 'USD'} {job.budget?.min} - {job.budget?.max}
          </p>

          <p className="text-sm line-clamp-2 text-gray-600">
            {job.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const AvailableJobs = () => {
  const { user, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user && !loading) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, user, loading])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/search?status=open`)
        const data = await response.json()
        setJobs(data.filter(job => job.visibility === "public"))
      } catch (err) {
        setError("Failed to load available jobs")
        console.error("Error fetching jobs:", err)
      } finally {
        setJobsLoading(false)
      }
    }

    if (user) {
      fetchJobs()
    }
  }, [user])

  if (loading || jobsLoading) {
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
          <p>Unable to load content. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        <p className="text-gray-600">Browse and apply for open positions</p>
      </header>

      <div className="space-y-6">
        <QuickStats userRole="artist" />
        
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1">
                {jobs.length === 0 ? (
                  <p className="text-center text-gray-500 col-span-2">
                    No available jobs found
                  </p>
                ) : (
                  jobs.map((job) => (
                    <JobPreviewCard key={job._id} job={job} />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AvailableJobs