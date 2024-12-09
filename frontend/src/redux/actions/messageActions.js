// src/redux/actions/messageActions.js
import { api } from "./userActions";
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
  SEARCH_USERS_FAIL,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  MARK_MESSAGES_READ_REQUEST,
  MARK_MESSAGES_READ_SUCCESS,
  MARK_MESSAGES_READ_FAIL,
} from "../constants/messageConstants";

export const searchUsers =
  (role = "all") =>
  async (dispatch) => {
    dispatch({ type: SEARCH_USERS_REQUEST }); // Now using the constant
    try {
      const { data } = await api.get(`/api/users/search?role=${role}`);
      dispatch({ type: SEARCH_USERS_SUCCESS, payload: data }); // Now using the constant
      return { success: true, data };
    } catch (error) {
      dispatch({
        type: SEARCH_USERS_FAIL,
        payload: error.response?.data?.message || "Failed to search users",
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

export const getConversations = () => async (dispatch) => {
  dispatch({ type: GET_CONVERSATIONS_REQUEST });
  try {
    const { data } = await api.get("api/messages/conversations");
    dispatch({ type: GET_CONVERSATIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CONVERSATIONS_FAIL,
      payload: error.response?.data?.message || "Failed to fetch conversations",
    });
  }
};

export const getMessages = (userId) => async (dispatch) => {
  dispatch({ type: GET_MESSAGES_REQUEST });
  try {
    const { data } = await api.get(`api/messages/conversation/${userId}`);
    dispatch({ type: GET_MESSAGES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_MESSAGES_FAIL,
      payload: error.response?.data?.message || "Failed to fetch messages",
    });
  }
};

export const sendMessage = (receiverId, content) => async (dispatch) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try {
    const { data } = await api.post("api/messages/send", {
      receiverId,
      content,
    });
    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response?.data?.message || "Failed to send message",
    });
    return { success: false, error: error.response?.data?.message };
  }
};

export const deleteMessage = (messageId) => async (dispatch) => {
  dispatch({ type: DELETE_MESSAGE_REQUEST });
  try {
    await api.delete(`api/messages/${messageId}`);
    dispatch({ type: DELETE_MESSAGE_SUCCESS, payload: messageId });
    return { success: true };
  } catch (error) {
    dispatch({
      type: DELETE_MESSAGE_FAIL,
      payload: error.response?.data?.message || "Failed to delete message",
    });
    return { success: false, error: error.response?.data?.message };
  }
};

export const markMessagesAsRead = (senderId) => async (dispatch) => {
  dispatch({ type: MARK_MESSAGES_READ_REQUEST });
  try {
    const { data } = await api.post(`api/messages/mark-read/${senderId}`);
    dispatch({
      type: MARK_MESSAGES_READ_SUCCESS,
      payload: senderId,
    });
    // Update conversations to reflect new read status
    if (data.conversations) {
      dispatch({
        type: GET_CONVERSATIONS_SUCCESS,
        payload: data.conversations,
      });
    }
    return { success: true };
  } catch (error) {
    dispatch({
      type: MARK_MESSAGES_READ_FAIL,
      payload:
        error.response?.data?.message || "Failed to mark messages as read",
    });
    return { success: false, error: error.response?.data?.message };
  }
};
