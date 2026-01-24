import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import { loadWatchlist } from "./store/watchlistSlice";
import { loadHistory } from "./store/historySlice";
import { setTheme } from "./store/themeSlice";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SearchResult from "./pages/SearchResult/SearchResult";
import Explore from "./pages/Explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import Details from "./pages/Details/Details";
import Home from "./pages/Home/Home";
import Watchlist from "./pages/Watchlist/Watchlist";
import WatchHistory from "./pages/WatchHistory/WatchHistory";
import { all } from "axios";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  const watchlist = useSelector((state) => state.watchlist.items);
  const history = useSelector((state) => state.history.items);
  const isDark = useSelector((state) => state.theme.isDark);
  console.log(url);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("movix_watchlist");
    if (savedWatchlist) {
      dispatch(loadWatchlist(JSON.parse(savedWatchlist)));
    }
    // Load history from localStorage
    const savedHistory = localStorage.getItem("movix_history");
    if (savedHistory) {
      dispatch(loadHistory(JSON.parse(savedHistory)));
    }
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("movix_theme");
    if (savedTheme !== null) {
      dispatch(setTheme(JSON.parse(savedTheme)));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem("movix_watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("movix_history", JSON.stringify(history));
    }
  }, [history]);

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light-mode");
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.add("light-mode");
    }
    // Save theme preference
    localStorage.setItem("movix_theme", JSON.stringify(isDark));
  }, [isDark]);
  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises); // use when two api call done at the same time

    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });
    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/history" element={<WatchHistory />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
