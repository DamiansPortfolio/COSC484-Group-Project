import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Calendar, DollarSign, Clock, Users } from "lucide-react"

const JobStatusDetail = ({ label, value, icon: Icon }) => (
  <div className='flex items-center space-x-2'>
    <Icon className='w-5 h-5 text-gray-500' />
    <span className='font-medium'>{label}:</span>
    <span>{value}</span>
  </div>
)

const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate()
  const user = applicant.artistUser

  return (
    <div className='flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50'>
      <Avatar
        className='cursor-pointer'
        onClick={() => navigate(`/profile/${applicant.artistProfileId}`)}
      >
        <AvatarImage src={user?.avatarUrl} />
        <AvatarFallback>{user?.username?.[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className='flex-1'>
        <h3 className='font-medium'>{user?.username || "Applicant"}</h3>
        <p className='text-sm text-gray-500'>
          Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
        </p>
      </div>
      <Badge>{applicant.status || "pending"}</Badge>
    </div>
  )
}

const JobStatus = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token")
      try {
        // Fetch job details
        const jobResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!jobResponse.ok) throw new Error("Failed to fetch job details")
        const jobData = await jobResponse.json()

        // Process each application
        const processedApplications = await Promise.all(
          jobData.applications.map(async (application) => {
            console.log("Fetched application:", application)

            const applicationId = application._id || application.id
            console.log("Application ID:", applicationId)

            const applicationResponse = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/applications/${applicationId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )

            if (!applicationResponse.ok) return null
            const applicationData = await applicationResponse.json()

            // Assuming artistProfileId might be an object, we need to extract the _id or id
            const artistProfileId = applicationData.artistProfileId
            const profileId =
              artistProfileId?._id || artistProfileId?.id || artistProfileId
            console.log("Final profileId used:", profileId)

            // Fetch artist user details
            try {
              const userResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/artists/${
                  profileId ? profileId : application.artistProfileId
                }`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )

              if (userResponse.ok) {
                const userData = await userResponse.json()
                return {
                  ...applicationData,
                  artistUser: userData,
                }
              }
            } catch (error) {
              console.warn(
                `Failed to fetch user details for artist ${profileId}`
              )
            }

            return applicationData
          })
        )

        // Filter out any null applications
        const validApplications = processedApplications.filter(
          (app) => app !== null
        )

        setJob({
          ...jobData,
          applications: validApplications,
        })
      } catch (err) {
        console.error("Error fetching job details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (error || !job) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <p className='text-red-500'>{error || "Job not found"}</p>
          <button onClick={() => navigate(-1)} className='mt-4'>
            Go Back
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='text-2xl font-bold'>{job.title}</h1>
        <p className='text-gray-600'>{job.description}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <JobStatusDetail
              label='Category'
              value={job.category}
              icon={Users}
            />
            <JobStatusDetail label='Type' value={job.type} icon={Clock} />
            <JobStatusDetail
              label='Budget'
              value={`${job.budget?.currency || "USD"} ${job.budget?.min} - ${
                job.budget?.max
              }`}
              icon={DollarSign}
            />
            {job.timeline && (
              <JobStatusDetail
                label='Timeline'
                value={`${new Date(
                  job.timeline.startDate
                ).toLocaleDateString()} - ${new Date(
                  job.timeline.deadline
                ).toLocaleDateString()}`}
                icon={Calendar}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applicants ({job.applications?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[400px] pr-4'>
            <div className='space-y-4'>
              {job.applications?.length > 0 ? (
                job.applications.map((application) => (
                  <ApplicantCard
                    key={application._id}
                    applicant={application}
                  />
                ))
              ) : (
                <p className='text-center text-gray-500'>No applications yet</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobStatus
