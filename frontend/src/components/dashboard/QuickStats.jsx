import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const QuickStats = () => {
  const stats = [
    { title: "Open Jobs", value: 5 },
    { title: "Applications", value: 12 },
    { title: "Messages", value: 3 },
  ]

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-4'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className='p-4'>
              <p className='text-sm text-gray-500'>{stat.title}</p>
              <p className='text-2xl font-bold'>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default QuickStats
