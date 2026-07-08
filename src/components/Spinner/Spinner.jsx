import React from "react";

import "./style.scss";

const Spinner = ({ initial }) => {
  return (
    <div className={`cinematic-spinner ${initial ? "initial" : ""}`}>
      <div className="spinner-reel">
        <div className="reel-ring">
          <div className="reel-hole" />
        </div>
        <div className="reel-stripes">
          {[...Array(12)].map((_, i) => (
            <div className="stripe" data-idx={i} key={i} />
          ))}
        </div>
      </div>
      <div className="spinner-text">
        <span className="text-label">LOADING</span>
        <span className="text-dots">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </span>
      </div>
      <div className="spinner-beam" />
    </div>
  );
};

export default Spinner;
