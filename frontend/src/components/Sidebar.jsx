import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, FileText, MessageSquare, Star } from 'lucide-react';
import { Menu, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Job Listings', icon: Briefcase },
    { name: 'My Applications', icon: FileText },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Reviews', icon: Star }
  ];

  const currentPage = 'Dashboard'; // This should be dynamic based on the current route

  return (
    <aside className={`bg-gray-200 shadow-md transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <nav className="py-4">
        <ul className="space-y-2 px-2">
          <li>
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="w-full justify-center p-2"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </li>
          {menuItems.map((item) => (
            <li key={item.name} className="relative">
              <Button
                variant={item.name === currentPage ? "secondary" : "ghost"}
                className={`w-full h-10 relative ${item.name === currentPage ? 'bg-white' : ''}`}
              >
                <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`}>
                  <item.icon size={24} />
                </span>
                <span className={`absolute inset-0 flex items-center justify-start pl-4 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {item.name}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
