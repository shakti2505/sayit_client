export const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const API_URL = BASE_URL + "/api";
export const GROUP_CHAT_URL = API_URL + "/create-chat-group";
export const GET_GROUP_CHAT_URL = API_URL + "/chat-groups";

export const DELETE_GROUP_CHAT_URL = (id: string) => {
  return API_URL + `/delete-group/${id}`;
};
export const UPDATE_GROUP_CHAT_URL = (id: string) => {
  return API_URL + `/chat-group-update/${id}`;
};
export const GET_GROUP_CHAT_BY_ID_URL = (id: string) => {
  return API_URL + `/chat-group/${id}`;
};
export const GET_GROUP_USERS_BY_ID_URL = (group_id: string) => {
  return API_URL + `/chat-group-users/${group_id}`;
};

export const ADD_NEW_USER_TO_GROUP = API_URL + "/create-chat-group-user";

export const GET_GROUP_CHATS_URL = (group_id: string) => {
  return API_URL + `/get-group-chats/${group_id}`;
};
export const GENERATE_GROUP_LINK = (group_id: string) => {
  return API_URL + `/generate-group-link/${group_id}`;
};
export const GOOGLE_AUTH_URL = (authCode: string) => {
  return `${BASE_URL}/auth/google?code=${authCode}`;
};
export const SAVE_PUBLIC_KEY = BASE_URL + "/auth/update-public-key";

export const GET_MESSAGES_BY_SEARCH = (
  group_id: String,
  queryMessage: string,
  page: number,
  limit = 20
) => {
  return `${API_URL}/search-messages?group_id=${group_id}&queryMessage=${queryMessage}&page=${page}&limit=${limit}`;
};

export const SEARCH_NEW_USER = (query: string) => {
  if (query.endsWith("gmail.com")) {
    return API_URL + `/search-user-by-name-or-email?email=${query}`;
  } else {
    return API_URL + `/search-user-by-name-or-email?name=${query}`;
  }
};

export const ADD_NEW_CONTACT = API_URL + "/add-new-contact";
export const GET_USERS_CONTACTS = API_URL + "/get-all-contacts-of-user";
