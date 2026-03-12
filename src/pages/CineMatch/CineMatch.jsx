import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaHeart, FaStar, FaUndo, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import { addToWatchlist } from "../../store/watchlistSlice";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const GENRE_FILTERS = [
  { id: 0, name: "All" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
];

const CineMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { url, genres } = useSelector((state) => state.home);
  const watchlist = useSelector((state) => state.watchlist.items);
  const cardRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageNum, setPageNum] = useState(Math.floor(Math.random() * 50) + 1);
  const [direction, setDirection] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [sessionStats, setSessionStats] = useState({ liked: 0, passed: 0 });
  const [lastAction, setLastAction] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [swipeOverlay, setSwipeOverlay] = useState(null);

  // Touch/drag state
  const [dragStart, setDragStart] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Fetch movies
  const fetchMovies = useCallback((page, genreId) => {
    const params = {
      sort_by: "popularity.desc",
      page,
    };
    if (genreId && genreId !== 0) {
      params.with_genres = genreId;
    }
    fetchDataFromApi("/discover/movie", params).then((res) => {
      if (res?.results) {
        let newMovies = res.results.filter(
          (movie) =>
            movie.poster_path &&
            !watchlist.some((item) => item.id === movie.id)
        );
        newMovies = [...newMovies].sort(() => Math.random() - 0.5);
        setMovies((prev) => [...prev, ...newMovies]);
      }
    });
  }, [watchlist]);

  useEffect(() => {
    setMovies([]);
    setCurrentIndex(0);
    const newPage = Math.floor(Math.random() * 50) + 1;
    setPageNum(newPage);
    fetchMovies(newPage, selectedGenre);
  }, [selectedGenre]);

  // Fetch more when running low
  useEffect(() => {
    if (movies.length > 0 && movies.length - currentIndex < 5) {
      const nextPage = pageNum + 1;
      setPageNum(nextPage);
      fetchMovies(nextPage, selectedGenre);
    }
  }, [currentIndex, movies.length]);

  const handleSwipe = (dir) => {
    if (currentIndex >= movies.length || isSwiping) return;

    const currentMovie = movies[currentIndex];
    setIsSwiping(true);
    setDirection(dir);
    setSwipeOverlay(dir);

    setTimeout(() => {
      if (dir === "right") {
        dispatch(addToWatchlist({ ...currentMovie, media_type: "movie" }));
        setSessionStats((s) => ({ ...s, liked: s.liked + 1 }));
        setLastAction({ movie: currentMovie, action: "liked" });
      } else {
        setSessionStats((s) => ({ ...s, passed: s.passed + 1 }));
        setLastAction({ movie: currentMovie, action: "passed" });
      }

      setUndoStack((prev) => [
        ...prev,
        { movie: currentMovie, index: currentIndex, action: dir },
      ]);

      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
      setSwipeOverlay(null);
      setIsSwiping(false);
      setShowDetails(false);
      setDragDelta({ x: 0, y: 0 });
    }, 350);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setCurrentIndex(last.index);

    if (last.action === "right") {
      setSessionStats((s) => ({ ...s, liked: Math.max(0, s.liked - 1) }));
    } else {
      setSessionStats((s) => ({ ...s, passed: Math.max(0, s.passed - 1) }));
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragStart) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setDragDelta({ x: deltaX, y: deltaY });

    if (deltaX > 50) setSwipeOverlay("right");
    else if (deltaX < -50) setSwipeOverlay("left");
    else setSwipeOverlay(null);
  };

  const handleTouchEnd = () => {
    if (dragDelta.x > 100) {
      handleSwipe("right");
    } else if (dragDelta.x < -100) {
      handleSwipe("left");
    } else {
      setDragDelta({ x: 0, y: 0 });
      setSwipeOverlay(null);
    }
    setDragStart(null);
    setIsDragging(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart) return;
    const deltaX = e.clientX - dragStart.x;
    setDragDelta({ x: deltaX, y: 0 });

    if (deltaX > 50) setSwipeOverlay("right");
    else if (deltaX < -50) setSwipeOverlay("left");
    else setSwipeOverlay(null);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    if (dragDelta.x > 100) {
      handleSwipe("right");
    } else if (dragDelta.x < -100) {
      handleSwipe("left");
    } else {
      setDragDelta({ x: 0, y: 0 });
      setSwipeOverlay(null);
    }
    setDragStart(null);
    setIsDragging(false);
  }, [isDragging, dragDelta]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handleSwipe("left");
      if (e.key === "ArrowRight") handleSwipe("right");
      if (e.key === "z" && e.ctrlKey) handleUndo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, movies, isSwiping, undoStack]);

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];

  const getGenreNames = (ids) => {
    if (!ids) return "";
    return ids
      .slice(0, 3)
      .map((id) => genres[id]?.name)
      .filter(Boolean)
      .join(" • ");
  };

  const cardRotation = isDragging ? dragDelta.x * 0.05 : 0;
  const cardStyle =
    direction === "right"
      ? { transform: "translateX(150%) rotate(20deg)", opacity: 0 }
      : direction === "left"
      ? { transform: "translateX(-150%) rotate(-20deg)", opacity: 0 }
      : isDragging
      ? {
          transform: `translateX(${dragDelta.x}px) rotate(${cardRotation}deg)`,
          transition: "none",
        }
      : {};

  return (
    <div className="cineMatchPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>💘 CineMatch</h1>
          <p>Swipe through movies — build your perfect watchlist</p>
        </div>

        {/* Genre Filter */}
        <div className="genreFilter">
          {GENRE_FILTERS.map((g) => (
            <button
              key={g.id}
              className={`filterChip ${selectedGenre === g.id ? "active" : ""}`}
              onClick={() => setSelectedGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Session Stats */}
        <div className="sessionStats">
          <div className="statPill liked">
            <FaHeart /> <span>{sessionStats.liked}</span>
          </div>
          <div className="statPill passed">
            <FaTimes /> <span>{sessionStats.passed}</span>
          </div>
          <div className="statPill remaining">
            📚 <span>{Math.max(0, movies.length - currentIndex)}</span>
          </div>
        </div>

        {/* Card Stack */}
        <div className="cardStack">
          {/* Next card (background) */}
          {nextMovie && (
            <div className="cardContainer nextCard">
              <Img
                src={
                  nextMovie.poster_path
                    ? url.poster + nextMovie.poster_path
                    : PosterFallback
                }
              />
            </div>
          )}

          {/* Current card */}
          {currentMovie ? (
            <div
              ref={cardRef}
              className={`cardContainer currentCard`}
              style={cardStyle}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              {/* Swipe overlay indicators */}
              {swipeOverlay === "right" && (
                <div className="swipeIndicator like">
                  <FaHeart /> LIKE
                </div>
              )}
              {swipeOverlay === "left" && (
                <div className="swipeIndicator nope">
                  <FaTimes /> NOPE
                </div>
              )}

              <Img
                src={
                  currentMovie.poster_path
                    ? url.poster + currentMovie.poster_path
                    : PosterFallback
                }
              />
              <div className="cardOverlay">
                <h2>{currentMovie.title}</h2>
                <div className="cardMeta">
                  <span className="genres">
                    {getGenreNames(currentMovie.genre_ids)}
                  </span>
                  <span className="rating">
                    <FaStar /> {currentMovie.vote_average?.toFixed(1)}
                  </span>
                  <span className="year">
                    {currentMovie.release_date?.slice(0, 4)}
                  </span>
                </div>
              </div>

              {/* Info button */}
              <button
                className="infoBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                <FaInfoCircle />
              </button>

              {/* Details Panel */}
              {showDetails && (
                <div
                  className="detailsPanel"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="overview">{currentMovie.overview}</p>
                  <button
                    className="viewDetailsBtn"
                    onClick={() =>
                      navigate(`/movie/${currentMovie.id}`)
                    }
                  >
                    View Full Details →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="cardContainer emptyState">
              <div className="emptyContent">
                <span className="emptyIcon">🍿</span>
                <h3>No more movies!</h3>
                <p>
                  You've swiped through all available movies.
                  <br />
                  Try a different genre or come back later!
                </p>
                <div className="emptyActions">
                  <button
                    className="resetBtn"
                    onClick={() => {
                      setSelectedGenre(0);
                      setCurrentIndex(0);
                      setMovies([]);
                    }}
                  >
                    Start Over
                  </button>
                  <button
                    className="homeBtn"
                    onClick={() => navigate("/")}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {currentMovie && (
          <div className="controls">
            <button
              className="controlBtn undo"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Undo (Ctrl+Z)"
            >
              <FaUndo />
            </button>
            <button
              className="controlBtn pass"
              onClick={() => handleSwipe("left")}
              title="Pass (←)"
            >
              <FaTimes />
            </button>
            <button
              className="controlBtn like"
              onClick={() => handleSwipe("right")}
              title="Like (→)"
            >
              <FaHeart />
            </button>
            <button
              className="controlBtn info"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              title="View Details"
            >
              <FaInfoCircle />
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="keyboardHint">
          ← Pass &nbsp;·&nbsp; Like → &nbsp;·&nbsp; Ctrl+Z Undo
        </div>
      </ContentWrapper>
    </div>
  );
};

export default CineMatch;
