import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Carousel from "../../components/Carousel/Carousel";
import Spinner from "../../components/Spinner/Spinner";

import "./style.scss";

const moods = [
  {
    id: "happy",
    label: "Feel Good",
    icon: "😊",
    params: {
      with_genres: "35,10751",
      sort_by: "vote_average.desc",
      "vote_count.gte": 300,
    },
  },
  {
    id: "thrill",
    label: "Thrill Me",
    icon: "😨",
    params: {
      with_genres: "53,27",
      sort_by: "popularity.desc",
      "vote_count.gte": 300,
    },
  },
  {
    id: "action",
    label: "Adrenaline",
    icon: "🔥",
    params: { with_genres: "28,12", sort_by: "popularity.desc" },
  },
  {
    id: "romantic",
    label: "Romantic",
    icon: "💕",
    params: { with_genres: "10749", sort_by: "popularity.desc" },
  },
  {
    id: "cry",
    label: "Cry With Me",
    icon: "😭",
    params: {
      with_genres: "18",
      with_keywords: "3364",
      sort_by: "vote_average.desc",
      "vote_count.gte": 500,
    }, // keyword for 'sadness' or similar often tricky, utilizing Drama + High Rating usually works
  },
  {
    id: "mind",
    label: "Mind Benders",
    icon: "🤯",
    params: {
      with_genres: "878,9648",
      sort_by: "vote_average.desc",
      "vote_count.gte": 1000,
    },
  },
  {
    id: "nostalgia",
    label: "Nostalgia Trip",
    icon: "📼",
    params: {
      "primary_release_date.gte": "1980-01-01",
      "primary_release_date.lte": "1999-12-31",
      sort_by: "vote_average.desc",
      "vote_count.gte": 1000,
    },
  },
  {
    id: "family",
    label: "Family Time",
    icon: "👨‍👩‍👧‍👦",
    params: { with_genres: "10751,16", sort_by: "popularity.desc" },
  },
  {
    id: "gritty",
    label: "Dark & Gritty",
    icon: "🌃",
    params: {
      with_genres: "80,18",
      sort_by: "vote_average.desc",
      "vote_count.gte": 500,
    },
  },
  {
    id: "epic",
    label: "Epic Journey",
    icon: "⚔️",
    params: {
      with_genres: "12,14",
      "with_runtime.gte": 140,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "learn",
    label: "Learn Something",
    icon: "🧠",
    params: {
      with_genres: "99,36",
      sort_by: "vote_average.desc",
      "vote_count.gte": 100,
    },
  },
  {
    id: "gems",
    label: "Hidden Gems",
    icon: "💎",
    params: {
      "vote_average.gte": 8,
      "vote_count.lte": 3000,
      "vote_count.gte": 300,
      sort_by: "popularity.desc",
    },
  },
];

const Moodify = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMoodData = async (mood) => {
    setLoading(true);
    setSelectedMood(mood);
    try {
      // We use discover API with specific params
      const res = await fetchDataFromApi("/discover/movie", mood.params);
      setData(res?.results || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Set default mood on load
  useEffect(() => {
    fetchMoodData(moods[0]);
  }, []);

  return (
    <div className="moodifyPage">
      <ContentWrapper>
        <div className="sectionHeading">How are you feeling today?</div>

        <div className="moodGrid">
          {moods.map((mood) => (
            <div
              key={mood.id}
              className={`moodCard ${selectedMood?.id === mood.id ? "active" : ""}`}
              onClick={() => fetchMoodData(mood)}
            >
              <span className="icon">{mood.icon}</span>
              <span className="label">{mood.label}</span>
            </div>
          ))}
        </div>

        {selectedMood && (
          <>
            <div className="sectionHeading">
              Movies for "{selectedMood.label}" Mood
            </div>
            {!loading ? (
              <Carousel data={data} loading={loading} endpoint="movie" />
            ) : (
              <Spinner initial={true} />
            )}
          </>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Moodify;
