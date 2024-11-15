import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchRecommendations,
  setSelectedSkill,
  setSortOption,
} from "../../redux/actions/recommendationsActions"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { ScrollArea } from "../../components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const ArtistCard = ({ artist }) => (
  <Card key={artist._id} className='hover:shadow-lg transition-shadow'>
    <CardContent className='p-4'>
      <h3 className='font-semibold mb-2'>
        <Link
          to={`/profile/${artist.userId._id}`}
          className='hover:text-blue-600'
        >
          {artist.userId?.name || "Unknown Artist"}
        </Link>
      </h3>
      <div className='space-y-2'>
        <p className='text-sm text-gray-600'>
          Primary Skills:{" "}
          {artist.skills?.primary?.map((skill) => (
            <Badge key={skill.name} variant='outline' className='mr-1'>
              {skill.name}
            </Badge>
          ))}
        </p>
        <p className='text-sm text-yellow-500 flex items-center'>
          <span className='mr-1'>Rating:</span>
          <span className='font-medium'>
            {artist.averageRating?.toFixed(1) || "N/A"}
          </span>
          <span className='ml-1'>★</span>
        </p>
        {artist.userId?.location && (
          <p className='text-sm text-gray-500'>{artist.userId.location}</p>
        )}
      </div>
    </CardContent>
  </Card>
)

const LoadingSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    {[1, 2, 3, 4].map((n) => (
      <Card key={n}>
        <CardContent className='p-4'>
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-4 w-1/2 mb-2' />
          <Skeleton className='h-4 w-1/4' />
        </CardContent>
      </Card>
    ))}
  </div>
)

const Recommendations = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const {
    artists = [],
    loading,
    selectedSkill,
    sortOption,
  } = useSelector((state) => state.recommendations)

  useEffect(() => {
    dispatch(fetchRecommendations())
  }, [dispatch])

  // Add default empty array and null checks
  const getAllPrimarySkills = () => {
    if (!artists || artists.length === 0) return []

    return [
      ...new Set(
        artists.flatMap(
          (artist) => artist?.skills?.primary?.map((skill) => skill?.name) || []
        )
      ),
    ].filter(Boolean) // Remove any undefined/null values
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Artists</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  // Add check for empty artists array
  if (!artists || artists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Artists</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-center text-gray-500'>No artists found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Artists</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex space-x-4 mb-4'>
          <DropdownMenu>
            <DropdownMenuTrigger className='p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
              Filter by Skill
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => dispatch(setSelectedSkill(""))}>
                All Skills
              </DropdownMenuItem>
              {getAllPrimarySkills().map((skill) => (
                <DropdownMenuItem
                  key={skill}
                  onClick={() => dispatch(setSelectedSkill(skill))}
                >
                  {skill}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className='p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
              Sort By
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => dispatch(setSortOption("rating"))}
              >
                Rating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setSortOption("name"))}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ScrollArea className='h-[calc(100vh-300px)]'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-1'>
            {artists
              .filter((artist) =>
                selectedSkill
                  ? artist.skills?.primary?.some(
                      (skill) => skill.name === selectedSkill
                    )
                  : true
              )
              .sort((a, b) => {
                if (sortOption === "name") {
                  return (a.userId?.name || "").localeCompare(
                    b.userId?.name || ""
                  )
                }
                if (sortOption === "rating") {
                  return (b.averageRating || 0) - (a.averageRating || 0)
                }
                return 0
              })
              .map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Recommendations
