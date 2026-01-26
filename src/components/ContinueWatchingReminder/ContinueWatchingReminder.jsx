import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

import Img from "../lazyLoadImage/img";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const ContinueWatchingReminder = () => {
  const navigate = useNavigate();
  const history = useSelector((state) => state.history.items);
  const [visible, setVisible] = useState(true);

  // Get the most recent item from history
  const lastMovie = history?.[history.length - 1];

  if (!lastMovie || !visible) return null;

  const handleNavigate = () => {
    navigate(`/${lastMovie.media_type}/${lastMovie.id}`);
  };

  return (
    <div className="continueWatchingReminder">
      <div className="reminderCard" onClick={handleNavigate}>
        <button
          className="closeBtn"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
        >
          <IoClose size={16} />
        </button>
        <div className="posterArea">
          <Img
            src={
              lastMovie.posterUrl || lastMovie.poster_path
                ? lastMovie.posterUrl ||
                  `https://image.tmdb.org/t/p/w200${lastMovie.poster_path}`
                : PosterFallback
            }
          />
        </div>
        <div className="infoArea">
          <span className="label">Resume Watching</span>
          <span className="title">{lastMovie.title || lastMovie.name}</span>
          <span className="subText">Click to continue</span>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingReminder;
