import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { groupData } from "./types/chatGroupTypes";

interface UpdatedChatGroupDetailState {
  updatedGroupDetails: groupData | null;
  loadingUpdatedGroupDetails: boolean;
  error: string | null;
}

// initial state
const initialState: UpdatedChatGroupDetailState = {
  updatedGroupDetails: null,
  loadingUpdatedGroupDetails: true,
  error: null,
};

const updatedGroupDetailsSlice = createSlice({
  name: "updatedChatGroupDetails",
  initialState,
  reducers: {
    updatedGroupDetailsStart: (state) => {
      (state.loadingUpdatedGroupDetails = true), (state.error = null);
    },
    updatedGroupDetailsSuccess: (state, action: PayloadAction<groupData>) => {
      (state.loadingUpdatedGroupDetails = false),
        (state.updatedGroupDetails = action.payload);
    },
    updatedGroupDetailsFailure: (state, action: PayloadAction<string>) => {
      (state.loadingUpdatedGroupDetails = false),
        (state.error = action.payload);
    },
  },
});

export const {
  updatedGroupDetailsStart,
  updatedGroupDetailsSuccess,
  updatedGroupDetailsFailure,
} = updatedGroupDetailsSlice.actions;
export default updatedGroupDetailsSlice.reducer;
export type { UpdatedChatGroupDetailState };
