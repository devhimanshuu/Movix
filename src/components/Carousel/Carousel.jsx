import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../store/watchlistSlice";
import {
  addToComparison,
  removeFromComparison,
} from "../../store/comparisonSlice";

import "./style.scss";

const Carousel = ({ data, loading, endpoint, title }) => {
  const carouselContainer = useRef();
  const { url } = useSelector((state) => state.home);
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.items);
  const comparison = useSelector((state) => state.comparison.items);
  const navigate = useNavigate();

  const touchRef = useRef({ startX: 0, scrollLeft: 0, isDragging: false, lastX: 0, lastTime: 0, velocityX: 0 });
  const momentumRef = useRef(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const hasSwipedRef = useRef(false);

  useEffect(() => {
    if (!loading && data?.length > 0 && window.innerWidth < 768) {
      const timer = setTimeout(() => setShowSwipeHint(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, data?.length]);

  const navigation = (dir) => {
    const container = carouselContainer.current;

    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const applyMomentum = useCallback(() => {
    const container = carouselContainer.current;
    if (!container || !touchRef.current.velocityX) return;

    let velocity = touchRef.current.velocityX;
    const friction = 0.95;
    const threshold = 0.5;

    const animate = () => {
      if (Math.abs(velocity) < threshold) {
        touchRef.current.velocityX = 0;
        return;
      }

      container.scrollLeft += velocity;
      velocity *= friction;
      touchRef.current.velocityX = velocity;
      momentumRef.current = requestAnimationFrame(animate);
    };

    momentumRef.current = requestAnimationFrame(animate);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
    if (!hasSwipedRef.current) {
      hasSwipedRef.current = true;
      setShowSwipeHint(false);
    }
    const container = carouselContainer.current;
    const now = Date.now();
    touchRef.current = {
      startX: e.touches[0].pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
      isDragging: true,
      lastX: e.touches[0].pageX,
      lastTime: now,
      velocityX: 0,
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchRef.current.isDragging) return;
    const container = carouselContainer.current;
    const now = Date.now();
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (touchRef.current.startX - x) * 1.5;
    container.scrollLeft = touchRef.current.scrollLeft + walk;

    const dt = now - touchRef.current.lastTime;
    if (dt > 0) {
      const dx = e.touches[0].pageX - touchRef.current.lastX;
      touchRef.current.velocityX = -(dx / dt) * 15;
    }
    touchRef.current.lastX = e.touches[0].pageX;
    touchRef.current.lastTime = now;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current.isDragging = false;
    if (Math.abs(touchRef.current.velocityX) > 1) {
      applyMomentum();
    } else {
      touchRef.current.velocityX = 0;
    }
  }, [applyMomentum]);

  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />
        {!loading ? (
          <>
            {showSwipeHint && (
              <div className="swipeHint">
                <span className="swipeHintText">Swipe to explore</span>
                <span className="swipeHintArrow">→</span>
              </div>
            )}
            <div className="carouselItems" ref={carouselContainer} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {data?.map((item) => {
              const posterUrl = item.poster_path
                ? url.poster + item.poster_path
                : PosterFallback;
              return (
                <div
                  key={item.id}
                  className="carouselItem"
                  onClick={() =>
                    navigate(`/${item.media_type || endpoint}/${item.id}`)
                  }
                >
                  <div className="posterBlock">
                    <Img src={posterUrl} />
                    <CircleRating rating={item.vote_average.toFixed(1)} />
                    <Genres data={item.genre_ids.slice(0, 2)} />
                    <button
                      className={`watchlistIcon ${watchlist.some((i) => i.id === item.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (watchlist.some((i) => i.id === item.id)) {
                          dispatch(removeFromWatchlist(item.id));
                        } else {
                          dispatch(
                            addToWatchlist({
                              ...item,
                              media_type: item.media_type || endpoint,
                            }),
                          );
                        }
                      }}
                    >
                      {watchlist.some((i) => i.id === item.id) ? "♥" : "♡"}
                    </button>
                    <button
                      className={`compareIcon ${comparison.some((i) => i.id === item.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (comparison.some((i) => i.id === item.id)) {
                          dispatch(removeFromComparison(item.id));
                        } else {
                          dispatch(
                            addToComparison({
                              ...item,
                              media_type: item.media_type || endpoint,
                            }),
                          );
                        }
                      }}
                    >
                      ⚖
                    </button>
                  </div>
                  <div className="textBlock">
                    <span className="title">{item.title || item.name}</span>
                    <span className="date">
                      {dayjs(item.release_date || item.first_air_date).format(
                        "MMM D, YYYY",
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            </div>
          </>
        ) : (
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;
