import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    addToComparison: (state, action) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromComparison: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearComparison: (state) => {
      state.items = [];
    },
    loadComparison: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToComparison,
  removeFromComparison,
  clearComparison,
  loadComparison,
} = comparisonSlice.actions;

export default comparisonSlice.reducer;
