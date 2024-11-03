import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../redux/actions/userActions"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(loginUser({ username, password }))
  }

  useEffect(() => {
    if (user && !error) {
      navigate("/")
    }
  }, [user, error, navigate])

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
            <div>
              <Input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
                required
              />
            </div>
            <div>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200'
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {error && <Alert variant='destructive'>{error}</Alert>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
