import { configureStore } from "@reduxjs/toolkit";

import homeSlice from "./homeSlice";
import watchlistSlice from "./watchlistSlice";
import historySlice from "./historySlice";
import themeSlice from "./themeSlice";
export const store = configureStore({
  reducer: {
    home: homeSlice,
    watchlist: watchlistSlice,
    history: historySlice,
    theme: themeSlice,
  },
});

export default store;
