import artistData from '../artistData.js'; // Include .js extension

export const getArtists = (req, res) => {
    const { skill, sort } = req.query;

    let filteredArtists = artistData;

    if (skill) {
        filteredArtists = filteredArtists.filter(artist => artist.skills.includes(skill));
    }

    if (sort === 'name') {
        filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'rating') {
        filteredArtists.sort((a, b) => b.rating - a.rating);
    }

    res.json(filteredArtists);
};
