import React from "react";
import dayjs from "dayjs";
import { FaStar } from "react-icons/fa";

import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const Reviews = ({ data, loading }) => {
  // If loading or no results, we might handle differently, but let's check basic structure
  const reviews = data?.results || [];

  if (!loading && reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <div className="reviewsSection">
      <ContentWrapper>
        <div className="sectionHeading">Social Reviews</div>
        {!loading ? (
          <div className="reviews">
            {reviews.slice(0, 5).map((review) => {
              // Handle weird TMDB avatar paths
              let avatarUrl = review.author_details?.avatar_path;
              if (avatarUrl) {
                if (!avatarUrl.startsWith("http")) {
                  avatarUrl = `https://image.tmdb.org/t/p/original${avatarUrl}`;
                }
                // Some paths start with /https... (legacy gravy API issue in TMDB)
                if (avatarUrl.includes("/https")) {
                  avatarUrl = avatarUrl.substring(1);
                }
              }

              return (
                <div key={review.id} className="reviewCard">
                  <div className="author">
                    <div className="avatar">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={review.author} />
                      ) : (
                        <span>{review.author.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="info">
                      <div className="name">{review.author}</div>
                      <div className="date">
                        {dayjs(review.created_at).format("MMM D, YYYY")}
                      </div>
                    </div>
                    {review.author_details?.rating && (
                      <div className="rating">
                        <FaStar size={14} />
                        <span>{review.author_details.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="content">
                    <p>
                      {review.content.slice(0, 300)}
                      {review.content.length > 300 ? "..." : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="reviewsSkeleton">
            {/* Simple skeleton if needed, or just loading spinner from parent */}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Reviews;
