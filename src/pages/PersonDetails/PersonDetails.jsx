import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import Carousel from "../../components/Carousel/Carousel";
import useFetch from "../../hooks/useFetch";
import avatar from "../../assets/avatar.png";

const PersonDetails = () => {
  const { id } = useParams();
  const { url } = useSelector((state) => state.home);

  // Fetch person details
  const { data: data, loading } = useFetch(`/person/${id}`);

  // Fetch person credits (movies + tv)
  const { data: credits, loading: creditsLoading } = useFetch(
    `/person/${id}/combined_credits`,
  );

  const [knownFor, setKnownFor] = useState([]);

  useEffect(() => {
    if (credits?.cast) {
      // Sort by vote_count to show most popular works
      const sorted = [...credits.cast].sort(
        (a, b) => b.vote_count - a.vote_count,
      );
      // Remove duplicates (sometimes api returns same movie for different roles)
      const unique = sorted.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );
      setKnownFor(unique);
    }
  }, [credits]);

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  return (
    <div className="personDetailsPage">
      <ContentWrapper>
        {!loading ? (
          <>
            {data && (
              <div className="detailsBanner">
                <div className="content">
                  <div className="left">
                    {data.profile_path ? (
                      <Img
                        className="posterImg"
                        src={url.profile + data.profile_path}
                      />
                    ) : (
                      <Img className="posterImg" src={avatar} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">{data.name}</div>
                    <div className="subtitle">{data.place_of_birth}</div>

                    <div className="row">
                      {data.birthday && (
                        <div className="info">
                          <div className="infoItem">
                            <span className="text bold">Born: </span>
                            <span className="text">
                              {dayjs(data.birthday).format("MMM D, YYYY")}
                            </span>
                          </div>
                        </div>
                      )}
                      {data.deathday && (
                        <div className="info">
                          <div className="infoItem">
                            <span className="text bold">Died: </span>
                            <span className="text">
                              {dayjs(data.deathday).format("MMM D, YYYY")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {data.biography && (
                      <div className="overview">
                        <div className="heading">Biography</div>
                        <div className="description">{data.biography}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="detailsBannerSkeleton">
            {/* Add Skeleton Loading Here if needed, for now just empty or simple text */}
            <div className="content">
              <div className="left skeleton"></div>
              <div className="right">
                <div className="row skeleton"></div>
                <div className="row skeleton"></div>
              </div>
            </div>
          </div>
        )}
      </ContentWrapper>

      <div className="knownForSection">
        <ContentWrapper>
          {knownFor.length > 0 && (
            <Carousel
              title="Known For"
              data={knownFor}
              loading={creditsLoading}
              endpoint="movie" // Default to movie, but mixed content might need handling in Carousel
            />
          )}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default PersonDetails;
