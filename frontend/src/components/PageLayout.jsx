// components/PageLayout.js
import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const location = useLocation()

  // Define routes that should NOT show the sidebar
  const noSidebarRoutes = [
    "/login",
    "/register",
    // Add more routes here that shouldn't show the sidebar
    // '/forgot-password',
    // '/reset-password',
    // '/settings',
    // etc...
  ]

  // Define route patterns that should show the sidebar
  const sidebarPatterns = [
    "/", // Dashboard
    "/profile", // Will match any profile route
    "/jobs", // Future route
    "/applications", // Future route
    "/messages", // Future route
    "/reviews", // Future route
    // Add more route patterns here that should show the sidebar
    // '/projects',
    // '/notifications',
    // '/commissions',
    // etc...
  ]

  // Check if current path should show sidebar
  const showSidebar =
    !noSidebarRoutes.includes(location.pathname) &&
    sidebarPatterns.some((pattern) => location.pathname.startsWith(pattern))

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
