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
import { Loader2 } from "lucide-react"
import AvailableJobs from "./pages/AvailableJobs"
import IndividualJob from "./pages/IndividualJob"

// Loading Screen Component
const LoadingScreen = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='flex flex-col items-center gap-4'>
      <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      <p className='text-gray-600'>Loading...</p>
    </div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  if (loading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? children : <Navigate to='/login' replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  if (loading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? <Navigate to='/dashboard' replace /> : children
}

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch()
  const [isChecking, setIsChecking] = useState(true)
  const { loading } = useSelector((state) => state.user)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkAuthStatus())
      } finally {
        setIsChecking(false)
      }
    }

    initAuth()
  }, [dispatch])

  if (isChecking || loading) {
    return <LoadingScreen />
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
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <AvailableJobs />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <IndividualJob />
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
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  if (loading) {
    return <LoadingScreen />
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/welcome"} replace />
}

export default App
