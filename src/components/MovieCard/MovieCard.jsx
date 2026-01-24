import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";
import { addToWatchlist, removeFromWatchlist } from "../../store/watchlistSlice";

const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.items);
  
  // Safety check - return null if no data
  if (!data?.id) {
    return null;
  }

  // Ensure data has required fields with defaults
  const safeData = {
    id: data?.id,
    title: data?.title || data?.name || "Unknown",
    name: data?.name || data?.title || "Unknown",
    poster_path: data?.poster_path,
    media_type: data?.media_type || mediaType,
    vote_average: data?.vote_average ?? 0,
    release_date: data?.release_date || data?.first_air_date,
    genre_ids: data?.genre_ids || data?.genres?.map((g) => g.id) || [],
    ...data,
  };

  const isInWatchlist = watchlist.some((item) => item.id === safeData.id);
  
  // Use stored full posterUrl if available (from history), otherwise construct from base URL
  let posterUrl;
  if (safeData.posterUrl) {
    // History items have full URL stored
    posterUrl = safeData.posterUrl;
  } else if (url?.poster && safeData.poster_path) {
    // Regular items - construct URL from base
    posterUrl = url.poster + safeData.poster_path;
  } else {
    // Fallback to placeholder
    posterUrl = PosterFallback;
  }

  // Handle both genre_ids (from list endpoints) and genres (from details endpoint)
  const genreIds = safeData.genre_ids 
    ? safeData.genre_ids.slice(0, 2)
    : safeData.genres?.map((g) => g.id).slice(0, 2) || [];

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(safeData.id));
    } else {
      dispatch(
        addToWatchlist({
          ...safeData,
          media_type: safeData.media_type || mediaType,
        })
      );
    }
  };

  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${safeData.media_type || mediaType}/${safeData.id}`)}
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={safeData.vote_average?.toFixed(1) || "0"} />
            <Genres data={genreIds} />
          </React.Fragment>
        )}
        <button
          className={`watchlistIcon ${isInWatchlist ? "active" : ""}`}
          onClick={handleWatchlistClick}
          title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isInWatchlist ? "♥" : "♡"}
        </button>
      </div>
      <div className="textBlock">
        <span className="title">{safeData.title}</span>
        <span className="date">
          {safeData.release_date ? dayjs(safeData.release_date).format("MMM D, YYYY") : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
