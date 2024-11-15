import React, { useState } from "react" // Add this import
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const publicRoutes = ["/login", "/register", "/"]
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/jobs",
    "/applications",
    "/messages",
    "/reviews",
  ]
  const noHeaderRoutes = ["/"]

  const showSidebar =
    isAuthenticated &&
    !publicRoutes.includes(location.pathname) &&
    protectedRoutes.some((route) => location.pathname.startsWith(route))

  const showHeader = !noHeaderRoutes.includes(location.pathname)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className='min-h-screen flex flex-col'>
      {showHeader && (
        <header className='fixed top-0 left-0 right-0 z-50'>
          <PageHeader />
        </header>
      )}

      <div className='flex flex-1 pt-16'>
        {showSidebar && (
          <div className='fixed left-0 top-16 h-[calc(100vh-64px)]'>
            <Sidebar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              user={user}
            />
          </div>
        )}
        <main
          className={`
          flex-1
          transition-all 
          duration-300 
          ease-in-out
          ${location.pathname === "/" ? "p-0" : "p-6"}
          ${showSidebar ? (sidebarOpen ? "ml-64" : "ml-16") : "ml-0"}
        `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default PageLayout
