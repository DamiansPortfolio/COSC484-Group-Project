// reducers/userReducer.js
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

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case USER_REGISTER_SUCCESS:
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        isAuthenticated: true,
        error: null,
      }

    case USER_REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      }

    case USER_REGISTER_FAIL:
    case USER_LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
        isAuthenticated: false,
      }

    case USER_LOGOUT:
      return {
        ...initialState,
      }

    default:
      return state
  }
}

export default userReducer
