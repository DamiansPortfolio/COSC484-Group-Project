export const fetchRecommendations = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_RECOMMENDATIONS_REQUEST" })

    try {
      const artistsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/artists`
      )
      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`)

      if (!artistsResponse.ok || !usersResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const artistsData = await artistsResponse.json()
      const usersData = await usersResponse.json()

      // Combine artists data with users data
      const enrichedArtists = artistsData.map((artist) => {
        const user = usersData.find((user) => user._id === artist.userId)
        return {
          ...artist,
          name: user ? user.name : "Unknown Artist",
          username: user ? user.username : "Unknown",
        }
      })

      dispatch({
        type: "FETCH_RECOMMENDATIONS_SUCCESS",
        payload: enrichedArtists,
      })
    } catch (error) {
      dispatch({
        type: "FETCH_RECOMMENDATIONS_FAIL",
        payload: error.message,
      })
    }
  }
}

export const setSelectedSkill = (skill) => ({
  type: "SET_SELECTED_SKILL",
  payload: skill,
})

export const setSortOption = (option) => ({
  type: "SET_SORT_OPTION",
  payload: option,
})
