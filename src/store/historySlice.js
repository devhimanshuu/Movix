import { createSlice } from "@reduxjs/toolkit";

export const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
  },
  reducers: {
    addToHistory: (state, action) => {
      const { id, media_type } = action.payload;
      // Remove if already exists (to avoid duplicates)
      state.items = state.items.filter(
        (item) => !(item.id === id && item.media_type === media_type)
      );
      // Add to beginning (most recent)
      state.items.unshift({
        ...action.payload,
        watchedAt: new Date().toISOString(),
      });
      // Keep only last 50 items
      if (state.items.length > 50) {
        state.items = state.items.slice(0, 50);
      }
    },
    loadHistory: (state, action) => {
      state.items = action.payload;
    },
    clearHistory: (state) => {
      state.items = [];
    },
    removeFromHistory: (state, action) => {
      const { id, media_type } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.media_type === media_type)
      );
    },
  },
});

export const { addToHistory, loadHistory, clearHistory, removeFromHistory } =
  historySlice.actions;
export default historySlice.reducer;
