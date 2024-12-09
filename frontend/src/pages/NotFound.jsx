/**
 * 
 *
 * Potential 404 page
 * not added to App.jsx
 * '*' was causing all pages to show up blank
 */


import React, { useState } from "react"
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { Button } from "@/components/ui/button"
import PageHeader from "../components/PageHeader"
import Sidebar from "../components/Sidebar"
import { Link } from "react-router-dom";
import logo from "../assets/commission.svg"


const NotFound = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <PageHeader />
      <div className='flex flex-1'>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className='flex flex-col text-center'>
          <h1 className='text-3xl font-bold mb-4'>404</h1> 
          <h1 className='text-3xl font-bold mb-4'>Page Not Found</h1>
          {/* Logo */}
        <div className='flex items-center justify-center text-center'>
          <img src={logo} alt='Logo' className='h-8 w-auto mr-3' />
        </div>
          <Link to='/' className='text-blue-500 underline'>Return home</Link>
        </main>
      </div>
    </div>
  )
}

export default NotFound
