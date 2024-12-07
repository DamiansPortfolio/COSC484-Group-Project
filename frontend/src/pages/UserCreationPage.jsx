// UserCreationPage.jsx
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../redux/actions/userActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * User Registration Component
 *
 * Handles new user account creation with role selection.
 * Features:
 * - Complete form validation
 * - Error handling and display
 * - Role selection (Artist/Requester)
 * - Password requirements
 * - Automatic redirection after registration
 */
const UserCreationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "requester",
  })
  const [formError, setFormError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setFormError("Username is required")
      return false
    }
    if (!formData.name.trim()) {     // Added this check
      setFormError("Name is required")
      return false
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormError("Please enter a valid email address")
      return false
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long")
      return false
    }
    return true
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setFormError("")

  if (!validateForm()) {
    return
  }

  try {
    const result = await dispatch(registerUser(formData))
    if (result.success) {
      navigate("/dashboard")  // Add this line to redirect on success
    } else {
      setFormError(result.error || "Unable to create account. Please try again.")
    }
  } catch (error) {
    setFormError(
      error.response?.data?.message ||
        "Unable to create account. Please try again."
    )

    if (error.response?.data?.message?.includes("already exists")) {
      if (error.response.data.message.includes("email")) {
        setFormData((prev) => ({ ...prev, email: "" }))
      } else if (error.response.data.message.includes("username")) {
        setFormData((prev) => ({ ...prev, username: "" }))
      }
    }
  }
}

  return (
    <div className='flex justify-center py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              type='text'
              name='username'
              placeholder='Username'
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Input
              type='text'
              name='name'
              placeholder='Full Name'
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Input
              type='password'
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              minLength={8}
            />
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='requester'>Requester</SelectItem>
                <SelectItem value='artist'>Artist</SelectItem>
              </SelectContent>
            </Select>

            {formError && (
              <Alert variant='destructive'>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200'
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{" "}
            <Link to='/login' className='text-blue-500 hover:text-blue-600'>
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UserCreationPage
