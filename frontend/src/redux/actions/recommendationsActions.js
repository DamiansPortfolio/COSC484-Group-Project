// actions/recommendationActions.js
/**
 * Recommendation system actions
 * Handles artist recommendations, filtering, and sorting
 */
import { api } from "./userActions"

export const fetchRecommendations = () => async (dispatch) => {
  dispatch({ type: "FETCH_RECOMMENDATIONS_REQUEST" })

  try {
    const { data } = await api.get("/api/artists")
    dispatch({
      type: "FETCH_RECOMMENDATIONS_SUCCESS",
      payload: data,
    })
  } catch (error) {
    console.error("Error fetching artists:", error)
    dispatch({
      type: "FETCH_RECOMMENDATIONS_FAIL",
      payload: error.response?.data?.message || "Failed to fetch artists",
    })
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
