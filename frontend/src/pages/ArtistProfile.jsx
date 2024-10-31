import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import ProfileHeader from "../components/artist_profile/ProfileHeader"
import SkillsList from "../components/artist_profile/SkillsList"
import PortfolioGallery from "../components/artist_profile/PortfolioGallery"
import ReviewsSection from "../components/artist_profile/ReviewsSection"
import PageLayout from "../components/PageLayout"

const ArtistProfile = () => {
  const { id } = useParams() // Assuming id is the artist's ID from artist_profiles
  const [artistData, setArtistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Fetch the artist profile based on the provided id
        const artistResponse = await fetch(`/api/artists/${id}`)
        if (!artistResponse.ok) {
          throw new Error("Artist not found")
        }
        const artist = await artistResponse.json()

        // Use the userId from the artist data to fetch user data
        // Make sure to convert artist.userId to string if necessary
        const userResponse = await fetch(`/api/users/${artist.userId}`)
        if (!userResponse.ok) {
          throw new Error("User not found")
        }
        const user = await userResponse.json()

        // Combine user and artist data
        const combinedData = {
          ...artist,
          ...user,
        }

        setArtistData(combinedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArtistData()
  }, [id]) // Ensure you are passing the artist ID, which maps to userId in the artist profile

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <PageLayout>
        <div className='flex flex-col items-center justify-center h-screen text-center'>
          <h1 className='text-3xl font-bold mb-4'>Artist Not Found</h1>
          <p className='text-gray-600 mb-8'>{error}</p>
          <Link to='/' className='text-blue-500 underline'>
            Go back to Dashboard
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className='space-y-6'>
        <ProfileHeader
          name={artistData.name}
          title={artistData.title || "Artist"}
          location={artistData.location}
          memberSince={new Date(artistData.createdAt).toLocaleDateString()}
          avatarUrl={artistData.avatarUrl}
        />
        <SkillsList skills={artistData.skills || []} />
        <PortfolioGallery portfolioItems={artistData.portfolioItems || []} />
        <ReviewsSection
          rating={artistData.averageRating}
          reviewCount={artistData.reviews.length || 0}
        />
      </div>
    </PageLayout>
  )
}

export default ArtistProfile
