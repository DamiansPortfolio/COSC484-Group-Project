// components/Sidebar.js
import React from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react"
import { Menu, X } from "lucide-react"
import { useLocation } from "react-router-dom"

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation()

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Job Listings", icon: Briefcase, path: "/" }, // Temporarily point to home
    { name: "My Applications", icon: FileText, path: "/" }, // Temporarily point to home
    { name: "Messages", icon: MessageSquare, path: "/" }, // Temporarily point to home
    { name: "Reviews", icon: Star, path: "/" }, // Temporarily point to home
  ]

  return (
    <aside
      className={`
        bg-white 
        shadow-lg
        min-h-screen
        fixed 
        left-0 
        top-[64px]
        transition-all 
        duration-300 
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
              <Button
                variant={
                  location.pathname === item.path ? "secondary" : "ghost"
                }
                className={`
                  w-full 
                  h-10 
                  relative 
                  ${location.pathname === item.path ? "bg-gray-100" : ""}
                  hover:bg-gray-100
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
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
