import { createSlice } from "@reduxjs/toolkit";

export const searchFiltersSlice = createSlice({
  name: "searchFilters",
  initialState: {
    yearRange: { min: 1990, max: new Date().getFullYear() },
    ratingRange: { min: 0, max: 10 },
    mediaType: "all", // all, movie, tv
  },
  reducers: {
    setYearRange: (state, action) => {
      state.yearRange = action.payload;
    },
    setRatingRange: (state, action) => {
      state.ratingRange = action.payload;
    },
    setMediaType: (state, action) => {
      state.mediaType = action.payload;
    },
    resetFilters: (state) => {
      state.yearRange = { min: 1990, max: new Date().getFullYear() };
      state.ratingRange = { min: 0, max: 10 };
      state.mediaType = "all";
    },
    loadFilters: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  setYearRange,
  setRatingRange,
  setMediaType,
  resetFilters,
  loadFilters,
} = searchFiltersSlice.actions;
export default searchFiltersSlice.reducer;
