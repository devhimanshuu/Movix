import { configureStore } from "@reduxjs/toolkit";

import homeSlice from "./homeSlice";
import watchlistSlice from "./watchlistSlice";
export const store = configureStore({
  reducer: {
    home: homeSlice,
    watchlist: watchlistSlice,
  },
});

export default store;
