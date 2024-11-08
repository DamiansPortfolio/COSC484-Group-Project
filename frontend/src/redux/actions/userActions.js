// actions/userActions.js
import axios from "axios"
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REFRESH_TOKEN_SUCCESS,
} from "../constants/userConstants"

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Register user action
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST })

    console.log("Registering user with data:", userData) // Debugging log

    try {
      const { data } = await api.post("/users/register", userData)

      console.log("Registration successful:", data) // Debugging log

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: { user: data.user },
      })

      return { success: true, data }
    } catch (error) {
      console.error("Registration error:", error) // Debugging log
      const message = error.response?.data?.message || error.message
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: message,
      })
      return { success: false, error: message }
    }
  }
}

// Login user action
export const loginUser = (userData) => {
  return async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST })

    console.log("Logging in user with data:", userData) // Debugging log

    try {
      const { data } = await api.post("/users/login", userData)

      console.log("Login successful:", data) // Debugging log

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: { user: data.user },
      })
    } catch (error) {
      console.error("Login error:", error) // Debugging log
      const message = error.response?.data?.message || error.message
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: message,
      })
    }
  }
}

// Logout user action
export const logoutUser = () => {
  return async (dispatch) => {
    try {
      await api.post("/users/logout")
      dispatch({ type: USER_LOGOUT })
      console.log("User logged out successfully") // Debugging log
    } catch (error) {
      console.error("Logout error:", error) // Debugging log
      // Still logout the user on the frontend even if the backend call fails
      dispatch({ type: USER_LOGOUT })
    }
  }
}

// Refresh token action
export const refreshToken = () => {
  return async (dispatch) => {
    try {
      const { data } = await api.post("/users/refresh-token")
      dispatch({
        type: USER_REFRESH_TOKEN_SUCCESS,
        payload: { user: data.user },
      })
      console.log("Token refreshed successfully:", data) // Debugging log
      return true
    } catch (error) {
      console.error("Token refresh error:", error) // Debugging log
      dispatch({ type: USER_LOGOUT })
      return false
    }
  }
}

// Axios response interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    console.log("API response:", response) // Debugging log
    return response
  },
  async (error) => {
    console.error("API error:", error) // Debugging log
    const originalRequest = error.config

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh the token
        const refreshed = await store.dispatch(refreshToken())
        if (refreshed) {
          // Retry the original request
          console.log("Retrying original request after token refresh") // Debugging log
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError) // Debugging log
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export { api }
