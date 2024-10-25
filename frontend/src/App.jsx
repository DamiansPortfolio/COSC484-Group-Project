import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ArtistProfile from "./pages/ArtistProfile"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/profile/:id' element={<ArtistProfile />} />
      </Routes>
    </Router>
  )
}

export default App
