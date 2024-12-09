import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton component
const ProfileSkeleton = () => (
  <div className='space-y-6 p-8'>
    <div className='space-y-4'>
      <Skeleton className='h-12 w-[250px]' />
      <Skeleton className='h-4 w-[200px]' />
      <Skeleton className='h-4 w-[150px]' />
    </div>
    <Skeleton className='h-32 w-full' />
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {[1, 2].map((n) => (
        <Skeleton key={n} className='h-32 w-full' />
      ))}
    </div>
  </div>
)

// Company Information Component
const RequesterInfo = ({ requesterData }) => (
  <Card>
    <CardContent className='flex items-center space-x-4 p-6'>
      <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold'>
        {requesterData.userId?.name?.[0] || '?'}
      </div>
      <div className='flex-grow'>
        <h1 className='text-2xl font-bold'>{requesterData.userId?.name || 'Name Not Available'}</h1>
        <p className='text-gray-600'>@{requesterData.userId?.username}</p>
        {requesterData.userId?.location && (
          <p className='text-gray-500 mt-1'>{requesterData.userId.location}</p>
        )}
      </div>
    </CardContent>
  </Card>
)

// Statistics Component
const Statistics = ({ statistics }) => (
  <Card>
    <CardHeader>
      <CardTitle>Statistics</CardTitle>
    </CardHeader>
    <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {[
        { label: 'Total Jobs Posted', value: statistics?.totalJobsPosted || 0 },
        { label: 'Active Jobs', value: statistics?.activeJobs || 0 },
        { label: 'Completed Jobs', value: statistics?.completedJobs || 0 },
        { label: 'Total Applications', value: statistics?.totalApplications || 0 },
      ].map((stat) => (
        <div key={stat.label} className='text-center p-4 bg-gray-50 rounded-lg'>
          <p className='text-2xl font-bold'>{stat.value}</p>
          <p className='text-sm text-gray-600'>{stat.label}</p>
        </div>
      ))}
    </CardContent>
  </Card>
)

// Recent Jobs Component
const RecentJobs = ({ jobs = [] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Jobs</CardTitle>
    </CardHeader>
    <CardContent>
      {jobs.length === 0 ? (
        <p className='text-center text-gray-500'>No jobs posted yet</p>
      ) : (
        <div className='space-y-4'>
          {jobs.map((job) => (
            <div key={job._id} className='p-4 border rounded-lg hover:bg-gray-50'>
              <Link to={`/jobs/${job._id}`} className='hover:text-blue-600'>
                <h3 className='font-medium'>{job.title}</h3>
                <div className='flex items-center gap-2 mt-2'>
                  <Badge variant='outline'>{job.status}</Badge>
                  <span className='text-sm text-gray-500'>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)

// Reviews Section
const ReviewsSection = ({ reviews = [], averageRating = 0 }) => (
  <Card>
    <CardHeader>
      <CardTitle>Reviews</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='mb-4'>
        <p className='text-lg font-medium'>
          {averageRating.toFixed(1)} / 5.0 ({reviews.length} reviews)
        </p>
      </div>
      {reviews.length === 0 ? (
        <p className='text-center text-gray-500'>No reviews yet</p>
      ) : (
        <div className='space-y-4'>
          {reviews.map((review) => (
            <div key={review._id} className='border-b pb-4'>
              <div className='flex items-center gap-2'>
                <span className='text-yellow-400'>★</span>
                <span className='font-medium'>{review.rating}</span>
              </div>
              <p className='text-gray-600 mt-2'>{review.comment}</p>
              <p className='text-sm text-gray-500 mt-1'>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)


const RequesterProfile = () => {
  const { id } = useParams()
  const [requesterData, setRequesterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequesterData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/requesters/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
        if (!response.ok) {
          throw new Error("Requester not found")
        }
        
        const data = await response.json()
        setRequesterData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequesterData()
  }, [id])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh]'>
        <h1 className='text-3xl font-bold mb-4'>Requester Not Found</h1>
        <p className='text-gray-600 mb-8'>{error}</p>
        <Link
          to='/'
          className='text-blue-500 hover:underline hover:text-blue-600 transition-colors'
        >
          Go back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <RequesterInfo requesterData={requesterData} />
      <Statistics statistics={requesterData.statistics} />
      <RecentJobs jobs={requesterData.jobs} />
      <ReviewsSection 
        reviews={requesterData.reviews} 
        averageRating={requesterData.averageRating} 
      />
    </div>
  )
}

export default RequesterProfile