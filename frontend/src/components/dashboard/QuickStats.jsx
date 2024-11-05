import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { api } from "../../redux/actions/userActions" // Import our configured axios instance

const QuickStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let endpoint =
          user?.role === "artist"
            ? "/artists/statistics"
            : "/requesters/statistics"

        const { data } = await api.get(`${endpoint}/${user?._id}`)
        setStats(formatStats(data))
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchStats()
    }
  }, [user])

  const formatStats = (data) => {
    if (user?.role === "artist") {
      return [
        {
          title: "Active Applications",
          value: data?.activeApplications || 0,
          description: "Current open applications",
        },
        {
          title: "Completed Jobs",
          value: data?.completedJobs || 0,
          description: "Successfully completed",
        },
        {
          title: "Average Rating",
          value: data?.averageRating?.toFixed(1) || "N/A",
          description: "From completed jobs",
        },
      ]
    }

    return [
      {
        title: "Active Jobs",
        value: data?.activeJobs || 0,
        description: "Currently posted jobs",
      },
      {
        title: "Total Applications",
        value: data?.totalApplications || 0,
        description: "Across all jobs",
      },
      {
        title: "Completed Projects",
        value: data?.completedJobs || 0,
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

export default QuickStats
