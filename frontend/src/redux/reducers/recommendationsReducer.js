const initialState = {
  artists: [],
  loading: false,
  error: null,
  selectedSkill: "",
  sortOption: "",
}

const recommendationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_RECOMMENDATIONS_REQUEST":
      return { ...state, loading: true }
    case "FETCH_RECOMMENDATIONS_SUCCESS":
      return {
        ...state,
        artists: action.payload,
        loading: false,
      }
    case "FETCH_RECOMMENDATIONS_FAIL":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "SET_SELECTED_SKILL":
      return {
        ...state,
        selectedSkill: action.payload,
      }
    case "SET_SORT_OPTION":
      return {
        ...state,
        sortOption: action.payload,
      }
    default:
      return state
  }
}

export default recommendationsReducer
