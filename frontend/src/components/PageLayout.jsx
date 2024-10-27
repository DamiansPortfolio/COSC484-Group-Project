import React from "react"
import PageHeader from "./PageHeader"

const PageLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {children}
      </main>
    </div>
  )
}

export default PageLayout
