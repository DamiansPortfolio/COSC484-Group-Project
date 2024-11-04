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
// In userActions.js
// In userActions.js
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST })

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      )

      const data = await response.json()
      console.log("Server response:", data)

      // Check for error responses
      if (!response.ok) {
        const errorMessage = data.message || data.error || "Registration failed"
        console.error("Server error:", errorMessage)
        throw new Error(errorMessage)
      }

      // Validate response structure
      if (!data.user) {
        console.error("Invalid server response:", data)
        throw new Error("Invalid response from server")
      }

      // Handle successful registration
      const { user, token } = data

      // Dispatch success actions
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: { user, token },
      })

      // Auto login after registration
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: { user, token },
      })

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(user))
      if (token) {
        localStorage.setItem("token", token)
      }

      return { success: true, data } // Return success result
    } catch (error) {
      console.error("Registration error:", error)

      // Dispatch failure action with error message
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.message,
      })

      // Return error result
      return { success: false, error: error.message }
    }
  }
}

// Login user action
export const loginUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST })
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Login error response:", errorData)
        throw new Error(errorData.message || "Failed to log in user")
      }

      const data = await response.json()

      const { user, token } = data

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
