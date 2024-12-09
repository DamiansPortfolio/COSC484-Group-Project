import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api, getUserData } from "../../redux/actions/userActions"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Company Information Component (Remains the same)
const RequesterInfo = ({ requesterData }) => (
  <Card>
    <CardContent className='flex items-center space-x-4 p-6'>
      <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold'>
        {requesterData.userId?.name?.[0] || "?"}
      </div>
      <div className='flex-grow'>
        <h1 className='text-2xl font-bold'>
          {requesterData.userId?.name || "Name Not Available"}
        </h1>
        <p className='text-gray-600'>@{requesterData.userId?.username}</p>
        {requesterData.userId?.location && (
          <p className='text-gray-500 mt-1'>{requesterData.userId.location}</p>
        )}
      </div>
    </CardContent>
  </Card>
)

// Statistics Component (Leverages fetched stats)
const Statistics = ({ statistics }) => (
  <Card>
    <CardHeader>
      <CardTitle>Statistics</CardTitle>
    </CardHeader>
    <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {[
        { label: "Total Jobs Posted", value: statistics?.totalJobsPosted || 0 },
        { label: "Active Jobs", value: statistics?.activeJobs || 0 },
        { label: "Completed Jobs", value: statistics?.completedJobs || 0 },
        {
          label: "Total Applications",
          value: statistics?.totalApplications || 0,
        },
      ].map((stat) => (
        <div key={stat.label} className='text-center p-4 bg-gray-50 rounded-lg'>
          <p className='text-2xl font-bold'>{stat.value}</p>
          <p className='text-sm text-gray-600'>{stat.label}</p>
        </div>
      ))}
    </CardContent>
  </Card>
)

// RequesterProfile Component (Updated to include statistics)
const RequesterProfile = () => {
  const { id } = useParams()
  const [requesterData, setRequesterData] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = getUserData()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch requester data
      const { data: requesterData } = await api.get(`/api/users/${id}`)
      setRequesterData(requesterData)

      // Fetch statistics for the requester
      const endpoint =
        user?.role === "artist"
          ? `/api/statistics/artists/${user._id}`
          : `/api/statistics/requesters/${user._id}`

      const { data: statsData } = await api.get(endpoint)
      setStats(formatStats(statsData))
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [id, user?._id, user?.role])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatStats = (data) => {
    if (!data) return []

    return [
      { label: "Total Jobs Posted", value: data.totalJobs ?? 0 },
      { label: "Active Jobs", value: data.activeJobs ?? 0 },
      { label: "Completed Jobs", value: data.completedJobs ?? 0 },
      { label: "Total Applications", value: data.totalApplications ?? 0 },
    ]
  }

  if (loading) {
    return (
      <div className='p-8'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8'>
        <p className='text-red-500 text-center'>{error}</p>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-8'>
      {requesterData && <RequesterInfo requesterData={requesterData} />}
      {stats && <Statistics statistics={stats} />}
    </div>
  )
}

export default RequesterProfile
