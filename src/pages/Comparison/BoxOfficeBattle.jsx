import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchDataFromApi } from "../../utils/api";
import Img from "../../components/lazyLoadImage/img";
import PosterFallback from "../../assets/no-poster.png";

const BoxOfficeBattle = ({ items }) => {
	const { url } = useSelector((state) => state.home);
	const [details, setDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [winner, setWinner] = useState(null);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		const fetchBattleData = async () => {
			setLoading(true);
			try {
				const data = await Promise.all(
					items.map(async (item) => {
						const res = await fetchDataFromApi(
							`/${item.media_type || "movie"}/${item.id}`,
						);
						return res
							? { ...res, media_type: item.media_type || "movie" }
							: null;
					}),
				);

				const validData = data.filter((d) => d !== null);
				if (validData.length < 2)
					throw new Error("Could not fetch battle data");

				setDetails(validData);

				// Determine winner
				setTimeout(() => {
					setAnimate(true);
					const score1 = calculateScore(validData[0]);
					const score2 = calculateScore(validData[1]);
					if (score1 > score2) setWinner(0);
					else if (score2 > score1) setWinner(1);
					else setWinner("draw");
				}, 500);
			} catch (error) {
				console.error("Battle fetch error:", error);
			}
			setLoading(false);
		};

		if (items.length === 2) {
			fetchBattleData();
		}
	}, [items]);

	const calculateScore = (item) => {
		const rating = item.vote_average || 0;
		const popularity = item.popularity || 0;
		if (item.media_type === "tv") {
			const episodes = item.number_of_episodes || 0;
			return episodes * 0.5 + rating * 2 + popularity / 100;
		} else {
			const revenue = item.revenue || 0;
			return (revenue / 1000000) * 0.5 + rating * 2 + (popularity / 100) * 0.3;
		}
	};

	if (loading || details.length < 2) {
		return (
			<div className="battleLoading">
				<div className="loader"></div>
				<p>Preparing the Arena...</p>
			</div>
		);
	}

	const movie1 = details[0];
	const movie2 = details[1];

	const getStatPercent = (stat, max) => {
		return Math.min((stat / max) * 100, 100);
	};

	// Max values for normalization
	const maxRevenue = Math.max(movie1.revenue || 0, movie2.revenue || 0, 1);
	const maxEpisodes = Math.max(
		movie1.number_of_episodes || 0,
		movie2.number_of_episodes || 0,
		1,
	);
	const maxRating = 10;
	const maxPopularity = Math.max(
		movie1.popularity || 0,
		movie2.popularity || 0,
		1,
	);

	const renderStatBar = (movie, type) => {
		let label = "";
		let value = "";
		let percent = 0;
		let colorClass = "";

		switch (type) {
			case "primary":
				if (movie.media_type === "tv") {
					label = "Episodes";
					value = movie.number_of_episodes;
					percent = getStatPercent(movie.number_of_episodes, maxEpisodes);
				} else {
					label = "Revenue";
					value = `$${(movie.revenue / 1000000).toFixed(1)}M`;
					percent = getStatPercent(movie.revenue, maxRevenue);
				}
				break;
			case "rating":
				label = "Rating";
				value = `${movie.vote_average?.toFixed(1)}/10`;
				percent = getStatPercent(movie.vote_average, maxRating);
				colorClass = "green";
				break;
			case "pop":
				label = "Popularity";
				value = movie.popularity?.toFixed(0);
				percent = getStatPercent(movie.popularity, maxPopularity);
				colorClass = "orange";
				break;
			default:
				break;
		}

		return (
			<div className="statBar">
				<div className="label">
					<span>{label}</span>
					<span>{value}</span>
				</div>
				<div className="barContainer">
					<div
						className={`bar fill ${colorClass}`}
						style={{ width: animate ? `${percent}%` : "0%" }}></div>
				</div>
			</div>
		);
	};

	return (
		<div className="boxOfficeBattle">
			<div className="battleField">
				{/* Left Fighter */}
				<div className={`fighter left ${winner === 0 ? "winner" : ""}`}>
					<div className="posterWrapper">
						<Img
							src={
								movie1.poster_path
									? url.poster + movie1.poster_path
									: PosterFallback
							}
						/>
						{winner === 0 && <div className="winnerBadge">WINNER</div>}
					</div>
					<div className="stats">
						<h2>{movie1.title || movie1.name}</h2>
						{renderStatBar(movie1, "primary")}
						{renderStatBar(movie1, "rating")}
						{renderStatBar(movie1, "pop")}
					</div>
				</div>

				<div className="vsDivider">
					<span>VS</span>
				</div>

				{/* Right Fighter */}
				<div className={`fighter right ${winner === 1 ? "winner" : ""}`}>
					<div className="posterWrapper">
						<Img
							src={
								movie2.poster_path
									? url.poster + movie2.poster_path
									: PosterFallback
							}
						/>
						{winner === 1 && <div className="winnerBadge">WINNER</div>}
					</div>
					<div className="stats">
						<h2>{movie2.title || movie2.name}</h2>
						{renderStatBar(movie2, "primary")}
						{renderStatBar(movie2, "rating")}
						{renderStatBar(movie2, "pop")}
					</div>
				</div>
			</div>

			{winner !== null && (
				<div className="battleResult">
					<h3>
						{winner === "draw"
							? "IT'S A DRAW!"
							: `${details[winner].title || details[winner].name} TAKES THE CROWN!`}
					</h3>
				</div>
			)}
		</div>
	);
};

export default BoxOfficeBattle;
