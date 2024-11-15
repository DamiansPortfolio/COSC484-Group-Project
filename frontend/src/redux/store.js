// store.js
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./reducers"

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
})

export default store
