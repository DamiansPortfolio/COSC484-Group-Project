import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import QuickStats from "../components/dashboard/QuickStats"
import RecentActivity from "../components/dashboard/RecentActivity"
import Recommendations from "../components/dashboard/Recommendations"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const Dashboard = () => {
  const { user, loading } = useSelector((state) => state.user)

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (loading) {
      return (
        <Card className='w-full h-48 flex items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </Card>
      )
    }

    if (user?.role === "artist") {
      return (
        <div className='space-y-6'>
          <QuickStats userRole='artist' />
          <RecentActivity activityType='applications' />
          <Recommendations type='jobs' />
        </div>
      )
    }

    if (user?.role === "requester") {
      return (
        <div className='space-y-6'>
          <QuickStats userRole='requester' />
          <RecentActivity activityType='job-posts' />
          <Recommendations type='artists' />
        </div>
      )
    }

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

  return (
    <div className='min-h-[calc(100vh-4rem)]'>
      <header className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Welcome back, {user?.name || "User"}
        </h1>
        <p className='text-gray-600'>
          {user?.role === "artist"
            ? `Here's what's happening with your applications`
            : `Here's what's happening with your job posts`}
        </p>
      </header>

      {renderDashboard()}
    </div>
  )
}

export default Dashboard
