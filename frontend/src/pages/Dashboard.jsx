// pages/Dashboard.js
import React from "react"
import QuickStats from "../components/dashboard/QuickStats"
import RecentActivity from "../components/dashboard/RecentActivity"
import Recommendations from "../components/dashboard/Recommendations"

const Dashboard = () => {
  return (
    <div className='space-y-6'>
      <QuickStats />
      <RecentActivity />
      <Recommendations />
    </div>
  )
}

export default Dashboard
