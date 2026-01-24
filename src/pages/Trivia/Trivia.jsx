import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaFire } from "react-icons/fa";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import { fetchDataFromApi } from "../../utils/api";
import Spinner from "../../components/Spinner/Spinner";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const Trivia = () => {
  const { url } = useSelector((state) => state.home);
  const [loading, setLoading] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Initial load
  useEffect(() => {
    loadNewQuestion();
  }, []);

  const generateOptions = (correctYear) => {
    const year = parseInt(correctYear);
    const opts = new Set([year]);

    while (opts.size < 4) {
      // Random offset between -5 and +5, excluding 0
      const offset = Math.floor(Math.random() * 11) - 5;
      if (offset !== 0) {
        opts.add(year + offset);
      }
    }

    return Array.from(opts).sort((a, b) => a - b);
  };

  const loadNewQuestion = useCallback(async () => {
    setLoading(true);
    setShowResult(false);
    setSelectedOption(null);

    try {
      // Fetch a random page of popular movies (1-50)
      const randomPage = Math.floor(Math.random() * 50) + 1;
      const res = await fetchDataFromApi(
        `/discover/movie?sort_by=vote_count.desc&page=${randomPage}`,
      );

      if (res?.results?.length) {
        // Filter for movies with valid dates
        const validMovies = res.results.filter((m) => m.release_date);
        if (validMovies.length > 0) {
          const randomMovie =
            validMovies[Math.floor(Math.random() * validMovies.length)];
          const correctYear = randomMovie.release_date.split("-")[0];

          setCurrentMovie(randomMovie);
          setCorrectOption(parseInt(correctYear));
          setOptions(generateOptions(correctYear));
        }
      }
    } catch (error) {
      console.error("Error loading trivia:", error);
    }

    setLoading(false);
  }, []);

  const handleAnswer = (year) => {
    setSelectedOption(year);
    if (year === correctOption) {
      setStreak((s) => s + 1);
    } else {
      // We'll show the result state, but streak resets on next question load if we wanted strict mode
      // For now, let's reset streak immediately on wrong answer to show stakes
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    loadNewQuestion();
  };

  if (loading && !currentMovie) {
    return (
      <div className="triviaPage">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="triviaPage">
      <ContentWrapper>
        <div className="header">
          <h1>Movie Trivia</h1>
          <p>Test your film knowledge!</p>
        </div>

        <div className="gameContainer">
          <div className="streakCounter">
            <FaFire /> Streak: {streak}
          </div>

          {!loading && currentMovie ? (
            <div className="questionSection">
              <div className="posterArea">
                <Img
                  src={
                    currentMovie.poster_path
                      ? url.poster + currentMovie.poster_path
                      : PosterFallback
                  }
                />
              </div>

              <div className="questionText">
                What year was <strong>{currentMovie.title}</strong> released?
              </div>

              <div className="optionsGrid">
                {options.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleAnswer(year)}
                    disabled={selectedOption !== null}
                    className={`
                                            ${selectedOption !== null && year === correctOption ? "correct" : ""}
                                            ${selectedOption === year && year !== correctOption ? "wrong" : ""}
                                        `}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="loading">Loading question...</div>
          )}

          {selectedOption !== null && (
            <div className="resultOverlay">
              <h2 className={selectedOption === correctOption ? "win" : "lose"}>
                {selectedOption === correctOption ? "Correct!" : "Oops!"}
              </h2>
              <p className="score">
                {" "}
                {selectedOption === correctOption
                  ? "Keep the streak alive!"
                  : `The answer was ${correctOption}`}
              </p>
              <button className="nextBtn" onClick={nextQuestion}>
                Next Question
              </button>
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Trivia;
