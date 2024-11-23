import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import { isAuthenticated, getUserData } from "../redux/actions/userActions"
import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const authenticated = isAuthenticated()
  const user = getUserData()

  const publicRoutes = ["/login", "/register"]
  const welcomeRoute = "/welcome"
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/jobs",
    "/applications",
    "/messages",
    "/reviews",
  ]

  const showSidebar =
    authenticated &&
    !publicRoutes.includes(location.pathname) &&
    location.pathname !== welcomeRoute &&
    protectedRoutes.some((route) => location.pathname.startsWith(route))

  const showHeader =
    !publicRoutes.includes(location.pathname) &&
    location.pathname !== welcomeRoute

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  if (location.pathname === welcomeRoute) {
    return <div>{children}</div>
  }

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
