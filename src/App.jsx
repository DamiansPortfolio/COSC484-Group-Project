// App.jsx
import React from 'react';
import ArtistProfile from './pages/ArtistProfile';

// Mock data for testing
const mockArtistData = {
  name: "Jane Doe",
  title: "3D Character Artist | Game Developer",
  location: "Los Angeles, CA",
  memberSince: "2022",
  avatarUrl: "/path/to/avatar.jpg", // Replace with an actual path or use a placeholder
  skills: ["3D Modeling", "Texturing", "Rigging"],
  portfolioItems: [
    { imageUrl: "/path/to/image1.jpg", title: "Character Model 1" },
    { imageUrl: "/path/to/image2.jpg", title: "Environment Asset" },
    { imageUrl: "/path/to/image3.jpg", title: "Animation Reel" },
  ],
  rating: 4.8,
  reviewCount: 25
};

function App() {
  return (
    <div className="container mx-auto p-4">
      <ArtistProfile artistData={mockArtistData} />
    </div>
  );
}

export default App;