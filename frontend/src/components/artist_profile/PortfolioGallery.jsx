import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Import from shadcn/ui

const PortfolioItem = ({ item }) => (
  <div className='bg-gray-100 rounded-lg overflow-hidden group relative'>
    <div className='aspect-square bg-gray-200 flex items-center justify-center'>
      <img
        src={item.imageUrl}
        alt={item.title}
        className='object-contain w-full h-full p-2'
        loading='lazy'
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg"
          e.target.onerror = null
        }}
      />
      {item.featured && (
        <Badge
          className='absolute top-2 right-2 bg-yellow-500'
          variant='secondary'
        >
          Featured
        </Badge>
      )}
    </div>
    <div className='p-3 space-y-2'>
      <p className='font-medium truncate' title={item.title}>
        {item.title}
      </p>
      {item.description && (
        <p
          className='text-sm text-gray-600 line-clamp-2'
          title={item.description}
        >
          {item.description}
        </p>
      )}
      {item.category && (
        <Badge variant='outline' className='text-xs'>
          {item.category}
        </Badge>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {item.tags.map((tag) => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <p className='text-xs text-gray-500'>
        Added {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
)

const EmptyPortfolio = () => (
  <div className='text-center py-8 text-gray-500'>
    No portfolio items available
  </div>
)

const PortfolioGallery = ({
  portfolioItems = [],
  showFeaturedOnly = false,
}) => {
  const displayItems = showFeaturedOnly
    ? portfolioItems.filter((item) => item.featured)
    : portfolioItems

  // Group items by category
  const itemsByCategory = displayItems.reduce((acc, item) => {
    const category = item.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  if (!displayItems.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyPortfolio />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className='mb-6'>
            <h3 className='text-lg font-semibold mb-4'>{category}</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {items.map((item) => (
                <PortfolioItem key={item._id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PortfolioGallery
