import React, { useState } from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import LanguageSection from "../Home/LanguageSections/LanguageSection";
import languages, { regions } from "../../data/languages";
import "./style.scss";

const allRegions = ["All", ...regions];

const RegionalCinema = () => {
  const [activeRegion, setActiveRegion] = useState("All");

  const filteredLanguages =
    activeRegion === "All"
      ? languages
      : languages.filter((l) => l.region === activeRegion);

  return (
    <div className="regionalCinemaPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>Regional Cinema</h1>
          <p className="subtitle">
            Discover films and TV shows from around the world
          </p>
        </div>

        <div className="regionTabs">
          {allRegions.map((region) => (
            <button
              key={region}
              className={`regionTab ${activeRegion === region ? "active" : ""}`}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="languageSections">
          {filteredLanguages.map(({ title, code }) => (
            <LanguageSection key={code} title={title} languageCode={code} />
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default RegionalCinema;
