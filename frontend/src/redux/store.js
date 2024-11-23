import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./reducers"

const initialState = {
  user: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  recommendations: {
    artists: [],
    loading: false,
    error: null,
    selectedSkill: "",
    sortOption: "rating",
  },
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  preloadedState: initialState,
})

export default store
