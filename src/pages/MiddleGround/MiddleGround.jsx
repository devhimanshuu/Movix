import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import Spinner from "../../components/Spinner/Spinner";
import MovieCard from "../../components/MovieCard/MovieCard";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const MiddleGround = () => {
	const navigate = useNavigate();
	const { url, genres } = useSelector((state) => state.home);
	const [person1Genres, setPerson1Genres] = useState([]);
	const [person2Genres, setPerson2Genres] = useState([]);
	const [person1Name, setPerson1Name] = useState("Person A");
	const [person2Name, setPerson2Name] = useState("Person B");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [sortBy, setSortBy] = useState("popularity");
	const [yearRange, setYearRange] = useState("any");
	const [minRating, setMinRating] = useState(0);

	const genreList = useMemo(() => Object.values(genres), [genres]);

	const toggleGenre = (personSetter, currentGenres, genreId) => {
		if (currentGenres.includes(genreId)) {
			personSetter(currentGenres.filter((g) => g !== genreId));
		} else if (currentGenres.length < 4) {
			personSetter([...currentGenres, genreId]);
		}
	};

	const findCommonGround = async () => {
		if (person1Genres.length === 0 || person2Genres.length === 0) return;

		setLoading(true);
		try {
			// Combine genres from both people
			const allGenres = [...new Set([...person1Genres, ...person2Genres])];
			const params = {
				with_genres: allGenres.join(","),
				sort_by: sortBy === "popularity" ? "popularity.desc" : "vote_average.desc",
				"vote_count.gte": 100,
			};

			if (minRating > 0) {
				params["vote_average.gte"] = minRating;
			}

			if (yearRange !== "any") {
				const currentYear = new Date().getFullYear();
				switch (yearRange) {
					case "2020s":
						params["primary_release_date.gte"] = "2020-01-01";
						break;
					case "2010s":
						params["primary_release_date.gte"] = "2010-01-01";
						params["primary_release_date.lte"] = "2019-12-31";
						break;
					case "2000s":
						params["primary_release_date.gte"] = "2000-01-01";
						params["primary_release_date.lte"] = "2009-12-31";
						break;
					case "classic":
						params["primary_release_date.lte"] = "1999-12-31";
						break;
				}
			}

			// Fetch multiple pages for more variety
			const [page1, page2] = await Promise.all([
				fetchDataFromApi("/discover/movie", { ...params, page: 1 }),
				fetchDataFromApi("/discover/movie", { ...params, page: 2 }),
			]);

			const results = [
				...(page1?.results || []),
				...(page2?.results || []),
			];
			setData(results);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const getGenreEmoji = (genreName) => {
		const emojiMap = {
			Action: "💥",
			Adventure: "🗺️",
			Animation: "🎨",
			Comedy: "😂",
			Crime: "🔪",
			Documentary: "📹",
			Drama: "🎭",
			Family: "👨‍👩‍👧‍👦",
			Fantasy: "🧙",
			History: "📜",
			Horror: "👻",
			Music: "🎵",
			Mystery: "🔍",
			Romance: "💕",
			"Science Fiction": "🚀",
			"TV Movie": "📺",
			Thriller: "😰",
			War: "⚔️",
			Western: "🤠",
		};
		return emojiMap[genreName] || "🎬";
	};

	const getGenreName = (id) => {
		return genres[id]?.name || "";
	};

	const matchScore = useMemo(() => {
		if (person1Genres.length === 0 || person2Genres.length === 0) return 0;
		const shared = person1Genres.filter((g) => person2Genres.includes(g));
		const total = new Set([...person1Genres, ...person2Genres]).size;
		return Math.round((shared.length / total) * 100);
	}, [person1Genres, person2Genres]);

	return (
		<div className="middleGroundPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>👫 Middle Ground</h1>
					<p>Two tastes, one perfect movie night. Find films you'll both love.</p>
				</div>

				{/* Name Inputs */}
				<div className="namesRow">
					<div className="nameInput">
						<input
							type="text"
							value={person1Name}
							onChange={(e) => setPerson1Name(e.target.value)}
							placeholder="Person A"
							maxLength={15}
						/>
					</div>
					<div className="matchCircle">
						{matchScore > 0 ? (
							<>
								<span className="matchPercent">{matchScore}%</span>
								<span className="matchLabel">match</span>
							</>
						) : (
							<span className="matchIcon">🤝</span>
						)}
					</div>
					<div className="nameInput">
						<input
							type="text"
							value={person2Name}
							onChange={(e) => setPerson2Name(e.target.value)}
							placeholder="Person B"
							maxLength={15}
						/>
					</div>
				</div>

				{/* Genre Selection */}
				<div className="genreSelectionArea">
					<div className="personColumn">
						<h3>
							<span className="personDot a"></span>
							{person1Name}'s Picks
							<span className="pickCount">{person1Genres.length}/4</span>
						</h3>
						<div className="genreChips">
							{genreList.map((g) => (
								<button
									key={g.id}
									className={`genreChip ${person1Genres.includes(g.id) ? "selected person-a" : ""}`}
									onClick={() => toggleGenre(setPerson1Genres, person1Genres, g.id)}
								>
									<span className="chipEmoji">{getGenreEmoji(g.name)}</span>
									{g.name}
								</button>
							))}
						</div>
					</div>

					<div className="dividerLine"></div>

					<div className="personColumn">
						<h3>
							<span className="personDot b"></span>
							{person2Name}'s Picks
							<span className="pickCount">{person2Genres.length}/4</span>
						</h3>
						<div className="genreChips">
							{genreList.map((g) => (
								<button
									key={g.id}
									className={`genreChip ${person2Genres.includes(g.id) ? "selected person-b" : ""}`}
									onClick={() => toggleGenre(setPerson2Genres, person2Genres, g.id)}
								>
									<span className="chipEmoji">{getGenreEmoji(g.name)}</span>
									{g.name}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Filters */}
				<div className="filtersRow">
					<div className="filterGroup">
						<label>Sort By</label>
						<div className="filterOptions">
							<button
								className={sortBy === "popularity" ? "active" : ""}
								onClick={() => setSortBy("popularity")}
							>🔥 Popular</button>
							<button
								className={sortBy === "rating" ? "active" : ""}
								onClick={() => setSortBy("rating")}
							>⭐ Top Rated</button>
						</div>
					</div>
					<div className="filterGroup">
						<label>Era</label>
						<div className="filterOptions">
							{["any", "2020s", "2010s", "2000s", "classic"].map((yr) => (
								<button
									key={yr}
									className={yearRange === yr ? "active" : ""}
									onClick={() => setYearRange(yr)}
								>
									{yr === "any" ? "Any" : yr === "classic" ? "Pre-2000" : yr}
								</button>
							))}
						</div>
					</div>
					<div className="filterGroup">
						<label>Min Rating</label>
						<div className="filterOptions">
							{[0, 6, 7, 8].map((r) => (
								<button
									key={r}
									className={minRating === r ? "active" : ""}
									onClick={() => setMinRating(r)}
								>
									{r === 0 ? "Any" : `${r}+`}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Find Button */}
				<button
					className="findBtn"
					onClick={findCommonGround}
					disabled={
						person1Genres.length === 0 ||
						person2Genres.length === 0 ||
						loading
					}
				>
					{loading ? (
						<>
							<span className="btnSpinner"></span> Finding Movies...
						</>
					) : (
						<>🎬 Discover Common Ground</>
					)}
				</button>

				{/* Selected genres summary */}
				{(person1Genres.length > 0 || person2Genres.length > 0) && (
					<div className="selectionSummary">
						{person1Genres.length > 0 && (
							<div className="summaryGroup">
								<span className="summaryName">{person1Name}:</span>
								{person1Genres.map((id) => (
									<span key={id} className="summaryTag a">
										{getGenreEmoji(getGenreName(id))} {getGenreName(id)}
									</span>
								))}
							</div>
						)}
						{person2Genres.length > 0 && (
							<div className="summaryGroup">
								<span className="summaryName">{person2Name}:</span>
								{person2Genres.map((id) => (
									<span key={id} className="summaryTag b">
										{getGenreEmoji(getGenreName(id))} {getGenreName(id)}
									</span>
								))}
							</div>
						)}
					</div>
				)}

				{/* Results */}
				{data && (
					<div className="resultsArea">
						<div className="resultsHeader">
							<h2>
								{data.length > 0
									? `🎯 ${data.length} Movies For Your Night`
									: "No Matches Found"}
							</h2>
							{data.length > 0 && (
								<p>Movies that blend both of your tastes perfectly</p>
							)}
						</div>

						{data.length > 0 ? (
							<div className="movieGrid">
								{data.map((movie) => (
									<MovieCard
										key={movie.id}
										data={movie}
										mediaType="movie"
									/>
								))}
							</div>
						) : (
							<div className="noResults">
								<span className="emptyIcon">🤷</span>
								<p>
									No movies match this exact combination.
									<br />
									Try adjusting genres or filters!
								</p>
							</div>
						)}
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default MiddleGround;
