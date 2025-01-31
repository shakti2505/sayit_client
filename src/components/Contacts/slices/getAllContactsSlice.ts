import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface contact {
  _id: string;
  user_id: string;
  contact_id: string;
  contact_name: string;
  contact_image: string;
  contact_email: string;
  contact_public_key: string;
  createdAt: string;
}

interface UserContactState {
  userContacts: Array<contact>;
  loading: boolean;
  error: string | null;
}

const initialState: UserContactState = {
  userContacts: [],
  loading: false,
  error: null,
};

const UserContactSlice = createSlice({
  name: "User Contacts",
  initialState,
  reducers: {
    getUserContactStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    getUserContactSuccess: (state, action: PayloadAction<contact[]>) => {
      state.userContacts = action.payload;
    },
    getUserContactFailed: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
  },
});

export const {
  getUserContactStart,
  getUserContactSuccess,
  getUserContactFailed,
} = UserContactSlice.actions;
export default UserContactSlice.reducer;
export type { UserContactState };
