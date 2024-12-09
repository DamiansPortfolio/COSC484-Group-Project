import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import { Provider, useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
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
import RequesterProfile from "./pages/RequesterProfile"
import MyApplications from "./pages/MyApplications"
import JobApplicationForm from "./pages/JobApplicationForm"
import PostJob from "./pages/PostJob"
import MyJobs from "./pages/MyJobs"
import JobStatus from "./pages/JobStatus"
import IndividualApplication from "./pages/IndividualApplication"

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

const ProfileRouter = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isArtist, setIsArtist] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/artists/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        setIsArtist(response.ok)
        setLoading(false)
      } catch (error) {
        setError("Failed to load profile")
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (loading) return <LoadingScreen />
  if (error) return <div>Error: {error}</div>

  return isArtist ? <ArtistProfile /> : <RequesterProfile />
}

const App = () => {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <Router>
          <Toaster
            position='top-right'
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4CAF50",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#f44336",
                  secondary: "#fff",
                },
              },
            }}
          />
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
                    <ProfileRouter />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/jobs'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <AvailableJobs />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/jobs/:jobId'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <IndividualJob />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/applications'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <MyApplications />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/jobs/:jobId/apply'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <JobApplicationForm />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/jobs/create'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <PostJob />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/jobs/my-posts'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <MyJobs />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/jobs/:jobId/status'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <JobStatus />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/applications/:applicationId'
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <IndividualApplication />
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
