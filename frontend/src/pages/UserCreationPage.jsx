import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" // Add this import
import { registerUser } from "../redux/actions/userActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select" // Import the Select components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert" // Import Alert if you have it set up

function UserCreationPage() {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("requester") // Default role
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.user) // Access loading and error from Redux state

  React.useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = {
      username,
      name,
      email,
      password, // Send the plain password to be hashed on the backend
      role,
    }
    dispatch(registerUser(userData)) // Dispatch registerUser action
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md p-6'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Create User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='mb-4'
            />
            <Input
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='mb-4'
            />
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='mb-4'
            />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='mb-4'
            />
            <Select value={role} onValueChange={setRole} className='mb-6'>
              {" "}
              {/* Increased margin-bottom here */}
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
              className='bg-blue-500 text-white hover:bg-blue-600 transition duration-200 mt-5' // Added margin-top here
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            {error && (
              <Alert className='mt-4' type='error'>
                {error}
              </Alert>
            )}{" "}
            {/* Show error message */}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserCreationPage
