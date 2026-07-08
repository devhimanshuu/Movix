import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";

import "./cinematicState.scss";

const CinematicState = ({
  title = "NOTHING HERE",
  subtitle = "This section is currently empty.",
  message = "The content you're looking for seems to be missing from the reel.",
  icon = "🎬",
  badgeLabel = "EMPTY SCENE",
  showSearch = false,
  showHomeButton = true,
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [counter, setCounter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCounter = (num) => String(num).padStart(2, "0");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
    }
  };

  return (
    <div className="cinematic-state">
      {/* Film Grain Overlay */}
      <div className="grain-overlay" />

      {/* Scanlines */}
      <div className="scanlines" />

      {/* Light Leak */}
      <div className="light-leak" />

      {/* Camera Flash */}
      <div className="camera-flash" />

      {/* Film Counter */}
      <div className="film-counter">
        <span className="counter-number">{formatCounter(counter)}</span>
        <span className="counter-label">FT</span>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="film-reel reel-1" />
        <div className="film-reel reel-2" />
        <div className="film-reel reel-3" />
      </div>

      {/* Main Content */}
      <div className={`content ${showContent ? "visible" : ""}`}>
        {/* Badge */}
        <div className="state-badge">
          <span className="badge-dot" />
          {badgeLabel}
        </div>

        {/* Icon */}
        <div className="state-icon-wrapper">
          <span className="state-icon">{icon}</span>
        </div>

        {/* Title */}
        <h1 className="state-title">{title}</h1>

        {/* Subtitle */}
        <p className="state-subtitle">{subtitle}</p>

        {/* Message */}
        <p className="state-message">{message}</p>

        {/* Search */}
        {showSearch && (
          <div className="search-section">
            <div className="search-box">
              <HiOutlineSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search movies & TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKey}
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="actions-section">
          {showHomeButton && (
            <button
              className="cinematic-btn primary"
              onClick={() => navigate("/home")}
            >
              <span className="btn-icon">◀</span>
              <span className="btn-text">Back to Main Feature</span>
            </button>
          )}
          {showBackButton && (
            <button
              className="cinematic-btn secondary"
              onClick={() => navigate(-1)}
            >
              <span className="btn-icon">↺</span>
              <span className="btn-text">Previous Scene</span>
            </button>
          )}
        </div>

        {/* Rating Badge */}
        <div className="rating-badge">
          <span className="stars">★ ★ ★ ★ ★</span>
          <span className="rating-text">Rated — Empty Scene</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicState;
