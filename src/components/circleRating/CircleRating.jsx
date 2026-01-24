import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./style.scss";

const CircleRating = ({ rating }) => {
  const getPathColor = () => {
    if (rating < 5) return "red";
    if (rating < 7) return "orange";
    return "green";
  };

  return (
    <div className="circleRating">
      <CircularProgressbar
        value={rating}
        maxValue={10}
        text={`${rating}`}
        strokeWidth={4}
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: "round",
          pathColor: getPathColor(),
          textColor: "#ffffff",
          textSize: "38px",
          fontWeight: "bold",
          trailColor: "rgba(255, 255, 255, 0.15)",
        })}
      />
    </div>
  );
};

export default CircleRating;
