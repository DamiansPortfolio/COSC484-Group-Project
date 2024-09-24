// App.jsx
import React from 'react';
import ArtistProfile from './pages/ArtistProfile';
import PageLayout from './components/PageLayout';

const mockArtistData = {
  name: "Jane Doe",
  title: "3D Character Artist | Game Developer",
  location: "Los Angeles, CA",
  memberSince: "2024",
  avatarUrl: "/path/to/avatar.jpg",
  skills: ["3D Modeling", "Texturing", "Rigging"],
  portfolioItems: [
    { imageUrl: "/path/to/image1.jpg", title: "Character Model 1" },
    { imageUrl: "/path/to/image2.jpg", title: "Environment Asset" },
    { imageUrl: "/path/to/image3.jpg", title: "Animation Reel" },
  ],
  rating: 4.8,
  reviewCount: 69
};

function App() {
  return (
    <PageLayout>
      <ArtistProfile artistData={mockArtistData} />
    </PageLayout>
  );
}

export default App;