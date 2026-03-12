import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaFire, FaTrophy, FaClock, FaRedo, FaBolt } from "react-icons/fa";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import { fetchDataFromApi } from "../../utils/api";
import Spinner from "../../components/Spinner/Spinner";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const DIFFICULTY_LEVELS = [
  { key: "easy", label: "Easy", icon: "😌", pages: 10, description: "Popular movies everyone knows" },
  { key: "medium", label: "Medium", icon: "🤔", pages: 30, description: "A mix of popular and classic films" },
  { key: "hard", label: "Hard", icon: "🥵", pages: 50, description: "Deep cuts and hidden gems" },
];

const GAME_MODES = [
  { key: "year", label: "Guess the Year", icon: "📅", description: "When was this movie released?" },
  { key: "silhouette", label: "Silhouette Mode", icon: "🎭", description: "Name the movie from its shadow" },
  { key: "rating", label: "Higher or Lower", icon: "📊", description: "Which movie has a higher rating?" },
  { key: "tagline", label: "Tagline Challenge", icon: "💬", description: "Match the tagline to the movie" },
];

const Trivia = () => {
  const { url } = useSelector((state) => state.home);
  const [loading, setLoading] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    return parseInt(localStorage.getItem("trivia_best_streak") || "0");
  });
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // For "Higher or Lower" mode
  const [compareMovie, setCompareMovie] = useState(null);

  // For "Tagline" mode
  const [movieTagline, setMovieTagline] = useState("");

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0 && currentMovie && selectedOption === null) {
      // Time's up — auto fail
      handleAnswer(null);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Save best streak
  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem("trivia_best_streak", streak.toString());
    }
  }, [streak]);

  const getTimerForDifficulty = (diff) => {
    switch (diff) {
      case "easy": return 20;
      case "medium": return 15;
      case "hard": return 10;
      default: return 20;
    }
  };

  const generateYearOptions = (correctYear) => {
    const year = parseInt(correctYear);
    const opts = new Set([year]);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 11) - 5;
      if (offset !== 0) opts.add(year + offset);
    }
    return Array.from(opts).sort((a, b) => a - b);
  };

  const startGame = (mode, diff) => {
    setGameMode(mode);
    setDifficulty(diff);
    setGameStarted(true);
    setStreak(0);
    setTotalCorrect(0);
    setTotalPlayed(0);
    loadNewQuestion(mode, diff);
  };

  const loadNewQuestion = useCallback(async (mode = gameMode, diff = difficulty) => {
    setLoading(true);
    setSelectedOption(null);
    setShowConfetti(false);

    const maxPages = DIFFICULTY_LEVELS.find((d) => d.key === diff)?.pages || 30;

    try {
      const randomPage = Math.floor(Math.random() * maxPages) + 1;
      const res = await fetchDataFromApi(
        `/discover/movie?sort_by=vote_count.desc&page=${randomPage}`
      );

      if (res?.results?.length) {
        const validMovies = res.results.filter((m) => m.release_date && m.poster_path);

        if (validMovies.length > 5) {
          const randomIdx = Math.floor(Math.random() * validMovies.length);
          const randomMovie = validMovies[randomIdx];

          if (mode === "year") {
            const correctYear = randomMovie.release_date.split("-")[0];
            setCurrentMovie(randomMovie);
            setCorrectOption(parseInt(correctYear));
            setOptions(generateYearOptions(correctYear));
            setCompareMovie(null);
          } else if (mode === "silhouette") {
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
            setCompareMovie(null);
          } else if (mode === "rating") {
            // Pick two movies, ask which has higher rating
            let otherIdx = randomIdx;
            while (otherIdx === randomIdx) {
              otherIdx = Math.floor(Math.random() * validMovies.length);
            }
            const otherMovie = validMovies[otherIdx];

            setCurrentMovie(randomMovie);
            setCompareMovie(otherMovie);

            const higherTitle = randomMovie.vote_average >= otherMovie.vote_average
              ? randomMovie.title
              : otherMovie.title;
            setCorrectOption(higherTitle);
            setOptions([randomMovie.title, otherMovie.title]);
          } else if (mode === "tagline") {
            // Fetch movie details for tagline
            const details = await fetchDataFromApi(`/movie/${randomMovie.id}`);
            if (details?.tagline) {
              setMovieTagline(details.tagline);
              const distractorIndices = new Set();
              while (distractorIndices.size < 3) {
                const idx = Math.floor(Math.random() * validMovies.length);
                if (idx !== randomIdx) distractorIndices.add(idx);
              }
              const opts = [
                randomMovie.title,
                ...Array.from(distractorIndices).map((i) => validMovies[i].title),
              ].sort(() => Math.random() - 0.5);
              setCurrentMovie(randomMovie);
              setCorrectOption(randomMovie.title);
              setOptions(opts);
              setCompareMovie(null);
            } else {
              // Fallback to year mode for this question
              const correctYear = randomMovie.release_date.split("-")[0];
              setCurrentMovie(randomMovie);
              setCorrectOption(parseInt(correctYear));
              setOptions(generateYearOptions(correctYear));
              setCompareMovie(null);
              setMovieTagline("");
            }
          }

          // Start timer
          const timer = getTimerForDifficulty(diff);
          setTimeLeft(timer);
          setTimerActive(true);
        }
      }
    } catch (error) {
      console.error("Error loading trivia:", error);
    }

    setLoading(false);
  }, [gameMode, difficulty]);

  const handleAnswer = (answer) => {
    if (selectedOption !== null) return;
    setSelectedOption(answer);
    setTimerActive(false);
    setTotalPlayed((p) => p + 1);

    if (answer === correctOption) {
      setStreak((s) => s + 1);
      setTotalCorrect((c) => c + 1);
      if ((streak + 1) % 5 === 0) {
        setShowConfetti(true);
      }
    } else {
      setStreak(0);
    }
  };

  const getTimerColor = () => {
    const maxTime = getTimerForDifficulty(difficulty);
    const ratio = timeLeft / maxTime;
    if (ratio > 0.5) return "#4ecdc4";
    if (ratio > 0.25) return "#f89e00";
    return "#da2f68";
  };

  const getTimerProgress = () => {
    const maxTime = getTimerForDifficulty(difficulty);
    return (timeLeft / maxTime) * 100;
  };

  // Lobby / Setup Screen
  if (!gameStarted) {
    return (
      <div className="triviaPage">
        <ContentWrapper>
          <div className="header">
            <h1>🎬 Movie Trivia</h1>
            <p>Test your cinema knowledge with multiple game modes</p>
          </div>

          {/* Best Stats */}
          <div className="statsPreview">
            <div className="statCard">
              <FaTrophy className="icon gold" />
              <span className="value">{bestStreak}</span>
              <span className="label">Best Streak</span>
            </div>
          </div>

          {/* Game Mode Selection */}
          <div className="setupSection">
            <h2>Choose Your Challenge</h2>
            <div className="modeGrid">
              {GAME_MODES.map((mode) => (
                <div key={mode.key} className="modeCard">
                  <span className="modeIcon">{mode.icon}</span>
                  <h3>{mode.label}</h3>
                  <p>{mode.description}</p>
                  <div className="difficultyBtns">
                    {DIFFICULTY_LEVELS.map((diff) => (
                      <button
                        key={diff.key}
                        className={`diffBtn ${diff.key}`}
                        onClick={() => startGame(mode.key, diff.key)}
                      >
                        {diff.icon} {diff.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ContentWrapper>
      </div>
    );
  }

  return (
    <div className="triviaPage">
      <ContentWrapper>
        {/* Game HUD */}
        <div className="gameHud">
          <button className="backToLobby" onClick={() => setGameStarted(false)}>
            ← Modes
          </button>
          <div className="hudInfo">
            <div className="hudItem streak">
              <FaFire /> <span>{streak}</span>
            </div>
            <div className="hudItem best">
              <FaTrophy /> <span>{bestStreak}</span>
            </div>
            <div className="hudItem accuracy">
              <FaBolt />
              <span>
                {totalPlayed > 0
                  ? Math.round((totalCorrect / totalPlayed) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="hudDifficulty">
            {DIFFICULTY_LEVELS.find((d) => d.key === difficulty)?.icon}{" "}
            {DIFFICULTY_LEVELS.find((d) => d.key === difficulty)?.label}
          </div>
        </div>

        {/* Timer Ring */}
        {!loading && currentMovie && selectedOption === null && (
          <div className="timerRing">
            <svg viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke={getTimerColor()}
                strokeWidth="3"
                strokeDasharray={`${getTimerProgress() * 1.256} 125.6`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease" }}
              />
            </svg>
            <span className="timerText" style={{ color: getTimerColor() }}>
              {timeLeft}
            </span>
          </div>
        )}

        <div className="gameContainer">
          {showConfetti && (
            <div className="confettiOverlay">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="confettiPiece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    backgroundColor: ["#da2f68", "#f89e00", "#4ecdc4", "#a855f7", "#ffffff"][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              ))}
            </div>
          )}

          {loading ? (
            <div className="loading">
              <Spinner />
              <p>Loading next question...</p>
            </div>
          ) : currentMovie ? (
            <div className="questionSection">
              {/* Poster Area */}
              {gameMode !== "tagline" && (
                <div
                  className={`posterArea ${
                    gameMode === "silhouette" && selectedOption === null
                      ? "silhouette"
                      : ""
                  } ${gameMode === "rating" ? "rating-mode" : ""}`}
                >
                  <div className="posterCard main">
                    <Img
                      src={
                        currentMovie.poster_path
                          ? url.poster + currentMovie.poster_path
                          : PosterFallback
                      }
                    />
                    {gameMode !== "rating" && gameMode !== "silhouette" && (
                      <div className="posterLabel">{currentMovie.title}</div>
                    )}
                  </div>
                  {gameMode === "rating" && compareMovie && (
                    <>
                      <div className="vsCircle">VS</div>
                      <div className="posterCard compare">
                        <Img
                          src={
                            compareMovie.poster_path
                              ? url.poster + compareMovie.poster_path
                              : PosterFallback
                          }
                        />
                        <div className="posterLabel">{compareMovie.title}</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tagline display */}
              {gameMode === "tagline" && movieTagline && (
                <div className="taglineDisplay">
                  <span className="quoteIcon">"</span>
                  <p>{movieTagline}</p>
                  <span className="quoteIcon">"</span>
                </div>
              )}

              <div className="questionText">
                {gameMode === "year" && (
                  <>
                    What year was <strong>{currentMovie.title}</strong> released?
                  </>
                )}
                {gameMode === "silhouette" && <>Can you name this movie from its <strong>silhouette</strong>?</>}
                {gameMode === "rating" && <>Which movie has a <strong>higher rating</strong>?</>}
                {gameMode === "tagline" && <>Which movie has this <strong>tagline</strong>?</>}
              </div>

              <div className={`optionsGrid ${options.length === 2 ? "two-col" : ""}`}>
                {options.map((opt, idx) => (
                  <button
                    key={`${opt}-${idx}`}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedOption !== null}
                    className={`
                      ${selectedOption !== null && opt === correctOption ? "correct" : ""}
                      ${selectedOption === opt && opt !== correctOption ? "wrong" : ""}
                      ${selectedOption !== null && selectedOption !== opt && opt !== correctOption ? "dimmed" : ""}
                    `}
                  >
                    <span className="optionLetter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="optionText">{opt}</span>
                    {selectedOption !== null && opt === correctOption && (
                      <span className="optionIcon">✓</span>
                    )}
                    {selectedOption === opt && opt !== correctOption && (
                      <span className="optionIcon">✗</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Rating reveal for Higher/Lower */}
              {gameMode === "rating" && selectedOption !== null && (
                <div className="ratingReveal">
                  <div className="ratingItem">
                    <span>{currentMovie.title}</span>
                    <span className="ratingValue">
                      ⭐ {currentMovie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  {compareMovie && (
                    <div className="ratingItem">
                      <span>{compareMovie.title}</span>
                      <span className="ratingValue">
                        ⭐ {compareMovie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* Result Section */}
          {selectedOption !== null && (
            <div className="resultSection">
              <div
                className={`resultBanner ${
                  selectedOption === correctOption ? "correct" : "wrong"
                }`}
              >
                <span className="resultIcon">
                  {selectedOption === correctOption ? "🎉" : "😢"}
                </span>
                <div className="resultText">
                  <h3>
                    {selectedOption === correctOption ? "Correct!" : "Wrong!"}
                  </h3>
                  <p>
                    {selectedOption === correctOption
                      ? streak > 1
                        ? `${streak} in a row! Keep going!`
                        : "Nice start!"
                      : `The correct answer was ${correctOption}`}
                  </p>
                </div>
              </div>
              <button
                className="nextBtn"
                onClick={() => loadNewQuestion()}
              >
                Next Question <FaRedo style={{ marginLeft: 8 }} />
              </button>
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Trivia;
