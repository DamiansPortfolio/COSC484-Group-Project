import { Card, CardContent } from "@/components/ui/card"

const ReviewsSection = ({ rating, reviewCount }) => {
  return (
    <Card>
      <CardContent className='p-6'>
        <h2 className='text-xl font-semibold'>Reviews</h2>
        <p>
          {rating}/5 based on {reviewCount} reviews
        </p>
      </CardContent>
    </Card>
  )
}

export default ReviewsSection
