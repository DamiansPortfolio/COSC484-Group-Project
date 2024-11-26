import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Send } from "lucide-react"
import { checkAuthStatus } from "../redux/actions/userActions"

const RequesterInfo = ({ requester, onProfileClick }) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <Avatar 
          className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onProfileClick}
        >
          <AvatarFallback>
            {requester.company?.name?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">
            {requester.company?.name || 'Company Name Not Available'}
          </h3>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{requester.averageRating?.toFixed(1) || 'No ratings'}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const JobDetails = ({ job }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Job Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Basic Information</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Type:</span> {job.type}</p>
            <p><span className="text-gray-500">Category:</span> {job.category}</p>
            <p>
              <span className="text-gray-500">Budget:</span>{" "}
              {job.budget?.min && job.budget?.max
                ? `${job.budget.currency || 'USD'} ${job.budget.min} - ${job.budget.max}`
                : 'Budget not specified'}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Timeline</h4>
          <div className="space-y-2">
            {job.timeline?.startDate && (
              <p>
                <span className="text-gray-500">Start Date:</span>{" "}
                {new Date(job.timeline.startDate).toLocaleDateString()}
              </p>
            )}
            {job.timeline?.deadline && (
              <p>
                <span className="text-gray-500">Deadline:</span>{" "}
                {new Date(job.timeline.deadline).toLocaleDateString()}
              </p>
            )}
            {job.timeline?.duration && (
              <p>
                <span className="text-gray-500">Duration:</span>{" "}
                {job.timeline.duration} days
              </p>
            )}
          </div>
        </div>
      </div>

      {job.requirements?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Requirements</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, index) => (
              <Badge key={index} variant="secondary">
                {req.skillRequired} ({req.experienceLevel})
              </Badge>
            ))}
          </div>
        </div>
      )}

      {job.milestones?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Milestones</h4>
          <div className="space-y-2">
            {job.milestones.map((milestone, index) => (
              <div key={index} className="border p-3 rounded-lg">
                <p className="font-medium">{milestone.title}</p>
                {milestone.description && (
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                )}
                {milestone.deadline && (
                  <p className="text-sm text-gray-500">
                    Due: {new Date(milestone.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

const IndividualJob = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.user)
  const [job, setJob] = useState(null)
  const [jobLoading, setJobLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user && !loading) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, user, loading])

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`)
        const data = await response.json()
        setJob(data)
      } catch (err) {
        setError("Failed to load job details")
        console.error("Error fetching job:", err)
      } finally {
        setJobLoading(false)
      }
    }

    if (user) {
      fetchJob()
    }
  }, [jobId, user])

  const handleMessageClick = () => {
    navigate('/messages', {
      state: {
        artistId: user._id,
        requesterId: job.requesterId._id,
        jobId: job._id
      }
    })
  }

  if (loading || jobLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user || error || !job) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || "Unable to load job details. Please try again later."}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">{job.description}</p>
        </header>

      <RequesterInfo 
        requester={job.requesterId} 
        onProfileClick={() => navigate(`/profile/${job.requesterId.userId._id}`)}
      />

      <JobDetails job={job} />

      <div className="flex gap-4 mt-6">
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => navigate(`/jobs/${job._id}/apply`)}
        >
          Apply Now <Send className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          size="lg"
          onClick={handleMessageClick}
        >
          Message Requester <MessageSquare className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default IndividualJob