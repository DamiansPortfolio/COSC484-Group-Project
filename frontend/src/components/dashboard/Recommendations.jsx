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

const Recommendations = () => {
  const dispatch = useDispatch()
  const { artists, loading, selectedSkill, sortOption } = useSelector(
    (state) => state.recommendations
  )

  useEffect(() => {
    dispatch(fetchRecommendations())
  }, [dispatch])

  if (loading) {
    return <p>Loading artists...</p>
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
              <DropdownMenuItem
                onClick={() => dispatch(setSelectedSkill("3D Modeling"))}
              >
                3D Modeling
              </DropdownMenuItem>
              {/* ... other skill options ... */}
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
                selectedSkill ? artist.skills.includes(selectedSkill) : true
              )
              .sort((a, b) => {
                if (sortOption === "name") return a.name.localeCompare(b.name)
                if (sortOption === "rating")
                  return b.averageRating - a.averageRating
                return 0
              })
              .map((artist) => (
                <Card key={artist._id}>
                  <CardContent className='p-4'>
                    <h3 className='font-semibold mb-2'>
                      <Link to={`/profile/${artist.userId}`}>
                        {" "}
                        {artist.name}
                      </Link>
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {artist.skills.join(", ")}
                    </p>
                    <p className='text-sm text-yellow-500'>
                      Rating: {artist.averageRating} ★
                    </p>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Recommendations
