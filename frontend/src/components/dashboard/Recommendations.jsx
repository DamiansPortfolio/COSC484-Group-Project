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

const ArtistCard = ({ artist }) => (
  <Card key={artist._id}>
    <CardContent className='p-4'>
      <h3 className='font-semibold mb-2'>
        <Link to={`/profile/${artist.userId._id}`}>
          {artist.userId?.name || "Unknown Artist"}
        </Link>
      </h3>
      <p className='text-sm text-gray-600'>
        Primary Skills:{" "}
        {artist.skills?.primary?.map((skill) => skill.name).join(", ") ||
          "No skills listed"}
      </p>
      {artist.skills?.secondary?.length > 0 && (
        <p className='text-sm text-gray-500'>
          Secondary: {artist.skills.secondary.join(", ")}
        </p>
      )}
      <p className='text-sm text-yellow-500'>
        Rating: {artist.averageRating?.toFixed(1) || "0.0"} ★
      </p>
      {artist.userId?.location && (
        <p className='text-sm text-gray-500'>{artist.userId.location}</p>
      )}
    </CardContent>
  </Card>
)

const LoadingSkeleton = () => (
  <div className='grid grid-cols-2 gap-4'>
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
  const { artists, loading, selectedSkill, sortOption } = useSelector(
    (state) => state.recommendations
  )

  useEffect(() => {
    dispatch(fetchRecommendations())
  }, [dispatch])

  // Get unique primary skills from all artists
  const getAllPrimarySkills = () => {
    return [
      ...new Set(
        artists.flatMap(
          (artist) => artist.skills?.primary?.map((skill) => skill.name) || []
        )
      ),
    ]
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent className='mb-4'>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>

      <CardContent className='mb-4'>
        <div className='flex space-x-4 mb-4'>
          <DropdownMenu>
            <DropdownMenuTrigger className='p-2 bg-gray-200 rounded-md'>
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
            <DropdownMenuTrigger className='p-2 bg-gray-200 rounded-md'>
              Sort By
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => dispatch(setSortOption("name"))}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => dispatch(setSortOption("rating"))}
              >
                Rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ScrollArea className='h-80'>
          <CardContent className='grid grid-cols-2 gap-4'>
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
          </CardContent>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Recommendations
