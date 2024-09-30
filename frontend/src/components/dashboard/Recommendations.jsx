import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';

const Recommendations = () => {
  const [artists, setArtists] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      let url = `http://localhost:5001/api/artists?`;  // Use full backend URL with port

      if (selectedSkill) {
        url += `skill=${selectedSkill}&`;
      }
      if (sortOption) {
        url += `sort=${sortOption}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);  // Log the data for debugging
      setArtists(data);
    };

    fetchArtists();
  }, [selectedSkill, sortOption]);



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
            {artists.map((artist) => (
              <Card key={artist.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    <Link to={`/profile/${artist.id}`}>
                      {artist.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">{artist.skills.join(', ')}</p>
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
