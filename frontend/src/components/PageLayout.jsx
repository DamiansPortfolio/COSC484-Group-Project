// components/PageLayout.js
import React, { useState } from "react"
import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className='flex flex-col min-h-screen'>
      <PageHeader />
      <div className='flex flex-1'>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`
            flex-1 
            p-6 
            bg-gray-50
            transition-all 
            duration-300 
            ${sidebarOpen ? "ml-64" : "ml-16"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default PageLayout
