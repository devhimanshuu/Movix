import { configureStore } from "@reduxjs/toolkit";

import homeSlice from "./homeSlice";
import watchlistSlice from "./watchlistSlice";
import historySlice from "./historySlice";
import searchFiltersSlice from "./searchFiltersSlice";
import comparisonSlice from "./comparisonSlice";
export const store = configureStore({
  reducer: {
    home: homeSlice,
    watchlist: watchlistSlice,
    history: historySlice,
    searchFilters: searchFiltersSlice,
    comparison: comparisonSlice,
  },
});

export default store;
