import artistData from "../artistData.js";

// Get all artists or filter/sort
export const getArtists = (req, res) => {
  const { skill, sort } = req.query;

  let filteredArtists = artistData;

  if (skill) {
    filteredArtists = filteredArtists.filter((artist) =>
      artist.skills.includes(skill)
    );
  }

  if (sort === "name") {
    filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "rating") {
    filteredArtists.sort((a, b) => b.rating - a.rating);
  }

  res.json(filteredArtists);
};

// Get a single artist by ID
export const getArtistById = (req, res) => {
  const { id } = req.params;
  const artist = artistData.find((artist) => artist.id === id);

  if (!artist) {
    return res.status(404).json({ message: "Artist not found" });
  }

  res.json(artist);
};
