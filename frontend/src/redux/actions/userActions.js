import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../constants/userConstants"

// Register user action
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST })
    console.log("Registering user with data:", userData)
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Registration error response:", errorData)
        throw new Error("Failed to register user")
      }

      const data = await response.json()
      console.log("Registration response data:", data)
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data })

      // Automatically log in the user after registration
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    } catch (error) {
      console.error("Registration error:", error)
      dispatch({ type: USER_REGISTER_FAIL, payload: error.message })
    }
  }
}

// Login user action
export const loginUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST })
    console.log("Logging in user with data:", userData)
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Login error response:", errorData)
        throw new Error(errorData.message || "Failed to log in user")
      }

      const data = await response.json()
      console.log("Login response data:", data)

      const { user, token } = data
      console.log("Extracted user:", user)

      dispatch({ type: USER_LOGIN_SUCCESS, payload: { user, token } })
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)
    } catch (error) {
      console.error("Login error:", error)
      dispatch({ type: USER_LOGIN_FAIL, payload: error.message })
    }
  }
}

// Logout user action
export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem("user") // Clear user data from local storage
    localStorage.removeItem("token") // Clear token from local storage
    dispatch({ type: USER_LOGOUT }) // Dispatch logout action
  }
}
