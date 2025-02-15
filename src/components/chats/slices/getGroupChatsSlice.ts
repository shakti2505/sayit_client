import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {groupChats} from './types/groupMessagesTypes'



interface getGroupChatState {
  groupChats: Array<groupChats>;
  loading: boolean;
  error: string | null;
}

// initial state
const initialState: getGroupChatState = {
  groupChats: [],
  loading: true,
  error: null,
};

// slices
const groupChatsSlice = createSlice({
  name: "groupChats",
  initialState,
  reducers: {
    getGroupChatStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    getGroupChatsuccess: (state, action: PayloadAction<Array<groupChats>>) => {
      (state.loading = false), (state.groupChats = action.payload);
    },
    getGroupChatfailure: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
  },
});

export const { getGroupChatStart, getGroupChatsuccess, getGroupChatfailure } =
  groupChatsSlice.actions;
export default groupChatsSlice.reducer;
export type { getGroupChatState };
