import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { groupData} from './types/chatGroupTypes'

interface ChatGroupState {
  chatGroups: groupData | null;
  loadingChatGroup: boolean;
  error: string | null;
}

// initial State

// initial state
const initialState: ChatGroupState = {
  chatGroups: null,
  loadingChatGroup: true,
  error: null,
};

const getGroupByIdSlice = createSlice({
  name: "getGroupById",
  initialState,
  reducers: {
    getGroupByIdStart: (state) => {
      (state.loadingChatGroup = true), (state.error = null);
    },
    getGroupByIdSuccess: (state, action: PayloadAction<groupData>) => {
      (state.loadingChatGroup = false), (state.chatGroups = action.payload);
    },
    getGroupByIdFailure: (state, action: PayloadAction<string>) => {
      (state.loadingChatGroup = false), (state.error = action.payload);
    },
  },
});

export const { getGroupByIdStart, getGroupByIdFailure, getGroupByIdSuccess } =
  getGroupByIdSlice.actions;
export default getGroupByIdSlice.reducer;
export type { ChatGroupState };
