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
  const [gameMode, setGameMode] = useState("year"); // 'year' or 'silhouette'

  // Initial load
  useEffect(() => {
    loadNewQuestion();
  }, []);

  const generateOptions = (correctVal, type) => {
    if (type === "year") {
      const year = parseInt(correctVal);
      const opts = new Set([year]);
      while (opts.size < 4) {
        const offset = Math.floor(Math.random() * 11) - 5;
        if (offset !== 0) opts.add(year + offset);
      }
      return Array.from(opts).sort((a, b) => a - b);
    } else {
      // For silhouette mode, we'll pass the options from loadNewQuestion
      return correctVal;
    }
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
        const validMovies = res.results.filter((m) => m.release_date && m.poster_path);
        if (validMovies.length > 5) {
          const randomIdx = Math.floor(Math.random() * validMovies.length);
          const randomMovie = validMovies[randomIdx];

          // Decide mode randomly or stay with current
          const newMode = Math.random() > 0.5 ? "year" : "silhouette";
          setGameMode(newMode);

          if (newMode === "year") {
            const correctYear = randomMovie.release_date.split("-")[0];
            setCurrentMovie(randomMovie);
            setCorrectOption(parseInt(correctYear));
            setOptions(generateOptions(correctYear, "year"));
          } else {
            // Silhouette mode: Guess Title
            const correctTitle = randomMovie.title;
            const distractorIndices = new Set();
            while (distractorIndices.size < 3) {
              const idx = Math.floor(Math.random() * validMovies.length);
              if (idx !== randomIdx) distractorIndices.add(idx);
            }
            const opts = [
              correctTitle,
              ...Array.from(distractorIndices).map((i) => validMovies[i].title),
            ].sort(() => Math.random() - 0.5);

            setCurrentMovie(randomMovie);
            setCorrectOption(correctTitle);
            setOptions(opts);
          }
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
              <div className={`posterArea ${gameMode === "silhouette" && selectedOption === null ? "silhouette" : ""}`}>
                <Img
                  src={
                    currentMovie.poster_path
                      ? url.poster + currentMovie.poster_path
                      : PosterFallback
                  }
                />
              </div>

              <div className="questionText">
                {gameMode === "year" ? (
                  <>What year was <strong>{currentMovie.title}</strong> released?</>
                ) : (
                  <>Can you name this movie from its <strong>silhouette</strong>?</>
                )}
              </div>

              <div className="optionsGrid">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedOption !== null}
                    className={`
                                            ${selectedOption !== null && opt === correctOption ? "correct" : ""}
                                            ${selectedOption === opt && opt !== correctOption ? "wrong" : ""}
                                        `}
                  >
                    {opt}
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
