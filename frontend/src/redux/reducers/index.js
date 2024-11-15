import { combineReducers } from "redux"
import userReducer from "./userReducer"
import recommendationsReducer from "./recommendationsReducer"

const rootReducer = combineReducers({
  user: userReducer,
  recommendations: recommendationsReducer,
})

export default rootReducer
