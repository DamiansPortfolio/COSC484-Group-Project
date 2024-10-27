import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../constants/userConstants"

// Check local storage for user data on app start
const userFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null

const initialState = {
  user: userFromLocalStorage, // Set initial user state from local storage
  loading: false,
  error: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null } // Set loading to true on request
    case USER_REGISTER_SUCCESS:
    case USER_LOGIN_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.payload.user)) // Save user data to local storage
      localStorage.setItem("token", action.payload.token) // Save token to local storage
      return { ...state, user: action.payload.user, loading: false } // Store the registered or logged-in user
    case USER_REGISTER_FAIL:
    case USER_LOGIN_FAIL:
      return { ...state, error: action.payload, loading: false } // Store the error message
    case USER_LOGOUT:
      localStorage.removeItem("user") // Clear user data from local storage
      localStorage.removeItem("token") // Clear token from local storage
      return { ...initialState, user: null } // Reset user state on logout
    default:
      return state // Return the current state for unknown actions
  }
}

export default userReducer
