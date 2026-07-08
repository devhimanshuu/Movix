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
import LanguageSection from "./LanguageSections/LanguageSection";
import languages from "../../data/languages";

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

      {languages.map(({ title, code }) => (
        <LanguageSection key={code} title={title} languageCode={code} />
      ))}
    </div>
  );
};

export default Home;
