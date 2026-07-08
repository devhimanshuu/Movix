import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";

const PageNotFound = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [counter, setCounter] = useState(0);

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

  return (
    <div className="cinematic-404">
      {/* Film Grain Overlay */}
      <div className="grain-overlay" />

      {/* Scanlines */}
      <div className="scanlines" />

      {/* TV Static Interference */}
      <div className="static-interference" />

      {/* Light Leak */}
      <div className="light-leak" />

      {/* Camera Flash on Load */}
      <div className="camera-flash" />

      {/* Film Counter */}
      <div className="film-counter">
        <span className="counter-number">{formatCounter(counter)}</span>
        <span className="counter-label">FT</span>
      </div>

      {/* Leader Countdown */}
      <div className="leader-countdown">
        <span className="leader-digit">3</span>
        <span className="leader-digit">2</span>
        <span className="leader-digit">1</span>
        <span className="leader-digit">▶</span>
      </div>

      {/* Floating Cinema Elements */}
      <div className="floating-elements">
        <div className="film-reel reel-1" />
        <div className="film-reel reel-2" />
        <div className="film-reel reel-3" />
        <div className="clapperboard" />

        {/* Filmstrip Frames */}
        <div className="filmstrip strip-1">
          {[...Array(12)].map((_, i) => (
            <div className="frame" key={i} />
          ))}
        </div>
        <div className="filmstrip strip-2">
          {[...Array(10)].map((_, i) => (
            <div className="frame" key={i} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`content ${showContent ? "visible" : ""}`}>
        {/* Searchlight */}
        <div className="searchlight" />

        {/* 404 with Glitch */}
        <div className="error-section">
          <div className="glitch-wrapper">
            <div className="glitch" data-text="404">404</div>
            <div className="glitch-shadow">404</div>
          </div>
          <div className="error-subtitle">
            <span className="reel-icon">🎬</span>
            <span className="subtitle-text">LOST IN THE CUT</span>
            <span className="reel-icon">🎬</span>
          </div>
        </div>

        {/* Message with Typewriter Effect */}
        <div className="message-section">
          <p className="message-line">
            This scene didn't make the final cut.
          </p>
          <p className="message-sub">
            The page you're looking for seems to have ended up on the
            cutting room floor.
          </p>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <button className="cinematic-btn primary" onClick={() => navigate("/home")}>
            <span className="btn-icon">◀</span>
            <span className="btn-text">Back to Main Feature</span>
          </button>
          <button className="cinematic-btn secondary" onClick={() => navigate(-1)}>
            <span className="btn-icon">↺</span>
            <span className="btn-text">Previous Scene</span>
          </button>
        </div>

        {/* Rating Badge */}
        <div className="rating-badge">
          <span className="stars">★ ★ ★ ★ ★</span>
          <span className="rating-text">Rated 404 - Not Found</span>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
