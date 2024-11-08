import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { api } from "../../redux/actions/userActions"
import { formatDistanceToNow } from "date-fns"

const RecentActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const endpoint =
          user?.role === "artist"
            ? `/artists/${user._id}/activities`
            : `/requesters/${user._id}/activities`

        const { data } = await api.get(endpoint)
        setActivities(data)
      } catch (err) {
        console.error("Error fetching activities:", err)
        setError("Unable to load recent activities")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchActivities()
    }
  }, [user])

  // Simplified activity icons based on our existing models
  const getActivityIcon = (type) => {
    switch (type) {
      case "job_posted":
        return "💼"
      case "application_submitted":
      case "application_received":
        return "📝"
      case "review_received":
        return "⭐"
      default:
        return "•"
    }
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
          <div className='flex items-center justify-center text-red-500 gap-2'>
            <AlertCircle className='h-5 w-5' />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className='text-center text-gray-500'>No recent activity</p>
        ) : (
          <ul className='space-y-4'>
            {activities.map((activity) => (
              <li
                key={activity._id}
                className='flex items-center space-x-3 bg-gray-50 p-3 rounded-lg'
              >
                <span>{getActivityIcon(activity.type)}</span>
                <div className='flex-1'>
                  <p className='text-sm text-gray-900'>
                    {activity.description}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity
