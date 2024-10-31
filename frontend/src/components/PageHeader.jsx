import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../redux/actions/userActions" // For logout action
import logo from "../assets/commission.svg"
import { Link } from "react-router-dom" // Assuming you're using React Router for navigation

const PageHeader = () => {
  const { user, loading, error } = useSelector((state) => state.user) // Get user information
  const dispatch = useDispatch() // Get the dispatch function

  const handleLogout = () => {
    dispatch(logoutUser()) // Dispatch the logout action
  }

  return (
    <header className='bg-gray-400 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center'>
        {/* Logo */}
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='h-8 w-auto mr-3' />
          <span className='text-xl font-bold'>
            Creative Commission Platform
          </span>
        </div>
        <div className='flex items-center'>
          {loading ? (
            <span className='text-lg font-semibold text-gray-700'>
              Loading...
            </span>
          ) : error ? (
            <span className='text-lg font-semibold text-red-600'>{error}</span>
          ) : user ? (
            <span className='text-lg font-semibold text-gray-700'>
              Welcome, {user.username}!
            </span>
          ) : (
            <>
              <Link to='/login'>
                <button className='ml-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>
                  Login
                </button>
              </Link>
              <Link to='/register'>
                <button className='ml-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>
                  Create User
                </button>
              </Link>
            </>
          )}
          {user && (
            <button
              className='ml-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default PageHeader
