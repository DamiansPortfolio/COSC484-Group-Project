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
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200"></div>
                            <p className="p-2 text-sm font-medium">{item.title}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PortfolioGallery;