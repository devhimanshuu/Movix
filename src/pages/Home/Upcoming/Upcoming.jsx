import React, { useState } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Carousel from "../../../components/Carousel/Carousel";
import "./style.scss";
import { fetchDataFromApi } from "../../../utils/api";
import SwitchTab from "../../../components/SwichTab/SwitchTab";
import useFetch from "../../../hooks/useFetch";

const Upcoming = () => {
  const [endPoint, setEndPoint] = useState("day");

  const { data, loading } = useFetch(`/movie/upcoming`);

  const onTabChange = (Tab) => {
    setEndPoint(tab === "Day" ? "day" : "week");
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">Upcoming</span>
        <SwitchTab data={["Day", "Week"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} />
    </div>
  );
};

export default Upcoming;
