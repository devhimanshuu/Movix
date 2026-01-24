import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromHistory, clearHistory } from "../../store/historySlice";
import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/MovieCard/MovieCard";
import PageNotFound from "../404/PageNotFound";

const WatchHistory = () => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history.items);

  const handleRemove = (id, mediaType) => {
    dispatch(removeFromHistory({ id, media_type: mediaType }));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire watch history?")) {
      dispatch(clearHistory());
    }
  };

  if (history.length === 0) {
    return <PageNotFound />;
  }

  return (
    <div className="watchHistoryPage">
      <ContentWrapper>
        <div className="historyHeader">
          <h1>Watch History</h1>
          <div className="historyStats">
            <span className="stat">
              Total Watched: <strong>{history.length}</strong>
            </span>
          </div>
        </div>

        <div className="filterSection">
          <button className="clearBtn" onClick={handleClearAll}>
            Clear All History
          </button>
        </div>

        <div className="historyGrid">
          {history.map((item) => (
            <div key={`${item.id}-${item.media_type}`} className="historyItem">
              <MovieCard data={item} mediaType={item.media_type} />
              <div className="watchedInfo">
                <span className="label">Watched:</span>
                <span className="date">
                  {new Date(item.watchedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <button
                className="removeBtn"
                onClick={() => handleRemove(item.id, item.media_type)}
                title="Remove from history"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default WatchHistory;
