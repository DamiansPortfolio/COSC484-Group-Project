/**
 * Main application component
 * Handles routing, authentication, and layout management
 */
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import { Provider, useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import store from "./redux/store"
import ArtistProfile from "./pages/ArtistProfile"
import UserCreationPage from "./pages/UserCreationPage"
import Dashboard from "./pages/Dashboard"
import Login from "./components/Login"
import PageLayout from "./components/PageLayout"
import WelcomePage from "./pages/WelcomePage"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user)
  return isAuthenticated ? children : <Navigate to='/login' replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user)
  return isAuthenticated ? <Navigate to='/dashboard' replace /> : children
}

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/check-auth`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        )

        if (response.ok) {
          const { user } = await response.json()
          dispatch({ type: "USER_LOGIN_SUCCESS", payload: { user } })
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }
    checkAuth()
  }, [dispatch])

  return children
}

const App = () => {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <Router>
          <Routes>
            <Route
              path='/'
              element={
                <PageLayout>
                  <WelcomePage />
                </PageLayout>
              }
            />
            <Route
              path='/register'
              element={
                <PublicRoute>
                  <PageLayout>
                    <UserCreationPage />
                  </PageLayout>
                </PublicRoute>
              }
            />
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <PageLayout>
                    <Login />
                  </PageLayout>
                </PublicRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Dashboard />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/:id'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <ArtistProfile />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Router>
      </AuthWrapper>
    </Provider>
  )
}

export default App
