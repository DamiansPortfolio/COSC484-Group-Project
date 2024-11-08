import { api } from "./userActions"

export const fetchRecommendations = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_RECOMMENDATIONS_REQUEST" })

    try {
      const { data } = await api.get("/artists")

      dispatch({
        type: "FETCH_RECOMMENDATIONS_SUCCESS",
        payload: data,
      })
    } catch (error) {
      console.error("Fetch error:", error)
      dispatch({
        type: "FETCH_RECOMMENDATIONS_FAIL",
        payload: error.response?.data?.message || error.message,
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
