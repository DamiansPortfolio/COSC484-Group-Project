# Project Structure for `/Users/ivang/Documents/GitHub/COSC484-Group-Project`
├── COSC484-Group-Project/
│   index.html
│   tailwind.config.js
│   tsconfig.app.json
│   vite.config.js
│   package.json
│   components.json
│   tsconfig.json
│   eslint.config.js
└── postcss.config.js
│   ├── .git/
│   │   ├── objects/
│   │   ├── refs/
│   │   │   ├── remotes/
│   ├── .vscode/
│   └── settings.json
│   ├── src/
│   │   artistData.js
│   │   index.css
│   │   main.jsx
│   └── App.jsx
│   │   ├── components/
│   │   │   Sidebar.jsx
│   │   │   PageLayout.jsx
│   │   └── PageHeader.jsx
│   │   │   ├── artist_profile/
│   │   │   │   ProfileHeader.jsx
│   │   │   │   PortfolioGallery.jsx
│   │   │   │   SkillsList.jsx
│   │   │   └── ReviewsSection.jsx
│   │   │   ├── dashboard/
│   │   │   │   Recommendations.jsx
│   │   │   │   QuickStats.jsx
│   │   │   └── RecentActivity.jsx
│   │   ├── pages/
│   │   │   Dashboard.jsx
│   │   └── ArtistProfile.jsx

# File Content

## package.json
Path: `package.json`

```json
{
  "name": "cosc484-group-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.445.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.12",
    "vite": "^5.4.1"
  }
}

```

----------------------------------------
## Recommendations.jsx
Path: `src/components/dashboard/Recommendations.jsx`

```javascript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import artistData from '../../artistData';

const Recommendations = () => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Function to handle filtering by skill
  const filterBySkill = (artists) => {
    if (selectedSkill === '') return artists;
    return artists.filter(artist => artist.skills.includes(selectedSkill));
  };

  // Function to handle sorting by name or rating
  const sortArtists = (artists) => {
    if (sortOption === 'name') {
      return [...artists].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortOption === 'rating') {
      return [...artists].sort((a, b) => b.rating - a.rating);
    }
    return artists;
  };

  const displayedArtists = sortArtists(filterBySkill(artistData));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>

      <CardContent className="mb-4">
        <div className="flex space-x-4 mb-4">
          {/* Dropdown for Filtering by Skill */}
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 bg-gray-200 rounded-md">Filter by Skill</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedSkill('')}>All Skills</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSkill('3D Modeling')}>3D Modeling</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSkill('Texturing')}>Texturing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSkill('Illustration')}>Illustration</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSkill('Character Design')}>Character Design</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown for Sorting */}
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 bg-gray-200 rounded-md">Sort By</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption('name')}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('rating')}>Rating</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Scrollable area for artist cards */}
        <ScrollArea className="h-80">
          <CardContent className="grid grid-cols-2 gap-4">
            {displayedArtists.map((artist) => (
              <Card key={artist.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link to={`/profile/${artist.id}`}>
                      {artist.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">{artist.name}</p>
                  {/* Show artist rating */}
                  <p className="text-sm text-yellow-500">Rating: {artist.rating} ★</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Recommendations;

```

----------------------------------------
