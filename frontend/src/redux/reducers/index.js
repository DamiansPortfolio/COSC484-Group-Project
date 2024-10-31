import { combineReducers } from "redux"
import userReducer from "./userReducer" // Import your user reducer

const rootReducer = combineReducers({
  user: userReducer, // Add other reducers here
})

export default rootReducer
