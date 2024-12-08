import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import QuickStats from "../components/dashboard/QuickStats"
import RecentActivity from "../components/dashboard/RecentActivity"
import Recommendations from "../components/dashboard/Recommendations"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { checkAuthStatus } from "../redux/actions/userActions"

// Dashboard component
// Provides personalized dashboard view based on user role
const Dashboard = () => {
  const { user, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // Verify user authentication on component mount
  useEffect(() => {
    if (!user && !loading) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, user, loading])

  // Loading state handler
  if (loading) {
    return (
      <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      </div>
    )
  }

  // Authentication error handler
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load dashboard content. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  // Main dashboard render
  return (
    <div className='min-h-[calc(100vh-4rem)]'>
      <header className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Welcome back, {user.name}
        </h1>
        <p className='text-gray-600'>
          {user.role === "artist"
            ? "Here's what's happening with your applications"
            : "Here's what's happening with your job posts"}
        </p>
      </header>

      <div className='space-y-6'>
        {user.role === "artist" ? (
          <>
            <QuickStats userRole='artist' />
            <RecentActivity activityType='applications' />
            <Recommendations type='jobs' />
          </>
        ) : (
          <>
            <QuickStats userRole='requester' />
            <RecentActivity activityType='job-posts' />
            <Recommendations type='artists' />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
