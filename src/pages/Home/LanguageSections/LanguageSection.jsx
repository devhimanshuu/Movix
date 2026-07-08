import React, { useState } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Carousel from "../../../components/Carousel/Carousel";
import SwitchTab from "../../../components/SwichTab/SwitchTab";
import useFetch from "../../../hooks/useFetch";

const LanguageSection = ({ title, languageCode }) => {
  const [endPoint, setEndPoint] = useState("movie");

  const { data, loading } = useFetch(
    `/discover/${endPoint}?with_original_language=${languageCode}&sort_by=popularity.desc`
  );

  const onTabChange = (tab) => {
    setEndPoint(tab === "Movies" ? "movie" : "tv");
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">{title}</span>
        <SwitchTab data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={endPoint} />
    </div>
  );
};

export default LanguageSection;
