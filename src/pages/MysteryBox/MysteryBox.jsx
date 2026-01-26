import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaPlus, FaCheck, FaSyncAlt } from "react-icons/fa";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import { fetchDataFromApi } from "../../utils/api";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../store/watchlistSlice";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const MysteryBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const watchlist = useSelector((state) => state.watchlist.items);

  const [status, setStatus] = useState("idle"); // idle, shaking, opened
  const [randomMovie, setRandomMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const openBox = async () => {
    if (status !== "idle") return;

    setStatus("shaking");
    setLoading(true);

    try {
      // Fetch a random page from top rated movies (1-20)
      const randomPage = Math.floor(Math.random() * 20) + 1;
      const res = await fetchDataFromApi(`/movie/top_rated?page=${randomPage}`);

      if (res?.results?.length) {
        const movies = res.results;
        const picked = movies[Math.floor(Math.random() * movies.length)];
        setRandomMovie(picked);
      }
    } catch (error) {
      console.error("Error fetching surprise movie:", error);
    }

    setTimeout(() => {
      setStatus("opened");
      setLoading(false);
    }, 1500);
  };

  const resetBox = () => {
    setStatus("idle");
    setRandomMovie(null);
  };

  const isInWatchlist = watchlist.some((item) => item.id === randomMovie?.id);

  const handleWatchlist = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(randomMovie.id));
    } else {
      dispatch(addToWatchlist({ ...randomMovie, media_type: "movie" }));
    }
  };

  return (
    <div className="mysteryBoxPage">
      <ContentWrapper>
        <div className="titleSection">
          <h1>The Mystery Box</h1>
          <p>
            Can't decide what to watch? Let the box choose your next favorite
            movie!
          </p>
        </div>

        <div
          className={`boxContainer ${status === "shaking" ? "opening" : ""}`}
          onClick={openBox}
        >
          <div className={`box ${status === "opened" ? "opened" : ""}`}>
            <div className="face front">?</div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face bottom"></div>
            <div className={`lid ${status === "opened" ? "open" : ""}`}>?</div>
          </div>
        </div>

        <div
          className={`revealedContent ${status === "opened" ? "visible" : ""}`}
        >
          {randomMovie && (
            <div className="movieCardRevealed">
              <div className="posterArea">
                <Img
                  src={
                    randomMovie.poster_path
                      ? url.poster + randomMovie.poster_path
                      : PosterFallback
                  }
                />
              </div>
              <div className="infoArea">
                <h2>{randomMovie.title}</h2>
                <div className="meta">
                  <div className="rating">
                    <FaStar />
                    <span>{randomMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="year">
                    {randomMovie.release_date?.split("-")[0]}
                  </div>
                </div>
                <p className="overview">{randomMovie.overview}</p>
                <div className="btnRow">
                  <button
                    className="btn"
                    onClick={() => navigate(`/movie/${randomMovie.id}`)}
                  >
                    Go to Details
                  </button>
                  <button
                    className="btn"
                    style={{
                      background: isInWatchlist ? "#17a2b8" : "var(--gradient)",
                    }}
                    onClick={handleWatchlist}
                  >
                    {isInWatchlist ? <FaCheck /> : <FaPlus />}
                    {isInWatchlist ? "Added" : "Add to List"}
                  </button>
                </div>
              </div>
            </div>
          )}
          <button className="resetBtn" onClick={resetBox}>
            <FaSyncAlt /> Try Again
          </button>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default MysteryBox;
