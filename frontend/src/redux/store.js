import { configureStore } from "@reduxjs/toolkit" // Import configureStore from Redux Toolkit
import { Provider } from "react-redux"
import rootReducer from "./reducers" // Import your root reducer

const store = configureStore({
  reducer: rootReducer, // Set your root reducer
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Use the default middleware (includes thunk)
})

export default store
