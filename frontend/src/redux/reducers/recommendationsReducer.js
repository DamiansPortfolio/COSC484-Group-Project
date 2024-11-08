// recommendationsReducer.js
const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedSkill: "",
  sortOption: "recent",
}

const recommendationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_RECOMMENDATIONS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      }
    case "FETCH_RECOMMENDATIONS_SUCCESS":
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      }
    case "FETCH_RECOMMENDATIONS_FAIL":
      return {
        ...state,
        error: action.payload,
        loading: false,
        items: [],
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
