import React from "react";
import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import Upcoming from "./Upcoming/Upcoming";
const Home = () => {
  return (
    <div className="homePage">
      <HeroBanner />
      <Upcoming />
      <div style={{ height: 1000 }}></div>
    </div>
  );
};

export default Home;
