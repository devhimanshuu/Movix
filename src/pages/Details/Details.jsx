import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import DetailsBanner from "./DetailsBanner/DetailsBanner";
import Cast from "./Cast/Cast";
import VideosSection from "./VideoSection/VideoSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendations";
import { addToHistory } from "../../store/historySlice";

const Details = () => {
  const { mediaType, id } = useParams();
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  const detailsData = useFetch(`/${mediaType}/${id}`).data;

  // Track view in history when details page loads
  useEffect(() => {
    if (detailsData?.id) {
      // Construct the full poster URL while we have access to url
      const posterUrl = detailsData.poster_path
        ? url?.poster + detailsData.poster_path
        : null;

      dispatch(
        addToHistory({
          id: detailsData.id,
          title: detailsData.title || detailsData.name,
          name: detailsData.name,
          poster_path: detailsData.poster_path,
          posterUrl: posterUrl, // Store full URL for easy access
          media_type: mediaType,
          vote_average: detailsData.vote_average || 0,
          release_date: detailsData.release_date || detailsData.first_air_date,
          first_air_date: detailsData.first_air_date,
          genre_ids: detailsData.genres?.map((g) => g.id) || [],
          genres: detailsData.genres || [],
          backdrop_path: detailsData.backdrop_path,
        })
      );
    }
  }, [detailsData?.id, mediaType, dispatch, url]);

  return (
    <div>
      <DetailsBanner video={data?.results[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data} loading={loading} />
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  );
};

export default Details;
