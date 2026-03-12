import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import Carousel from "../../components/Carousel/Carousel";
import Spinner from "../../components/Spinner/Spinner";
import PosterFallback from "../../assets/no-poster.png";

import "./style.scss";

const moods = [
	{
		id: "happy",
		label: "Feel Good",
		icon: "😊",
		color: "#FFD93D",
		gradient: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
		params: { with_genres: "35,10751", sort_by: "vote_average.desc", "vote_count.gte": 300 },
		description: "Uplifting comedies & family films",
	},
	{
		id: "thrill",
		label: "Thrill Me",
		icon: "😨",
		color: "#e74c3c",
		gradient: "linear-gradient(135deg, #e74c3c, #c0392b)",
		params: { with_genres: "53,27", sort_by: "popularity.desc", "vote_count.gte": 300 },
		description: "Edge-of-your-seat suspense",
	},
	{
		id: "action",
		label: "Adrenaline",
		icon: "🔥",
		color: "#FF6B6B",
		gradient: "linear-gradient(135deg, #FF6B6B, #ee5a24)",
		params: { with_genres: "28,12", sort_by: "popularity.desc" },
		description: "Non-stop action & adventure",
	},
	{
		id: "romantic",
		label: "Romantic",
		icon: "💕",
		color: "#fd79a8",
		gradient: "linear-gradient(135deg, #fd79a8, #e84393)",
		params: { with_genres: "10749", sort_by: "popularity.desc" },
		description: "Love stories to warm your heart",
	},
	{
		id: "cry",
		label: "Cry With Me",
		icon: "😭",
		color: "#74b9ff",
		gradient: "linear-gradient(135deg, #74b9ff, #0984e3)",
		params: { with_genres: "18", with_keywords: "3364", sort_by: "vote_average.desc", "vote_count.gte": 500 },
		description: "Emotional dramas that hit deep",
	},
	{
		id: "mind",
		label: "Mind Benders",
		icon: "🤯",
		color: "#a855f7",
		gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
		params: { with_genres: "878,9648", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
		description: "Sci-fi puzzles and mysteries",
	},
	{
		id: "nostalgia",
		label: "Nostalgia",
		icon: "📼",
		color: "#f89e00",
		gradient: "linear-gradient(135deg, #f89e00, #e67e22)",
		params: { "primary_release_date.gte": "1980-01-01", "primary_release_date.lte": "1999-12-31", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
		description: "Classic 80s & 90s vibes",
	},
	{
		id: "family",
		label: "Family Time",
		icon: "👨‍👩‍👧‍👦",
		color: "#4ecdc4",
		gradient: "linear-gradient(135deg, #4ecdc4, #26de81)",
		params: { with_genres: "10751,16", sort_by: "popularity.desc" },
		description: "Fun for the whole family",
	},
	{
		id: "gritty",
		label: "Dark & Gritty",
		icon: "🌃",
		color: "#636e72",
		gradient: "linear-gradient(135deg, #636e72, #2d3436)",
		params: { with_genres: "80,18", sort_by: "vote_average.desc", "vote_count.gte": 500 },
		description: "Crime and noir atmosphere",
	},
	{
		id: "epic",
		label: "Epic Journey",
		icon: "⚔️",
		color: "#c0872e",
		gradient: "linear-gradient(135deg, #c0872e, #8B6914)",
		params: { with_genres: "12,14", "with_runtime.gte": 140, sort_by: "popularity.desc" },
		description: "Grand adventures & fantasy worlds",
	},
	{
		id: "learn",
		label: "Learn Something",
		icon: "🧠",
		color: "#00b894",
		gradient: "linear-gradient(135deg, #00b894, #00cec9)",
		params: { with_genres: "99,36", sort_by: "vote_average.desc", "vote_count.gte": 100 },
		description: "Documentaries & historical films",
	},
	{
		id: "gems",
		label: "Hidden Gems",
		icon: "💎",
		color: "#6c5ce7",
		gradient: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
		params: { "vote_average.gte": 8, "vote_count.lte": 3000, "vote_count.gte": 300, sort_by: "popularity.desc" },
		description: "Underrated masterpieces",
	},
];

const Moodify = () => {
	const navigate = useNavigate();
	const { url } = useSelector((state) => state.home);
	const [selectedMood, setSelectedMood] = useState(null);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [featured, setFeatured] = useState(null);
	const resultsRef = useRef(null);

	const fetchMoodData = async (mood, pageNum = 1) => {
		setLoading(true);
		setSelectedMood(mood);
		setPage(pageNum);
		try {
			const res = await fetchDataFromApi("/discover/movie", {
				...mood.params,
				page: pageNum,
			});
			const results = res?.results || [];
			setData(results);

			// Set featured movie (first with backdrop)
			const feat = results.find((m) => m.backdrop_path && m.overview);
			setFeatured(feat || null);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);

		// Scroll to results
		if (pageNum === 1) {
			setTimeout(() => {
				resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 300);
		}
	};

	const handleShuffle = () => {
		if (selectedMood) {
			const nextPage = Math.floor(Math.random() * 10) + 1;
			fetchMoodData(selectedMood, nextPage);
		}
	};

	// Set default mood on load
	useEffect(() => {
		fetchMoodData(moods[0]);
	}, []);

	return (
		<div className="moodifyPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>🎭 Moodify</h1>
					<p>Tell us how you're feeling — we'll find the perfect movie</p>
				</div>

				<div className="moodPrompt">How are you feeling tonight?</div>

				<div className="moodGrid">
					{moods.map((mood) => (
						<div
							key={mood.id}
							className={`moodCard ${selectedMood?.id === mood.id ? "active" : ""}`}
							onClick={() => fetchMoodData(mood)}
							style={{
								"--mood-color": mood.color,
								"--mood-gradient": mood.gradient,
							}}
						>
							<div className="moodGlow"></div>
							<span className="icon">{mood.icon}</span>
							<span className="label">{mood.label}</span>
							<span className="desc">{mood.description}</span>
						</div>
					))}
				</div>

				{selectedMood && (
					<div className="resultsSection" ref={resultsRef}>
						{/* Featured Movie */}
						{!loading && featured && (
							<div
								className="featuredMovie"
								style={{
									backgroundImage: `linear-gradient(to right, rgba(4, 21, 45, 0.95), rgba(4, 21, 45, 0.6)), url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`,
								}}
								onClick={() => navigate(`/movie/${featured.id}`)}
							>
								<div className="featuredContent">
									<div className="featuredTag" style={{ background: selectedMood.gradient }}>
										{selectedMood.icon} {selectedMood.label} Pick
									</div>
									<h2>{featured.title}</h2>
									<div className="featuredMeta">
										<span className="featuredRating">
											<FaStar /> {featured.vote_average?.toFixed(1)}
										</span>
										<span>{featured.release_date?.slice(0, 4)}</span>
									</div>
									<p className="featuredOverview">{featured.overview}</p>
									<button className="featuredBtn">View Details →</button>
								</div>
								<div className="featuredPoster">
									<Img
										src={
											featured.poster_path
												? url.poster + featured.poster_path
												: PosterFallback
										}
									/>
								</div>
							</div>
						)}

						<div className="resultsTitleRow">
							<div>
								<h2 className="resultsTitle">
									{selectedMood.icon} Movies for "{selectedMood.label}" Mood
								</h2>
								<p className="resultsSubtitle">
									{data?.length || 0} movies found · Page {page}
								</p>
							</div>
							<button className="shuffleBtn" onClick={handleShuffle} disabled={loading}>
								🔀 Shuffle
							</button>
						</div>

						{!loading ? (
							<Carousel data={data} loading={loading} endpoint="movie" />
						) : (
							<div className="loadingState">
								<Spinner initial={true} />
								<p>Finding movies for your mood...</p>
							</div>
						)}
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default Moodify;
