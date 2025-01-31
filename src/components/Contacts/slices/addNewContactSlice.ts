import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NewUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  public_key: string;
  createdAt: string;
}

// Interface for the API response
interface NewUserResponse {
  message: string; // e.g., "User(s) found" or "No users found"
  data: NewUser[]; // Array of users returned from the API
}

interface AddNewUserState {
  newUser: NewUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AddNewUserState = {
  newUser: [],
  loading: true,
  error: null,
};

const newUserSlice = createSlice({
  name: "newUser",
  initialState,
  reducers: {
    getNewUserStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    getNewUserSuccess: (state, action: PayloadAction<NewUserResponse>) => {
      console.log("action::",action.payload);
      (state.loading = false), (state.newUser = action.payload.data);
    },
    getNewUserFailed: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
  },
});
export const { getNewUserStart, getNewUserFailed, getNewUserSuccess } =
  newUserSlice.actions;

export default newUserSlice.reducer;
export type { AddNewUserState };
