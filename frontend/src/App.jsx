import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import { Provider } from "react-redux"
import store from "./redux/store"
import ArtistProfile from "./pages/ArtistProfile"
import UserCreationPage from "./pages/UserCreationPage"
import Dashboard from "./pages/Dashboard"
import Login from "./components/Login"
import PageLayout from "./components/PageLayout"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              <PageLayout>
                <Dashboard />
              </PageLayout>
            }
          />
          <Route
            path='/profile/:id'
            element={
              <PageLayout>
                <ArtistProfile />
              </PageLayout>
            }
          />
          <Route
            path='/register'
            element={
              <PageLayout>
                <UserCreationPage />
              </PageLayout>
            }
          />
          <Route
            path='/login'
            element={
              <PageLayout>
                <Login />
              </PageLayout>
            }
          />
          {/* Optional: Redirect any unmatched route to the root */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
