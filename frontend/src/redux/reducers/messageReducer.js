import {
  GET_CONVERSATIONS_REQUEST,
  GET_CONVERSATIONS_SUCCESS,
  GET_CONVERSATIONS_FAIL,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  DELETE_MESSAGE_REQUEST,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAIL,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAIL,
  MARK_MESSAGES_READ_REQUEST,
  MARK_MESSAGES_READ_SUCCESS,
  MARK_MESSAGES_READ_FAIL,
} from "../constants/messageConstants";

const initialState = {
  conversations: [],
  currentConversation: [],
  users: [],
  loading: false,
  error: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONVERSATIONS_REQUEST:
    case GET_MESSAGES_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case DELETE_MESSAGE_REQUEST:
    case SEARCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };

    case GET_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        conversations: action.payload,
        error: null,
      };

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        currentConversation: action.payload,
        error: null,
      };

    case SEND_MESSAGE_SUCCESS:
      const existingConversation = state.conversations.find(
        (conv) =>
          conv.otherUser._id === action.payload.receiver._id ||
          conv.otherUser._id === action.payload.sender._id
      );

      return {
        ...state,
        loading: false,
        currentConversation: [...state.currentConversation, action.payload],
        conversations: existingConversation
          ? state.conversations.map((conv) => {
              if (
                conv.otherUser._id === action.payload.receiver._id ||
                conv.otherUser._id === action.payload.sender._id
              ) {
                return {
                  ...conv,
                  lastMessage: action.payload,
                };
              }
              return conv;
            })
          : [
              {
                _id: action.payload._id,
                otherUser: action.payload.receiver,
                lastMessage: action.payload,
                unreadCount: 0,
              },
              ...state.conversations,
            ],
      };

    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentConversation: state.currentConversation.filter(
          (message) => message._id !== action.payload
        ),
        error: null,
      };

    case SEARCH_USERS_FAIL:
    case GET_CONVERSATIONS_FAIL:
    case GET_MESSAGES_FAIL:
    case SEND_MESSAGE_FAIL:
    case DELETE_MESSAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MARK_MESSAGES_READ_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case MARK_MESSAGES_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        conversations: state.conversations.map((conv) =>
          conv.otherUser._id === action.payload
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
        currentConversation: state.currentConversation.map((message) => ({
          ...message,
          read: true,
        })),
      };

    case MARK_MESSAGES_READ_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default messageReducer;
