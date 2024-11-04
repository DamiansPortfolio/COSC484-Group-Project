import React from "react"
import { Link, useNavigate } from "react-router-dom" // Add useNavigate
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../redux/actions/userActions"
import { LogOut, User } from "lucide-react"
import { Button } from "./ui/button"
import logo from "../assets/commission.svg"

const PageHeader = () => {
  const { user, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/")
  }

  return (
    <header className='bg-white shadow-sm h-16 sticky top-0 z-50'>
      <div className='h-full max-w-7xl mx-auto px-6 flex justify-between items-center'>
        {/* Logo and Title */}
        <Link to='/' className='flex items-center'>
          <div className='flex items-center'>
            {logo ? (
              <img
                src={logo}
                alt='Logo'
                className='h-8 w-auto mr-3'
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            ) : null}
            <span className='text-xl font-bold text-gray-800 hidden sm:inline'>
              Creative Commission Platform
            </span>
            <span className='text-xl font-bold text-gray-800 sm:hidden'>
              CCP
            </span>
          </div>
        </Link>

        {/* User Actions */}
        <div className='flex items-center gap-4'>
          {loading ? (
            <div className='animate-pulse bg-gray-200 h-8 w-24 rounded' />
          ) : error ? (
            <span className='text-red-600 px-3 py-1 rounded-md bg-red-50'>
              {error}
            </span>
          ) : user ? (
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
                  <User className='h-5 w-5 text-gray-600' />
                </div>
                <span className='font-medium text-gray-700 hidden sm:inline'>
                  {user.username}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant='ghost'
                className='text-gray-600 hover:text-red-600 hover:bg-red-50'
              >
                <LogOut className='h-5 w-5 mr-2' />
                <span className='hidden sm:inline'>Logout</span>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default PageHeader
