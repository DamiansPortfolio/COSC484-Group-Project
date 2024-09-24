
// Reviews.jsx
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const Reviews = ({ rating, reviewCount }) => {
    return (
        <Card className="reviews">
            <CardHeader>
                <h2 className="text-xl font-semibold">Reviews</h2>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
                <Star className="text-yellow-400" />
                <span className="text-lg font-medium">{rating}/5</span>
                <span className="text-sm text-gray-500">based on {reviewCount} reviews</span>
            </CardContent>
        </Card>
    );
};

export default Reviews;
