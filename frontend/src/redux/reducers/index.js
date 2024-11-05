// reducers/index.js
import { combineReducers } from "redux"
import userReducer from "./userReducer"
import recommendationsReducer from "./recommendationsReducer"

const appReducer = combineReducers({
  user: userReducer,
  recommendations: recommendationsReducer,
})

// Reset all state when user logs out
const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer
