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
          ? `/api/artists/${user._id}/statistics`
          : `/api/requesters/${user._id}/statistics`
      const { data } = await api.get(endpoint)
      setStats(formatStats(data))
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }, [user._id, user.role])

  useEffect(() => {
    console.log("useEffect triggered for QuickStats")
    fetchStats()
  }, [fetchStats])

  const formatStats = (data) => {
    if (!data) return []
    if (user?.role === "artist") {
      return [
        {
          title: "Active Applications",
          value: data.activeApplications || 0,
          description: "Current open applications",
        },
        {
          title: "Completed Jobs",
          value: data.completedJobs || 0,
          description: "Successfully completed",
        },
        {
          title: "Average Rating",
          value:
            typeof data.averageRating === "number"
              ? data.averageRating.toFixed(1)
              : "N/A",
          description: "Overall rating",
        },
      ]
    }
    return [
      {
        title: "Active Jobs",
        value: typeof data.activeJobs === 'number' ? data.activeJobs : 0, //fixed zero not showing not functional but atleats the zero shows up
        description: "Currently posted jobs",
      },
      {
        title: "Total Applications",
        value: typeof data.totalApplications === 'number' ? data.totalApplications : 0,  //fixed zero not showing not functional but atleats the zero shows up
        description: "Received applications",
      },
      {
        title: "Completed Jobs",
        value: typeof data.completedJobs === 'number' ? data.completedJobs : 0,  //fixed zero not showing not functional but atleats the zero shows up
        description: "Successfully finished",
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
      <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
