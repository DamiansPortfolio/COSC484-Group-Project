import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../redux/actions/userActions"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert" // Import Alert if you have it set up

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.user) // Get user state

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Logging in with:", { username, password }) // Log the input for debugging
    await dispatch(loginUser({ username, password })) // Wait for the login action to complete
  }

  // Navigate to the home page if the user is authenticated and there is no error
  useEffect(() => {
    if (user && !error) {
      navigate("/") // Navigate to the home page after a successful login
    }
  }, [user, error, navigate]) // Run useEffect when user or error changes

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md p-6'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <Input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
              required
              className='mb-4'
            />
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
              className='mb-4'
            />
            <Button
              type='submit'
              disabled={loading}
              className='bg-blue-500 text-white hover:bg-blue-600 transition duration-200'
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {error && (
            <Alert className='mt-4' type='error'>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
