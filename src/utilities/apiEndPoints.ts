export const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const API_URL = BASE_URL + "/api";
export const GROUP_CHAT_URL = API_URL + "/create-chat-group";
export const GET_GROUP_CHAT_URL = API_URL + "/chat-groups";

// delete group
export const DELETE_GROUP_CHAT_URL = (id: string) => {
  return API_URL + `/delete-group/${id}`;
};
// update chat group
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

// search message
export const GET_MESSAGES_BY_SEARCH = (
  group_id: String,
  queryMessage: string,
  page: number,
  limit = 20
) => {
  return `${API_URL}/search-messages?group_id=${group_id}&queryMessage=${queryMessage}&page=${page}&limit=${limit}`;
};

// searh new user database by email or name
export const SEARCH_NEW_USER = (query: string) => {
  if (query.endsWith("gmail.com")) {
    return API_URL + `/search-user-by-name-or-email?email=${query}`;
  } else {
    return API_URL + `/search-user-by-name-or-email?name=${query}`;
  }
};

// add a user to contacts
export const ADD_NEW_CONTACT = API_URL + "/add-new-contact";

// get all contacts of user
export const GET_USERS_CONTACTS = API_URL + "/get-all-contacts-of-user";

// update message status is read to true
export const UPDATE_MESSAGE_STATUS = (messageId: string) => {
  return API_URL + `/update-message-status/${messageId}`;
};

// add contacts to group
export const ADD_CONTACTS_TO_GROUP = API_URL + "/add-contacts-to-group";

// signup with email and password
export const SIGNUP_WITH_EMAIL_PASSWORD = BASE_URL + "/auth/signup";

export const LOGIN_WITH_EMAIL_PASSWORD = BASE_URL + "/auth/login";

export const LOGOUT_USER = BASE_URL + "/auth/logout";

// to create device link key
export const ADD_DEVICE_LINK_KEY = BASE_URL + "/auth/add-device-link-key";

// to get the data with device link ke

export const GET_DATA_WITH_DEVICE_LINK_KEY = (key: string) => {
  return `${API_URL}/get-data-with-device-link-key?key=${key}`;
};

export const LOGIN_AFTER_LINK_DEVICE_SUCCESSFULLY =
  API_URL + "/login-after-link-successfully";
