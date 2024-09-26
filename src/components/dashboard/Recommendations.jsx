import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';  // Import Link from React Router
import artistData from '../../artistData';  // Import artist data

const Recommendations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {artistData.map((artist) => (
          <Card key={artist.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">
                <Link to={`/profile/${artist.id}`}>
                  {artist.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600">{artist.name}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Recommendations;
