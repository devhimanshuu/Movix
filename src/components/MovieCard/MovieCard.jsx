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
  
  const isInWatchlist = watchlist.some((item) => item.id === data.id);
  
  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;

  // Handle both genre_ids (from list endpoints) and genres (from details endpoint)
  const genreIds = data.genre_ids 
    ? data.genre_ids.slice(0, 2)
    : data.genres?.map((g) => g.id).slice(0, 2) || [];

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(data.id));
    } else {
      dispatch(
        addToWatchlist({
          ...data,
          media_type: mediaType || data.media_type,
        })
      );
    }
  };

  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${data.media_type || mediaType}/${data.id}`)}
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.vote_average?.toFixed(1) || "0"} />
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
        <span className="title">{data.title || data.name}</span>
        <span className="date">
          {data.release_date ? dayjs(data.release_date).format("MMM D, YYYY") : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
