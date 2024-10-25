import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RecentActivity = () => {
  const activities = [
    'New job posting: "3D Animator needed"',
    'Application received for "Pixel Artist"',
    "New message from John Doe",
    "Review received: 5 stars",
  ]

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {activities.map((activity, index) => (
            <li key={index} className='flex items-center space-x-2'>
              <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
