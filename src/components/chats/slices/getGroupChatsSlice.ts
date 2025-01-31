import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 interface messages {
  _id: string;
  sender_id: string;
  createdAt: Date;
  group_id: string;
  message: string;
  name: string;
  isRead: boolean;
  isReceived: boolean;
}
[];

 interface groupChats {
  _id: string;
  messages: Array<messages>;
}

interface getGroupChatState {
  data: Array<groupChats>;
  loading: boolean;
  error: string | null;
}

// initita state
const initialState: getGroupChatState = {
  data: [],
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
      (state.loading = false), (state.data = action.payload);
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
