import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { messages } from "./types/groupMessagesTypes";

interface getGroupChatState {
  groupChats: Array<messages>;
  loadingGroupChats: boolean;
  error: string | null;
}

// initial state
const initialState: getGroupChatState = {
  groupChats: [],
  loadingGroupChats: true,
  error: null,
};

// slices
const groupChatsSlice = createSlice({
  name: "groupChats",
  initialState,
  reducers: {
    getGroupChatStart: (state) => {
      (state.loadingGroupChats = true), (state.error = null);
    },
    getGroupChatsuccess: (state, action: PayloadAction<Array<messages>>) => {
      state.loadingGroupChats = false,
      state.groupChats = action.payload
    },
    getGroupChatfailure: (state, action: PayloadAction<string>) => {
      (state.loadingGroupChats = false), (state.error = action.payload);
    },
  },
});

export const { getGroupChatStart, getGroupChatsuccess, getGroupChatfailure } =
  groupChatsSlice.actions;
export default groupChatsSlice.reducer;
export type { getGroupChatState };
