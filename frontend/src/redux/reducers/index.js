import { combineReducers } from "redux";
import userReducer from "./userReducer";
import recommendationsReducer from "./recommendationsReducer";
import messageReducer from "./messageReducer";

const rootReducer = combineReducers({
  user: userReducer,
  recommendations: recommendationsReducer,
  messages: messageReducer,
});

export default rootReducer;
