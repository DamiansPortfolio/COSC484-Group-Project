// store.js
import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import rootReducer from "./reducers"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist user state
  blacklist: ["recommendations"], // Don't persist these states
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)
export default store
