// actions/userActions.js
/**
 * User authentication actions and API configuration
 * Handles login, registration, and logout operations
 */
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
} from "../constants/userConstants"

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://91eaa3ocob.execute-api.us-east-1.amazonaws.com/Prod",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

export const loginUser = (userData) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST })
  try {
    const { data } = await api.post("/api/users/login", userData)
    if (data.user) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: { user: data.user } })
      return { success: true, data }
    }
    throw new Error(data.message || "Login failed")
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Invalid username or password"
    dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage })
    return { success: false, error: errorMessage }
  }
}

export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST })
  try {
    const { data } = await api.post("/api/users/register", userData)
    dispatch({ type: USER_REGISTER_SUCCESS, payload: { user: data.user } })
    return { success: true, data }
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || "Registration failed",
    })
    throw error
  }
}

export const logoutUser = () => async (dispatch) => {
  try {
    await api.post("/api/users/logout")
  } catch (error) {
    console.warn("Logout backend call failed:", error)
  } finally {
    dispatch({ type: USER_LOGOUT })
  }
}

export { api }
