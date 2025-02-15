import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { groupData} from './types/chatGroupTypes'

interface ChatGroupState {
  chatGroups: groupData | null;
  loading: boolean;
  error: string | null;
}

// initial State

// initial state
const initialState: ChatGroupState = {
  chatGroups: null,
  loading: true,
  error: null,
};

const getGroupByIdSlice = createSlice({
  name: "getGroupById",
  initialState,
  reducers: {
    getGroupByIdStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    getGroupByIdSuccess: (state, action: PayloadAction<groupData>) => {
      (state.loading = false), (state.chatGroups = action.payload);
    },
    getGroupByIdFailure: (state, action: PayloadAction<string>) => {
      (state.loading = false), (state.error = action.payload);
    },
  },
});

export const { getGroupByIdStart, getGroupByIdFailure, getGroupByIdSuccess } =
  getGroupByIdSlice.actions;
export default getGroupByIdSlice.reducer;
export type { ChatGroupState };
