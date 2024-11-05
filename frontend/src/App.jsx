import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { useSelector } from "react-redux"
import store, { persistor } from "./redux/store"
import ArtistProfile from "./pages/ArtistProfile"
import UserCreationPage from "./pages/UserCreationPage"
import Dashboard from "./pages/Dashboard"
import Login from "./components/Login"
import PageLayout from "./components/PageLayout"
import WelcomePage from "./pages/WelcomePage"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user)

  if (!isAuthenticated) {
    // Redirect them to login page if not authenticated
    return <Navigate to='/login' replace />
  }

  return children
}

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user)

  if (isAuthenticated) {
    // Redirect to dashboard if user is already logged in
    return <Navigate to='/dashboard' replace />
  }

  return children
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            {/* Public Routes */}
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

            {/* Protected Routes */}
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

            {/* Catch all route */}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
