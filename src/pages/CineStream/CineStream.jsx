import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaPlay, FaPlus, FaCheck, FaInfo } from "react-icons/fa";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../store/watchlistSlice";

import "./style.scss";

const FeedItem = ({ movie, isActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.items);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [muted, setMuted] = useState(true);

  // Fetch video data manually for each item
  useEffect(() => {
    if (isActive && !trailerUrl) {
      fetchDataFromApi(`/movie/${movie.id}/videos`).then((res) => {
        const trailer = res?.results?.find(
          (vid) =>
            vid.name.toLowerCase().includes("trailer") ||
            vid.type === "Trailer",
        );
        // Fallback to first video if no specific "trailer" found
        const videoData = trailer || res?.results?.[0];
        if (videoData?.key) {
          setTrailerUrl(videoData.key);
        }
      });
    }
  }, [movie.id, isActive, trailerUrl]);

  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist({ ...movie, media_type: "movie" }));
    }
  };

  // Toggle mute on click
  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <div className="feedItem" onClick={toggleMute}>
      <div className="videoWrapper">
        {trailerUrl ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerUrl}`}
            playing={isActive}
            width="100%"
            height="100%"
            controls={false}
            muted={muted}
            loop={true}
            config={{
              youtube: {
                playerVars: { showinfo: 0, controls: 0, disablekb: 1 },
              },
            }}
            style={{ pointerEvents: "none" }} // Ensure clicks go to parent div for mute toggle
          />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt="Background"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      <div className="overlay">
        <div className="content">
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <div className="actions">
            <button
              className="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.id}`);
              }}
            >
              <FaPlay size={12} /> Watch Details
            </button>
            <button className="secondary" onClick={handleWatchlist}>
              {isInWatchlist ? <FaCheck /> : <FaPlus />}
              {isInWatchlist ? "In Watchlist" : "My List"}
            </button>
          </div>
        </div>
      </div>

      <div className="sideActions" onClick={(e) => e.stopPropagation()}>
        <div className="actionBtn" onClick={() => setMuted(!muted)}>
          <div className="iconCircle">{muted ? "🔇" : "🔊"}</div>
          <span>{muted ? "Unmute" : "Mute"}</span>
        </div>

        <div
          className="actionBtn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movie/${movie.id}`);
          }}
        >
          <div className="iconCircle">
            <FaInfo />
          </div>
          <span>Info</span>
        </div>
      </div>
    </div>
  );
};

const CineStream = () => {
  const navigate = useNavigate();
  const { data, loading } = useFetch(`/trending/movie/week`);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  // Handle scroll snap detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  return (
    <div className="cineStreamPage" ref={containerRef}>
      <button className="backBtn" onClick={() => navigate("/")}>
        <FaArrowLeft /> Exit Stream
      </button>

      {!loading &&
        data?.results
          ?.slice(0, 10)
          .map((movie, index) => (
            <FeedItem
              key={movie.id}
              movie={movie}
              isActive={index === activeIndex}
            />
          ))}
    </div>
  );
};

export default CineStream;
