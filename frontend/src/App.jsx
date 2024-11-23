import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import { Provider, useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import store from "./redux/store"
import { checkAuthStatus } from "./redux/actions/userActions"
import ArtistProfile from "./pages/ArtistProfile"
import UserCreationPage from "./pages/UserCreationPage"
import Dashboard from "./pages/Dashboard"
import Login from "./components/Login"
import PageLayout from "./components/PageLayout"
import WelcomePage from "./pages/WelcomePage"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to='/login' replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Navigate to='/dashboard' replace /> : children
}

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(checkAuthStatus()) // Always dispatch checkAuthStatus
      setIsChecking(false)
    }

    initAuth()
  }, [dispatch])

  if (isChecking) {
    return <div>Loading...</div>
  }

  return children
}

const App = () => {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <Router>
          <Routes>
            <Route path='/' element={<ProtectedOrPublic />} />
            <Route
              path='/welcome'
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
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
      </AuthWrapper>
    </Provider>
  )
}

const ProtectedOrPublic = () => {
  const { isAuthenticated } = useSelector((state) => state.user)
  return <Navigate to={isAuthenticated ? "/dashboard" : "/welcome"} replace />
}

export default App
