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
import { getUserData } from "../redux/actions/userActions"

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation()
  const user = getUserData()

  const menuItems = useMemo(() => {
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

    const artistItems = [
      {
        name: "Available Jobs",
        icon: Briefcase,
        path: "/jobs",
        implemented: true,
        comingSoon: false,
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

    return user?.role === "artist"
      ? [...commonItems, ...artistItems]
      : user?.role === "requester"
      ? [...commonItems, ...requesterItems]
      : commonItems
  }, [user])

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  return (
    <div
      className={`
        h-full
        bg-white 
        shadow-lg
        transition-all 
        duration-300
        ${sidebarOpen ? "w-64" : "w-16"}
        flex
        flex-col
        overflow-hidden
      `}
    >
      <nav className='flex-1 py-4'>
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
                      justify-start
                      ${isActivePath(item.path) ? "bg-gray-100" : ""}
                      hover:bg-gray-100
                      group
                      transition-all
                      duration-300
                    `}
                  >
                    <item.icon size={24} className='min-w-[24px]' />
                    <span
                      className={`
                        ml-2
                        transition-all
                        duration-200
                        ${
                          sidebarOpen
                            ? "opacity-100 translate-x-0 delay-150"
                            : "opacity-0 -translate-x-4 overflow-hidden w-0"
                        }
                      `}
                    >
                      {item.name}
                    </span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant='ghost'
                  className={`
                    w-full 
                    justify-start
                    opacity-60
                    cursor-not-allowed
                    group
                    transition-all
                    duration-300
                    relative
                  `}
                  disabled
                >
                  <item.icon size={24} className='min-w-[24px]' />
                  <div
                    className={`
                      flex items-center justify-between
                      flex-1
                      transition-all
                      duration-200
                      ${
                        sidebarOpen
                          ? "opacity-100 translate-x-0 delay-150"
                          : "opacity-0 -translate-x-4 overflow-hidden w-0"
                      }
                    `}
                  >
                    <span className='ml-2 truncate'>{item.name}</span>
                    {item.comingSoon && sidebarOpen && (
                      <span
                        className='
                        ml-1
                        text-[10px]
                        bg-gray-100
                        text-gray-500
                        px-1.5
                        py-0.5
                        rounded-full
                        font-medium
                        whitespace-nowrap
                      '
                      >
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && (
                    <div
                      className='
                        absolute 
                        left-full 
                        ml-2 
                        px-2 
                        py-1 
                        bg-gray-800 
                        text-white 
                        text-xs 
                        rounded 
                        opacity-0 
                        group-hover:opacity-100 
                        transition-opacity 
                        whitespace-nowrap 
                        z-50
                      '
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
    </div>
  )
}

export default Sidebar
