// PortfolioGallery.jsx
import { Card, CardContent } from "@/components/ui/card";

const PortfolioGallery = ({ portfolioItems }) => {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {portfolioItems.map((item, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                            {/* Removed items-center because it looks better */}
                            <div className="flex justify-center bg--200 h-48 w-full">
                                {/* Use object-contain to preserve the image's aspect ratio */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="object-contain max-h-full max-w-full"  // Ensures the image is fully visible
                                />
                            </div>
                            <p className="p-2 text-sm font-medium">{item.title}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PortfolioGallery;
