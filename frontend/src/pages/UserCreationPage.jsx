// UserCreationPage.jsx
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../redux/actions/userActions"
import toast from "react-hot-toast"
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

const UserCreationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "requester",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, isAuthenticated } = useSelector((state) => state.user)

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

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasMinLength = password.length >= 8

    const errors = []
    if (!hasMinLength)
      errors.push("Password must be at least 8 characters long")
    if (!hasNumber) errors.push("Password must contain at least one number")
    if (!hasSpecial) errors.push("Password must contain a special character")

    return errors
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error("Username is required")
      return false
    }
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return false
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address")
      return false
    }

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length > 0) {
      passwordErrors.forEach((error) => toast.error(error))
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const result = await dispatch(registerUser(formData))
      if (result.success) {
        toast.success("Account created successfully! Welcome aboard!")
        navigate("/dashboard")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || ""
      if (errorMessage.includes("email already exists")) {
        toast.error("This email is already registered")
        setFormData((prev) => ({ ...prev, email: "" }))
      } else if (errorMessage.includes("username already exists")) {
        toast.error("This username is already taken")
        setFormData((prev) => ({ ...prev, username: "" }))
      } else if (error.response?.status === 429) {
        toast.error("Too many registration attempts. Please try again later.")
      } else {
        toast.error("Registration failed. Please try again.")
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
