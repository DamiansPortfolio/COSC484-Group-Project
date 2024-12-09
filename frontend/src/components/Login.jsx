// Login.jsx
import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { loginUser, isAuthenticated } from "../redux/actions/userActions"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      toast.error("Username is required")
      return
    }
    if (!password.trim()) {
      toast.error("Password is required")
      return
    }

    setLoading(true)
    try {
      const result = await dispatch(loginUser({ username, password }))
      if (!result.success) {
        const errorMessage = result.error?.toLowerCase() || ""
        if (errorMessage.includes("invalid credentials")) {
          toast.error("Invalid username or password")
        } else if (errorMessage.includes("user not found")) {
          toast.error("User does not exist")
        } else {
          toast.error(result.error || "Login failed")
        }
      } else if (isAuthenticated()) {
        toast.success("Welcome back!")
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many login attempts. Please try again later.")
      } else {
        toast.error("Login failed. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
                required
                disabled={loading}
                className='w-full'
              />
            </div>
            <div className='space-y-2'>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
                disabled={loading}
                className='w-full'
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200'
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{" "}
            <Link to='/register' className='text-blue-500 hover:text-blue-600'>
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
