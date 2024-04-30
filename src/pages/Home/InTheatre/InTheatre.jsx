import React, { useState } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Carousel from "../../../components/Carousel/Carousel";

import useFetch from "../../../hooks/useFetch";

const InTheatre = () => {
  const [endPoint] = useState("movie");

  const { data, loading } = useFetch(`/${endPoint}/now_playing`);

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">Now in Theatres</span>
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={endPoint} />
    </div>
  );
};

export default InTheatre;
