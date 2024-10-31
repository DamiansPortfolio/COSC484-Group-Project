import React, { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

const Recommendations = () => {
  const [artists, setArtists] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState("")
  const [sortOption, setSortOption] = useState("")

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true) // Set loading to true
      try {
        const artistsResponse = await fetch(
          "http://localhost:5001/api/artists/"
        )
        if (!artistsResponse.ok) {
          throw new Error(
            `Error fetching artists: ${artistsResponse.statusText}`
          )
        }
        const artistsData = await artistsResponse.json()

        // Fetch users
        const usersResponse = await fetch("http://localhost:5001/api/users/")
        if (!usersResponse.ok) {
          throw new Error(`Error fetching users: ${usersResponse.statusText}`)
        }
        const usersData = await usersResponse.json()

        // Map artists to include user information
        const enrichedArtists = artistsData.map((artist) => {
          const user = usersData.find((user) => user._id === artist.userId)
          return {
            ...artist,
            name: user ? user.name : "Unknown Artist",
            username: user ? user.username : "Unknown",
          }
        })

        setArtists(enrichedArtists)
      } catch (error) {
        console.error("Failed to fetch artists or users:", error)
      } finally {
        setLoading(false) // Set loading to false
      }
    }

    fetchArtists()
  }, [])

  if (loading) {
    return <p>Loading artists...</p> // Show loading message
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>

      <CardContent className='mb-4'>
        <div className='flex space-x-4 mb-4'>
          {/* Dropdown for Filtering by Skill */}
          <DropdownMenu>
            <DropdownMenuTrigger className='p-2 bg-gray-200 rounded-md'>
              Filter by Skill
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedSkill("")}>
                All Skills
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSkill("3D Modeling")}>
                3D Modeling
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSkill("Texturing")}>
                Texturing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedSkill("Illustration")}
              >
                Illustration
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedSkill("Character Design")}
              >
                Character Design
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown for Sorting */}
          <DropdownMenu>
            <DropdownMenuTrigger className='p-2 bg-gray-200 rounded-md'>
              Sort By
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption("name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("rating")}>
                Rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Scrollable area for artist cards */}
        <ScrollArea className='h-80'>
          <CardContent className='grid grid-cols-2 gap-4'>
            {artists
              .filter((artist) =>
                selectedSkill ? artist.skills.includes(selectedSkill) : true
              ) // Filter by skill
              .sort((a, b) => {
                if (sortOption === "name") {
                  return a.name.localeCompare(b.name)
                } else if (sortOption === "rating") {
                  return b.averageRating - a.averageRating // Higher ratings first
                }
                return 0
              })
              .map((artist) => (
                <Card key={artist._id}>
                  <CardContent className='p-4'>
                    <h3 className='font-semibold mb-2'>
                      <Link to={`/profile/${artist.userId}`}>
                        {" "}
                        {/* Updated to use artist.userId */}
                        {artist.name} {/* Display artist name */}
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
