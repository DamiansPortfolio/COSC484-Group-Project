import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import ProfileHeader from "../components/artist_profile/ProfileHeader"
import SkillsList from "../components/artist_profile/SkillsList"
import PortfolioGallery from "../components/artist_profile/PortfolioGallery"
import ReviewsSection from "../components/artist_profile/ReviewsSection"

const ArtistProfile = () => {
  const { id } = useParams()
  const [artistData, setArtistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const artistResponse = await fetch(`/api/artists/${id}`)
        if (!artistResponse.ok) {
          throw new Error("Artist not found")
        }
        const artist = await artistResponse.json()

        const userResponse = await fetch(`/api/users/${artist.userId}`)
        if (!userResponse.ok) {
          throw new Error("User not found")
        }
        const user = await userResponse.json()

        setArtistData({
          ...artist,
          ...user,
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
    return (
      <div className='flex items-center justify-center p-8'>Loading...</div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Artist Not Found</h1>
        <p className='text-gray-600 mb-8'>{error}</p>
        <Link to='/' className='text-blue-500 hover:underline'>
          Go back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-8'>
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
        reviewCount={artistData.reviews?.length || 0}
      />
    </div>
  )
}

export default ArtistProfile
