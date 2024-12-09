// components/IndividualApplication.jsx
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Calendar, DollarSign } from "lucide-react"

const IndividualApplication = () => {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!applicationId) {
        setError("No application ID provided")
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("token")
        console.log("Fetching application:", applicationId) // Debug log

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch application details")
        }

        const data = await response.json()
        console.log("Application data:", data) // Debug log
        setApplication(data)
      } catch (err) {
        console.error("Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationDetails()
  }, [applicationId])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (error || !application) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <p className='text-red-500'>{error || "Application not found"}</p>
          <Button onClick={() => navigate(-1)} className='mt-4'>
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const job = application.applicationId
  const requester = job?.requesterId

  return (
    <div className='space-y-6'>
      <header className='mb-8'>
        <h1 className='text-2xl font-bold'>Application Details</h1>
        <p className='text-gray-600'>For: {job?.title}</p>
      </header>

      {/* Job Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='font-semibold mb-2'>Basic Information</h4>
              <div className='space-y-2'>
                <p>
                  <span className='text-gray-500'>Category:</span>{" "}
                  {job?.category}
                </p>
                <p>
                  <span className='text-gray-500'>Type:</span> {job?.type}
                </p>
                <Badge>{job?.status}</Badge>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Budget Details</h4>
              <div className='space-y-2'>
                <p>
                  <span className='text-gray-500'>Budget Range:</span>{" "}
                  {job?.budget?.currency || "USD"} {job?.budget?.min} -{" "}
                  {job?.budget?.max}
                </p>
                <p>
                  <span className='text-gray-500'>Your Proposal:</span>{" "}
                  {application.proposedAmount} {job?.budget?.currency || "USD"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Badge
              className={
                application.status === "accepted"
                  ? "bg-green-500"
                  : application.status === "rejected"
                  ? "bg-red-500"
                  : application.status === "withdrawn"
                  ? "bg-gray-500"
                  : "bg-yellow-500"
              }
            >
              {application.status.toUpperCase()}
            </Badge>
            <p className='text-sm text-gray-500'>
              Applied: {new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </div>

          <div className='mt-4'>
            <h4 className='font-semibold mb-2'>Cover Letter</h4>
            <p className='text-gray-600'>{application.coverLetter}</p>
          </div>
        </CardContent>
      </Card>

      {/* Requester Info Card */}
      {requester && (
        <Card>
          <CardHeader>
            <CardTitle>Posted By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage src={requester?.userId?.avatarUrl} />
                <AvatarFallback>
                  {requester?.userId?.username?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='font-medium'>
                  {requester?.userId?.username || "Unknown User"}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className='flex gap-4'>
        <Button
          variant='outline'
          onClick={() => navigate(-1)}
          className='w-full'
        >
          Back
        </Button>
        {application.status === "pending" && (
          <Button
            variant='destructive'
            className='w-full'
            onClick={() => {
              // Add withdrawal functionality
              console.log("Withdraw application")
            }}
          >
            Withdraw Application
          </Button>
        )}
      </div>
    </div>
  )
}

export default IndividualApplication
