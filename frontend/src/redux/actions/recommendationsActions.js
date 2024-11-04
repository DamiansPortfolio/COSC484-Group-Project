// redux/actions/recommendationsActions.js
export const fetchRecommendations = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_RECOMMENDATIONS_REQUEST" })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artists`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      dispatch({
        type: "FETCH_RECOMMENDATIONS_SUCCESS",
        payload: data,
      })
    } catch (error) {
      console.error("Fetch error:", error)
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
