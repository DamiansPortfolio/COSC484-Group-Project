import React, { useEffect, useState } from "react"
import { getUserData } from "../../redux/actions/userActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { api } from "../../redux/actions/userActions"
import { formatDistanceToNow, isValid } from "date-fns" // Import isValid

const RecentActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = getUserData()

  useEffect(() => {
    console.log("useEffect triggered for RecentActivity")
    const fetchActivities = async () => {
      if (!user?._id) return
      try {
        const endpoint = user?.role === "artist"
          ? `/api/artists/${user._id}/activities`
          : `/api/requesters/${user._id}/activities` // Fix: Add leading slash

        const { data } = await api.get(endpoint)
        setActivities(data)
      } catch (err) {
        console.error("Error fetching activities:", err)
        setError("Unable to load recent activities")
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user?._id, user?.role])

  // Format date with validation
  const formatActivityDate = (dateString) => {
    const date = new Date(dateString)
    if (!dateString || !isValid(date)) {
      return "Date unavailable"
    }
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "job_posted": return "💼"
      case "application_submitted":
      case "application_received": return "📝" 
      case "review_received": return "⭐"
      default: return "•"
    }
  }

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-6 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-500 gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {!activities?.length ? (
          <p className="text-center text-gray-500">No recent activity</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li
                key={activity._id}
                className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
              >
                <span>{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatActivityDate(activity.createdAt)}
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