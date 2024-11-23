import axios from "axios"
import CryptoJS from "crypto-js"
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  CHECK_AUTH_REQUEST,
  CHECK_AUTH_SUCCESS,
  CHECK_AUTH_FAIL,
} from "../constants/userConstants"

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://5wdp70pq50.execute-api.us-east-1.amazonaws.com/dev/",
})

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

const setUserData = (user) => {
  const encryptedUser = encryptData(user)
  localStorage.setItem("encryptedUser", encryptedUser)
}

const getUserData = () => {
  const encryptedUser = localStorage.getItem("encryptedUser")
  return encryptedUser ? decryptData(encryptedUser) : null
}

const clearUserData = () => {
  localStorage.removeItem("encryptedUser")
  localStorage.removeItem("token")
}

export const loginUser = (userData) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST })
  try {
    const { data } = await api.post("api/users/login", userData)
    dispatch({ type: USER_LOGIN_SUCCESS, payload: { user: data.user } })
    setUserData(data.user)
    localStorage.setItem("token", data.token)
    return { success: true, data }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed"
    dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage })
    return { success: false, error: errorMessage }
  }
}

export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST })
  try {
    const { data } = await api.post("api/users/register", userData)
    dispatch({ type: USER_REGISTER_SUCCESS, payload: { user: data.user } })
    setUserData(data.user)
    localStorage.setItem("token", data.token)
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
    await api.post("api/users/logout")
  } catch (error) {
    console.warn("Logout backend call failed:", error)
  } finally {
    clearUserData()
    dispatch({ type: USER_LOGOUT })
  }
}

export const checkAuthStatus = () => async (dispatch) => {
  dispatch({ type: CHECK_AUTH_REQUEST })
  const storedUser = getUserData()
  const token = localStorage.getItem("token")
  if (storedUser && token) {
    dispatch({ type: CHECK_AUTH_SUCCESS, payload: { user: storedUser } })
    return true
  } else {
    dispatch({ type: CHECK_AUTH_FAIL })
    return false
  }
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      clearUserData()
    }
    return Promise.reject(error)
  }
)

export const isAuthenticated = () => {
  const user = getUserData()
  const token = localStorage.getItem("token")
  return !!(user && token)
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export { api, getUserData }
