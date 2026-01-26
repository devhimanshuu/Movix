import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import useFetch from "../../../hooks/useFetch";
import Img from "../../../components/lazyLoadImage/img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [featured, setFeatured] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);

  const { data, loading } = useFetch("/trending/movie/day");

  useEffect(() => {
    if (data?.results?.length > 0) {
      const featuredMovie = data.results[0];
      setFeatured(featuredMovie);
      const bg = url.backdrop + featuredMovie.backdrop_path;
      setBackground(bg);
    }
  }, [data, url.backdrop]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}

      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          {featured && (
            <div className="featuredContent">
              <span className="featuredLabel">Featured Today</span>
              <h1 className="title">{featured.title}</h1>
              <div className="rating">
                <span className="score">
                  ⭐ {featured.vote_average.toFixed(1)}
                </span>
                <span className="dot">•</span>
                <span className="date">
                  {featured.release_date?.split("-")[0]}
                </span>
              </div>
              <p className="description">{featured.overview}</p>
              <div className="bannerButtons">
                <button
                  className="watchBtn"
                  onClick={() => navigate(`/movie/${featured.id}`)}
                >
                  Watch Now
                </button>
              </div>
            </div>
          )}

          <div className="searchInput ">
            <input
              type="text"
              placeholder="Search for Movies or Tv shows..."
              onKeyUp={searchQueryHandler}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => query.length > 0 && navigate(`/search/${query}`)}
            >
              Search
            </button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
