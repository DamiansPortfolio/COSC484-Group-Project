import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"

function UserCreationPage() {
  // Form state
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("requester")
  const [formError, setFormError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.user)

  // Only redirect if we have a user and no errors
  React.useEffect(() => {
    if (user && !error && !formError) {
      navigate("/dashboard")
    }
  }, [user, error, formError, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("") // Clear any previous errors

    // Basic form validation
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long")
      return
    }

    try {
      const userData = {
        username,
        name,
        email,
        password,
        role,
      }

      // Dispatch registration action
      const result = await dispatch(registerUser(userData))

      // Check if registration was successful
      if (result.error) {
        throw new Error(result.error)
      }

      // Registration successful - useEffect will handle navigation
      console.log("Registration successful")
    } catch (error) {
      console.error("Registration error:", error)
      setFormError(error.message || "Registration failed")

      // Clear form on certain errors
      if (error.message.includes("already registered")) {
        if (error.message.includes("email")) {
          setEmail("")
        } else if (error.message.includes("username")) {
          setUsername("")
        }
      }
    }
  }

  // Determine what error message to show
  const displayError = formError || error

  return (
    <div className='flex justify-center py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Create User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                required
                disabled={loading}
                className={error?.includes("username") ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Input
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                disabled={loading}
                className={error?.includes("email") ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
                className={
                  formError?.includes("Password") ? "border-red-500" : ""
                }
              />
            </div>
            <div>
              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='requester'>Requester</SelectItem>
                  <SelectItem value='artist'>Artist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 disabled:bg-blue-300'
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {displayError && (
              <Alert variant='destructive' className='animate-shake'>
                {displayError}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserCreationPage
