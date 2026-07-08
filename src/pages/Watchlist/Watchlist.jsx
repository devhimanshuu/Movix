import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWatchlist, clearWatchlist } from "../../store/watchlistSlice";
import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/MovieCard/MovieCard";
import CinematicState from "../404/CinematicState";

const Watchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.items);
  const [filter, setFilter] = useState("all");

  const handleRemove = (id) => {
    dispatch(removeFromWatchlist(id));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      dispatch(clearWatchlist());
    }
  };

  const movies = watchlist.filter((item) => item.media_type === "movie");
  const tvShows = watchlist.filter((item) => item.media_type === "tv");

  let displayItems = watchlist;
  if (filter === "movies") {
    displayItems = movies;
  } else if (filter === "tv") {
    displayItems = tvShows;
  }

  return (
    <div className="watchlistPage">
      {watchlist.length === 0 ? (
        <CinematicState
          title="Empty Watchlist"
          subtitle="Nothing added to your watchlist yet."
          message="Start exploring movies and TV shows and add them to your watchlist for later."
          icon="🎥"
          badgeLabel="WATCHLIST EMPTY"
          showSearch={false}
        />
      ) : (
        <ContentWrapper>
          <div className="watchlistHeader">
            <h1>My Watchlist</h1>
            <div className="watchlistStats">
              <span className="stat">
                Total: <strong>{watchlist.length}</strong>
              </span>
              <span className="stat">
                Movies: <strong>{movies.length}</strong>
              </span>
              <span className="stat">
                TV Shows: <strong>{tvShows.length}</strong>
              </span>
            </div>
          </div>

          <div className="filterSection">
            <div className="filterButtons">
              <button
                className={`filterBtn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({watchlist.length})
              </button>
              <button
                className={`filterBtn ${filter === "movies" ? "active" : ""}`}
                onClick={() => setFilter("movies")}
              >
                Movies ({movies.length})
              </button>
              <button
                className={`filterBtn ${filter === "tv" ? "active" : ""}`}
                onClick={() => setFilter("tv")}
              >
                TV Shows ({tvShows.length})
              </button>
            </div>
            <button className="clearBtn" onClick={handleClearAll}>
              Clear All
            </button>
          </div>

          {displayItems.length === 0 ? (
            <CinematicState
              title={`No ${filter !== "all" ? filter : "Items"}`}
              subtitle={`You don't have any ${filter !== "all" ? filter : "items"} in your watchlist.`}
              message="Try switching to a different category or add new titles to your watchlist."
              icon="🎬"
              badgeLabel="FILTERED"
              showSearch={false}
              showHomeButton={false}
              showBackButton={false}
            />
          ) : (
            <div className="watchlistGrid">
              {displayItems.map((item) => (
                <div key={item.id} className="watchlistItem">
                  <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                    <MovieCard data={item} mediaType={item.media_type} />
                    <button
                      className="removeBtn"
                      onClick={() => handleRemove(item.id)}
                      title="Remove from watchlist"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default Watchlist;
