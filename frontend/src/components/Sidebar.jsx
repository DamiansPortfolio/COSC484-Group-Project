import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  User,
  Menu,
  X,
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation()
  const { user } = useSelector((state) => state.user)

  // Define implemented routes
  const implementedRoutes = [
    "/dashboard",
    "/profile",
    // Add other implemented routes here
  ]

  // Define menu items with implementation status
  const menuItems = useMemo(() => {
    // Common menu items for all users
    const commonItems = [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        implemented: true,
      },
      {
        name: "Profile",
        icon: User,
        path: `/profile/${user?._id}`,
        implemented: true,
      },
    ]

    // Artist-specific menu items
    const artistItems = [
      {
        name: "Available Jobs",
        icon: Briefcase,
        path: "/jobs",
        implemented: false,
        comingSoon: true,
      },
      {
        name: "My Applications",
        icon: FileText,
        path: "/applications",
        implemented: false,
        comingSoon: true,
      },
      {
        name: "Messages",
        icon: MessageSquare,
        path: "/messages",
        implemented: false,
        comingSoon: true,
      },
      {
        name: "Reviews",
        icon: Star,
        path: "/reviews",
        implemented: false,
        comingSoon: true,
      },
    ]

    // Requester-specific menu items
    const requesterItems = [
      {
        name: "Post Job",
        icon: Briefcase,
        path: "/jobs/create",
        implemented: false,
        comingSoon: true,
      },
      {
        name: "My Jobs",
        icon: FileText,
        path: "/jobs/my-posts",
        implemented: false,
        comingSoon: true,
      },
      {
        name: "Messages",
        icon: MessageSquare,
        path: "/messages",
        implemented: false,
        comingSoon: true,
      },
    ]

    // Return role-specific menu items
    if (user?.role === "artist") {
      return [...commonItems, ...artistItems]
    }
    if (user?.role === "requester") {
      return [...commonItems, ...requesterItems]
    }

    return commonItems
  }, [user])

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`
        bg-white 
        shadow-lg
        h-[calc(100vh-64px)] 
        sticky
        top-16
        transition-all 
        duration-300 
        overflow-y-auto
        ${sidebarOpen ? "w-64" : "w-16"}
      `}
    >
      <nav className='py-4'>
        <ul className='space-y-2 px-2'>
          <li>
            <Button
              variant='ghost'
              onClick={toggleSidebar}
              className='w-full justify-center p-2 hover:bg-gray-100'
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </li>

          {menuItems.map((item) => (
            <li key={item.name}>
              {item.implemented ? (
                <Link to={item.path}>
                  <Button
                    variant={isActivePath(item.path) ? "secondary" : "ghost"}
                    className={`
                      w-full 
                      h-10 
                      relative 
                      ${isActivePath(item.path) ? "bg-gray-100" : ""}
                      hover:bg-gray-100
                      group
                    `}
                  >
                    <span
                      className={`
                        absolute 
                        inset-0 
                        flex 
                        items-center 
                        justify-center 
                        transition-opacity 
                        duration-300 
                        ${sidebarOpen ? "opacity-0" : "opacity-100"}
                      `}
                    >
                      <item.icon size={24} />
                    </span>
                    <span
                      className={`
                        absolute 
                        inset-0 
                        flex 
                        items-center 
                        pl-4 
                        transition-opacity 
                        duration-300 
                        ${sidebarOpen ? "opacity-100" : "opacity-0"}
                      `}
                    >
                      <item.icon size={24} className='mr-2' />
                      {item.name}
                    </span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant='ghost'
                  className={`
                    w-full 
                    h-10 
                    relative 
                    opacity-60
                    cursor-not-allowed
                    group
                  `}
                  disabled
                >
                  <span
                    className={`
                      absolute 
                      inset-0 
                      flex 
                      items-center 
                      justify-center 
                      transition-opacity 
                      duration-300 
                      ${sidebarOpen ? "opacity-0" : "opacity-100"}
                    `}
                  >
                    <item.icon size={24} />
                  </span>
                  <span
                    className={`
                      absolute 
                      inset-0 
                      flex 
                      items-center 
                      pl-4 
                      transition-opacity 
                      duration-300 
                      ${sidebarOpen ? "opacity-100" : "opacity-0"}
                    `}
                  >
                    <item.icon size={24} className='mr-2' />
                    {item.name}
                    {item.comingSoon && (
                      <span className='ml-2 text-xs bg-gray-200 px-2 py-1 rounded'>
                        Coming Soon
                      </span>
                    )}
                  </span>

                  {/* Tooltip for unimplemented features */}
                  {!sidebarOpen && (
                    <div
                      className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50'
                    >
                      {item.name} - Coming Soon
                    </div>
                  )}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
