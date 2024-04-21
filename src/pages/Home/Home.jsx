import React from "react";
import "./style.scss";
import Popular from "./Popular/Popular";
import HeroBanner from "./heroBanner/HeroBanner";
import TopRated from "./TopRated/TopRated";
import Upcoming from "./Upcoming/Upcoming";
const Home = () => {
  return (
    <div className="homePage">
      <HeroBanner />
      <Upcoming />
      <Popular />
      <TopRated />
    </div>
  );
};

export default Home;
