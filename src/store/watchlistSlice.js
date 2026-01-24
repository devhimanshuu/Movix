import { createSlice } from "@reduxjs/toolkit";

export const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWatchlist: (state, action) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    loadWatchlist: (state, action) => {
      state.items = action.payload;
    },
    clearWatchlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  loadWatchlist,
  clearWatchlist,
} = watchlistSlice.actions;
export default watchlistSlice.reducer;
