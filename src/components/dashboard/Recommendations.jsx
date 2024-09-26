import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Recommendations = () => {
  const recommendations = [
    { title: 'Job: UI Designer for Mobile Game', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { title: 'Artist: Jane Smith - 3D Modeler', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {recommendations.map((recommendation, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{recommendation.title}</h3>
              <p className="text-sm text-gray-600">{recommendation.description}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Recommendations;
