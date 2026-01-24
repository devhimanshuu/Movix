import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setYearRange,
  setRatingRange,
  setMediaType,
  resetFilters,
} from "../../store/searchFiltersSlice";
import "./style.scss";

const SearchFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.searchFilters);
  const [showFilters, setShowFilters] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleYearChange = (min, max) => {
    dispatch(setYearRange({ min, max }));
  };

  const handleRatingChange = (min, max) => {
    dispatch(setRatingRange({ min, max }));
  };

  const handleMediaTypeChange = (type) => {
    dispatch(setMediaType(type));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="searchFilters">
      <button
        className="filterToggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        ⚙️ Filters {showFilters ? "▼" : "▶"}
      </button>

      {showFilters && (
        <div className="filterPanel">
          {/* Media Type Filter */}
          <div className="filterGroup">
            <label className="filterLabel">Type</label>
            <div className="filterOptions">
              <button
                className={`filterOption ${filters.mediaType === "all" ? "active" : ""}`}
                onClick={() => handleMediaTypeChange("all")}
              >
                All
              </button>
              <button
                className={`filterOption ${filters.mediaType === "movie" ? "active" : ""}`}
                onClick={() => handleMediaTypeChange("movie")}
              >
                Movies
              </button>
              <button
                className={`filterOption ${filters.mediaType === "tv" ? "active" : ""}`}
                onClick={() => handleMediaTypeChange("tv")}
              >
                TV Shows
              </button>
            </div>
          </div>

          {/* Year Range Filter */}
          <div className="filterGroup">
            <label className="filterLabel">
              Release Year: {filters.yearRange.min} - {filters.yearRange.max}
            </label>
            <div className="rangeInputs">
              <input
                type="number"
                min="1900"
                max={currentYear}
                value={filters.yearRange.min}
                onChange={(e) =>
                  handleYearChange(
                    Math.min(parseInt(e.target.value) || 1900, filters.yearRange.max),
                    filters.yearRange.max
                  )
                }
                className="rangeInput"
                placeholder="Min Year"
              />
              <span>-</span>
              <input
                type="number"
                min="1900"
                max={currentYear}
                value={filters.yearRange.max}
                onChange={(e) =>
                  handleYearChange(
                    filters.yearRange.min,
                    Math.max(parseInt(e.target.value) || currentYear, filters.yearRange.min)
                  )
                }
                className="rangeInput"
                placeholder="Max Year"
              />
            </div>
          </div>

          {/* Rating Range Filter */}
          <div className="filterGroup">
            <label className="filterLabel">
              Rating: {filters.ratingRange.min.toFixed(1)} - {filters.ratingRange.max.toFixed(1)}
            </label>
            <div className="sliderContainer">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.min}
                onChange={(e) =>
                  handleRatingChange(
                    Math.min(parseFloat(e.target.value), filters.ratingRange.max),
                    filters.ratingRange.max
                  )
                }
                className="slider"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.max}
                onChange={(e) =>
                  handleRatingChange(
                    filters.ratingRange.min,
                    Math.max(parseFloat(e.target.value), filters.ratingRange.min)
                  )
                }
                className="slider"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button className="resetBtn" onClick={handleReset}>
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
