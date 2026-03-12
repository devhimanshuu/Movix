import React from "react";
import "./style.scss";
import Popular from "./Popular/Popular";
import HeroBanner from "./heroBanner/HeroBanner";
import TopRated from "./TopRated/TopRated";
import Trending from "./Trending/Trending";
import InTheatre from "./InTheatre/InTheatre";
import ContinueWatching from "./ContinueWatching/ContinueWatching";
import ContinueWatchingReminder from "../../components/ContinueWatchingReminder/ContinueWatchingReminder";
import InteractiveSection from "./InteractiveSection/InteractiveSection";

const Home = () => {
  return (
    <div className="homePage">
      <HeroBanner />
      <InteractiveSection />
      <ContinueWatchingReminder />
      <ContinueWatching />
      <InTheatre />
      <Trending />
      <Popular />
      <TopRated />
    </div>
  );
};

export default Home;
