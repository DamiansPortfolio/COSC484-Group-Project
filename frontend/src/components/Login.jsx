import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../redux/actions/userActions"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Update selector to use new auth state
  const { loading, error, isAuthenticated } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("") // Clear any previous form errors

    if (!username.trim() || !password.trim()) {
      setFormError("Please enter both username and password")
      return
    }

    try {
      await dispatch(loginUser({ username, password }))
    } catch (err) {
      setFormError("Login failed. Please try again.")
    }
  }

  // Update effect to use isAuthenticated instead of user object
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

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
            {(error || formError) && (
              <Alert variant='destructive'>
                <AlertDescription>{error || formError}</AlertDescription>
              </Alert>
            )}
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
