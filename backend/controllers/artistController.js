import { ObjectId } from "mongodb"
import { connectToDatabase } from "../db.js"

// Get the artists collection
const getCollection = async () => {
  const db = await connectToDatabase()
  return db.collection("artists")
}

export const getArtists = async (req, res) => {
  const { skill, sort } = req.query

  try {
    const collection = await getCollection()

    // Updated query logic using $in for skills
    const query = skill ? { skills: { $in: [skill] } } : {}

    const sortOptions = {}
    if (sort === "name") {
      sortOptions.name = 1 // Ascending
    } else if (sort === "rating") {
      sortOptions.rating = -1 // Descending
    }

    const filteredArtists = await collection
      .find(query)
      .sort(sortOptions)
      .toArray()

    res.json(filteredArtists)
  } catch (error) {
    console.error("Error fetching artists:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Get a single artist by ID
export const getArtistById = async (req, res) => {
  const { id } = req.params

  // Validate the ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid artist ID" })
  }

  try {
    const collection = await getCollection()
    // Find the artist by MongoDB ObjectId
    const artist = await collection.findOne({ _id: new ObjectId(id) })

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" })
    }

    res.json(artist)
  } catch (error) {
    console.error("Error fetching artist by ID:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Old method:
// // Get all artists or filter/sort
// export const getArtists = (req, res) => {
//   const { skill, sort } = req.query

//   let filteredArtists = artistData

//   if (skill) {
//     filteredArtists = filteredArtists.filter((artist) =>
//       artist.skills.includes(skill)
//     )
//   }

//   if (sort === "name") {
//     filteredArtists.sort((a, b) => a.name.localeCompare(b.name))
//   } else if (sort === "rating") {
//     filteredArtists.sort((a, b) => b.rating - a.rating)
//   }

//   res.json(filteredArtists)
// }

// Old method:
// Get a single artist by ID
// export const getArtistById = (req, res) => {
//   const { id } = req.params
//   const artist = artistData.find((artist) => artist.id === id)

//   if (!artist) {
//     return res.status(404).json({ message: "Artist not found" })
//   }

//   res.json(artist)
// }
