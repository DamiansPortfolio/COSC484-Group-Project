import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import ProfileHeader from "../components/artist_profile/ProfileHeader"
import SkillsList from "../components/artist_profile/SkillsList"
import PortfolioGallery from "../components/artist_profile/PortfolioGallery"
import ReviewsSection from "../components/artist_profile/ReviewsSection"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton component
const ProfileSkeleton = () => (
  <div className='space-y-6 p-8'>
    <div className='space-y-4'>
      <Skeleton className='h-12 w-[250px]' />
      <Skeleton className='h-4 w-[200px]' />
      <Skeleton className='h-4 w-[150px]' />
    </div>
    <Skeleton className='h-32 w-full' />
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {[1, 2, 3].map((n) => (
        <Skeleton key={n} className='h-64 w-full' />
      ))}
    </div>
  </div>
)

const ArtistProfile = () => {
  const { id } = useParams()
  const [artistData, setArtistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const token = localStorage.getItem("token")

        const artistResponse = await fetch(
          `${import.meta.env.VITE_API_URL}api/artists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!artistResponse.ok) {
          throw new Error("Artist not found")
        }
        const artist = await artistResponse.json()

        // Process portfolio items
        const processedPortfolioItems = artist.portfolioItems.map((item) => ({
          ...item,
          category: item.category || "Other",
          createdAt: new Date(item.createdAt).toISOString(),
        }))

        // Get unique categories
        const categories = [
          ...new Set(processedPortfolioItems.map((item) => item.category)),
        ]

        setArtistData({
          ...artist,
          name: artist.userId?.name,
          username: artist.userId?.username,
          avatarUrl: artist.userId?.avatarUrl,
          location: artist.userId?.location,
          portfolioItems: processedPortfolioItems,
          categories,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArtistData()
  }, [id])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh]'>
        <h1 className='text-3xl font-bold mb-4'>Artist Not Found</h1>
        <p className='text-gray-600 mb-8'>{error}</p>
        <Link
          to='/'
          className='text-blue-500 hover:underline hover:text-blue-600 transition-colors'
        >
          Go back to Dashboard
        </Link>
      </div>
    )
  }

  const filteredPortfolioItems = artistData.portfolioItems
    .filter((item) => (showFeaturedOnly ? item.featured : true))
    .filter((item) =>
      activeCategory === "all" ? true : item.category === activeCategory
    )

  return (
    <div className='space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <ProfileHeader
        name={artistData.name}
        title={artistData.title || "Artist"}
        location={artistData.location}
        memberSince={new Date(artistData.createdAt).toLocaleDateString()}
        avatarUrl={artistData.avatarUrl}
        bio={artistData.bio}
        socialLinks={artistData.socialLinks}
      />

      <SkillsList skills={artistData.skills || []} />

      <div className='flex items-center justify-between mb-4'>
        <div className='flex gap-2'>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className='rounded-md border border-gray-300 p-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>All Categories</option>
            {artistData.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={showFeaturedOnly}
            onChange={(e) => setShowFeaturedOnly(e.target.checked)}
            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <span className='text-gray-700'>Show Featured Only</span>
        </label>
      </div>

      <PortfolioGallery
        portfolioItems={filteredPortfolioItems}
        showFeaturedOnly={showFeaturedOnly}
      />

      <ReviewsSection
        rating={artistData.averageRating}
        reviewCount={artistData.reviews?.length || 0}
        reviews={artistData.reviews || []}
      />
    </div>
  )
}

export default ArtistProfile
