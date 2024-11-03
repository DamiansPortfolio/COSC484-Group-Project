// components/PageLayout.js
import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const location = useLocation()

  const showSidebar = location.pathname === "/"

  return (
    <div className='min-h-screen flex flex-col'>
      <PageHeader />
      <div className='flex flex-1'>
        {showSidebar && (
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        )}
        <main
          className={`
            flex-1 
            p-6 
            bg-gray-50
            transition-all 
            duration-300 
          `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default PageLayout
