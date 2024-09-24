// PortfolioGallery.jsx
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const PortfolioGallery = ({ portfolioItems }) => {
    return (
        <Card className="portfolio-gallery">
            <CardHeader>
                <h2 className="text-xl font-semibold">Portfolio</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolioItems.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                        <AspectRatio ratio={16 / 9}>
                            <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
                        </AspectRatio>
                        <CardContent className="p-2">
                            <p className="text-sm font-medium">{item.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};

export default PortfolioGallery;