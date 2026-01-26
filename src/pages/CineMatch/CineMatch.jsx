import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import { addToWatchlist } from "../../store/watchlistSlice";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const CineMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { url, genres } = useSelector((state) => state.home);
  const watchlist = useSelector((state) => state.watchlist.items);

  // State
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageNum, setPageNum] = useState(Math.floor(Math.random() * 100) + 1);
  const [direction, setDirection] = useState(null); // 'left' or 'right'
  const [isSwiping, setIsSwiping] = useState(false);

  // Fetch movies for discovery
  useEffect(() => {
    fetchDataFromApi(
      `/discover/movie?sort_by=popularity.desc&page=${pageNum}`,
    ).then((res) => {
      if (res?.results) {
        // Filter out movies already in watchlist
        let newMovies = res.results.filter(
          (movie) => !watchlist.some((item) => item.id === movie.id),
        );

        // Shuffle the results for randomness
        newMovies = [...newMovies].sort(() => Math.random() - 0.5);

        setMovies((prev) => [...prev, ...newMovies]);
      }
    });
  }, [pageNum]); // Removed watchlist from dependency to prevent infinite loops, only fetch more when page changes

  const handleSwipe = (dir) => {
    if (currentIndex >= movies.length || isSwiping) return;

    const currentMovie = movies[currentIndex];
    setIsSwiping(true);
    setDirection(dir);

    // Visual delay for animation
    setTimeout(() => {
      if (dir === "right") {
        dispatch(addToWatchlist({ ...currentMovie, media_type: "movie" }));
      }

      // Move to next card
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
      setIsSwiping(false);

      // Fetch more if running low
      if (movies.length - currentIndex < 5) {
        setPageNum((prev) => prev + 1);
      }
    }, 400); // Slightly longer for better visual feedback
  };

  const currentMovie = movies[currentIndex];

  // Helper to get genre names
  const getGenreNames = (ids) => {
    if (!ids) return "";
    return ids
      .slice(0, 2)
      .map((id) => genres[id]?.name)
      .filter(Boolean)
      .join(" • ");
  };

  return (
    <div className="cineMatchPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>CineMatch</h1>
          <p>Swipe Right to Add to Watchlist • Swipe Left to Pass</p>
        </div>

        <div className="matchContainer">
          {currentMovie ? (
            <div
              className={`cardContainer ${direction === "right" ? "swipingRight" : direction === "left" ? "swipingLeft" : ""}`}
            >
              <Img
                src={
                  currentMovie.poster_path
                    ? url.poster + currentMovie.poster_path
                    : PosterFallback
                }
              />
              <div className="cardOverlay">
                <h2>{currentMovie.title}</h2>
                <div className="genres">
                  {getGenreNames(currentMovie.genre_ids)}
                </div>
                <div className="rating">
                  <FaStar color="gold" />
                  <span>{currentMovie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="emptyState">
              <h3>No more movies!</h3>
              <p>Check back later for more recommendations.</p>
              <button onClick={() => navigate("/")}>Go Home</button>
            </div>
          )}
        </div>

        {currentMovie && (
          <div className="controls">
            <button
              className="passBtn"
              onClick={() => handleSwipe("left")}
              title="Pass"
            >
              <FaTimes />
            </button>
            <button
              className="likeBtn"
              onClick={() => handleSwipe("right")}
              title="Add to Watchlist"
            >
              <FaHeart />
            </button>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default CineMatch;
