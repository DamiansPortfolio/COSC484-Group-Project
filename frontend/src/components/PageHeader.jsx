// components/PageHeader.js
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../redux/actions/userActions"
import logo from "../assets/commission.svg"
import { Link } from "react-router-dom"

const PageHeader = () => {
  const { user, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <header className='bg-white shadow-sm h-16'>
      <div className='h-full px-4 mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='h-8 w-auto mr-3' />
          <span className='text-xl font-bold text-gray-800'>
            Creative Commission Platform
          </span>
        </div>

        <div className='flex items-center gap-4'>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className='text-red-600'>{error}</span>
          ) : user ? (
            <>
              <span className='font-semibold'>Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
              >
                Logout
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              <Link to='/login'>
                <button className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
                  Login
                </button>
              </Link>
              <Link to='/register'>
                <button className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
                  Create User
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default PageHeader
