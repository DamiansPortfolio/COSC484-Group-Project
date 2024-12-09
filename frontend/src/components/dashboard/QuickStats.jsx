import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { api, getUserData } from "../../redux/actions/userActions"

const QuickStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = getUserData()

  const fetchStats = useCallback(async () => {
    console.log("Fetching stats for user:", user?._id)
    if (!user?._id) return

    try {
      const endpoint =
        user.role === "artist"
          ? `/api/statistics/artists/${user._id}`
          : `/api/statistics/requesters/${user._id}`

      const { data } = await api.get(endpoint)
      setStats(formatStats(data))
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }, [user?._id, user?.role])

  useEffect(() => {
    console.log("useEffect triggered for QuickStats")
    fetchStats()
  }, [fetchStats])

  const formatStats = (data) => {
    if (!data) return []

    // Format stats for artists
    if (user?.role === "artist") {
      return [
        {
          title: "Active Applications",
          value: data.activeApplications ?? 0,
          description: "Current pending applications",
        },
        {
          title: "Success Rate",
          value: `${data.successRate ?? 0}%`,
          description: "Completed vs accepted jobs",
        },
        {
          title: "Acceptance Rate",
          value: `${data.acceptanceRate ?? 0}%`,
          description: "Applications accepted",
        },
        {
          title: "Completed Jobs",
          value: data.completedJobs ?? 0,
          description: "Successfully completed",
        },
        {
          title: "Total Applications",
          value: data.totalApplications ?? 0,
          description: "All applications submitted",
        },
      ]
    }

    // Format stats for requesters
    return [
      {
        title: "Active Jobs",
        value: data.activeJobs ?? 0,
        description: "Currently open positions",
      },
      {
        title: "Applications Per Job",
        value: data.avgApplicationsPerJob ?? 0,
        description: "Average applications received",
      },
      {
        title: "Jobs With Hires",
        value: data.jobsWithHires ?? 0,
        description: "Jobs with accepted artists",
      },
      {
        title: "Total Jobs",
        value: data.totalJobs ?? 0,
        description: "All posted jobs",
      },
      {
        title: "Total Applications",
        value: data.totalApplications ?? 0,
        description: "All applications received",
      },
    ]
  }

  if (loading) {
    return (
      <Card className='mb-6'>
        <CardContent className='p-6 flex justify-center items-center'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className='mb-6 border-red-200'>
        <CardContent className='p-6'>
          <p className='text-red-500 text-center'>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {stats?.map((stat) => (
          <Card key={stat.title} className='overflow-hidden'>
            <CardContent className='p-4'>
              <p className='text-sm font-medium text-gray-500'>{stat.title}</p>
              <p className='text-2xl font-bold mt-2'>{stat.value}</p>
              <p className='text-xs text-gray-400 mt-1'>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default React.memo(QuickStats)
