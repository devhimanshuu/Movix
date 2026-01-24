import { configureStore } from "@reduxjs/toolkit";

import homeSlice from "./homeSlice";
import watchlistSlice from "./watchlistSlice";
import historySlice from "./historySlice";
import searchFiltersSlice from "./searchFiltersSlice";
export const store = configureStore({
  reducer: {
    home: homeSlice,
    watchlist: watchlistSlice,
    history: historySlice,
    searchFilters: searchFiltersSlice,
  },
});

export default store;
