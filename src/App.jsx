// App.jsx
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
    { imageUrl: "src/assets/example_character_model.webp", title: "Character Model 1" },
    { imageUrl: "src/assets/example_environment_asset.webp", title: "Environment Asset" },
    { imageUrl: "src/assets/example_animation_reel.gif", title: "Animation Reel" },
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