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
