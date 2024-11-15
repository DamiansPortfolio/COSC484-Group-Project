import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../redux/actions/userActions"
import { LogOut, User, LogIn } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import logo from "../assets/commission.svg"

const PageHeader = () => {
  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/")
  }

  const handleLogin = () => {
    navigate("/login", {
      state: { from: location.pathname },
    })
  }

  const handleProfile = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`)
    }
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  const renderUserActions = () => {
    if (loading) {
      return <div className='animate-pulse bg-gray-200 h-8 w-24 rounded' />
    }

    if (error) {
      return (
        <span className='text-red-600 px-3 py-1 rounded-md bg-red-50'>
          {error}
        </span>
      )
    }

    if (isAuthenticated && user) {
      return (
        <div className='flex items-center gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className='h-8 w-8 rounded-full object-cover'
                      onError={(e) => {
                        e.currentTarget.src = ""
                        e.currentTarget.className = "hidden"
                      }}
                    />
                  ) : (
                    <User className='h-5 w-5 text-gray-600' />
                  )}
                </div>
                <span className='font-medium text-gray-700 hidden sm:inline'>
                  {user.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuItem onClick={handleDashboard}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfile}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='text-red-600 focus:text-red-600 focus:bg-red-50'
              >
                <LogOut className='h-4 w-4 mr-2' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    return (
      <Button
        onClick={handleLogin}
        variant='ghost'
        className='text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      >
        <LogIn className='h-5 w-5 mr-2' />
        <span className='hidden sm:inline'>Login</span>
      </Button>
    )
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
        <div className='flex items-center gap-4'>{renderUserActions()}</div>
      </div>
    </header>
  )
}

export default PageHeader
