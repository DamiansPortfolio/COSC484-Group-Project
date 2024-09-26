// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArtistProfile from './pages/ArtistProfile';
import Dashboard from './pages/Dashboard';
import artistData from './artistData';  // Import the artist data

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile/:id" element={<ArtistProfile artistData={artistData} />} />
      </Routes>
    </Router>
  );
}

export default App;
