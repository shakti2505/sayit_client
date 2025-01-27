import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pagination {
  page: number;
  limit: number;
}

interface QueryMessage {
  _id: string;
  message: string;
  isRead: boolean;
  isReceived: boolean;
  createdAt: string;
}

interface QueryMessageState {
  queryMessages: QueryMessage[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

interface QueryMessagesResponse {
  messages: QueryMessage[];
  pagination: Pagination;
}

// Initial State
const initialState: QueryMessageState = {
  queryMessages: [],
  pagination: { page: 1, limit: 20 },
  loading: false,
  error: null,
};

const queryMessageSlice = createSlice({
  name: "queryMessages",
  initialState,
  reducers: {
    getMessagesBySearchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMessagesBySearchSuccess: (
      state,
      action: PayloadAction<QueryMessagesResponse>
    ) => {
      console.log("action", action.payload.messages);
      state.loading = false;
      state.queryMessages = action.payload.messages;
      state.pagination = action.payload.pagination;
    },
    getMessagesBySearchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getMessagesBySearchStart,
  getMessagesBySearchSuccess,
  getMessagesBySearchFailure,
} = queryMessageSlice.actions;

export default queryMessageSlice.reducer;
export type { QueryMessageState };
