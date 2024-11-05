// components/PageLayout.js
import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"
import { refreshToken } from "../redux/actions/userActions"

const PageLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.user)

  // Routes configuration
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

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    location.pathname.startsWith(route)
  )

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname)

  // Auth check effect
  useEffect(() => {
    const checkAuth = async () => {
      if (isProtectedRoute && !isAuthenticated) {
        // Try to refresh token first
        const refreshed = await dispatch(refreshToken())
        if (!refreshed) {
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          })
        }
      }
    }

    checkAuth()
  }, [isProtectedRoute, isAuthenticated, location, navigate, dispatch])

  // Sidebar visibility logic
  const showSidebar =
    isAuthenticated &&
    !publicRoutes.includes(location.pathname) &&
    protectedRoutes.some((route) => location.pathname.startsWith(route))

  // Header visibility logic
  const showHeader = !noHeaderRoutes.includes(location.pathname)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className='min-h-screen flex flex-col'>
      {showHeader && <PageHeader />}
      <div className='flex flex-1 w-full'>
        {showSidebar && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            user={user}
          />
        )}
        <main
          className={`
            flex-1 
            ${location.pathname === "/" ? "p-0" : "p-6"}
            w-full
            bg-gray-50
            transition-all 
            duration-300 
            ${showSidebar && sidebarOpen ? "ml-64" : "ml-0"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default PageLayout
