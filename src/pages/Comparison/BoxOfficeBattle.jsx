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
					items.map((item) =>
						fetchDataFromApi(`/${item.media_type || "movie"}/${item.id}`),
					),
				);
				setDetails(data);

				// Determine winner
				setTimeout(() => {
					setAnimate(true);
					const score1 = calculateScore(data[0]);
					const score2 = calculateScore(data[1]);
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
		const revenue = item.revenue || 0;
		const rating = item.vote_average || 0;
		const popularity = item.popularity || 0;
		// Weighted score logic
		return (revenue / 1000000) * 0.5 + rating * 2 + (popularity / 100) * 0.3;
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
	const maxRating = 10;
	const maxPopularity = Math.max(
		movie1.popularity || 0,
		movie2.popularity || 0,
		1,
	);

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
						<div className="statBar">
							<div className="label">
								Revenue: ${(movie1.revenue / 1000000).toFixed(1)}M
							</div>
							<div className="barContainer">
								<div
									className="bar fill"
									style={{
										width: animate
											? `${getStatPercent(movie1.revenue, maxRevenue)}%`
											: "0%",
									}}></div>
							</div>
						</div>
						<div className="statBar">
							<div className="label">
								Rating: {movie1.vote_average?.toFixed(1)}
							</div>
							<div className="barContainer">
								<div
									className="bar fill green"
									style={{
										width: animate
											? `${getStatPercent(movie1.vote_average, maxRating)}%`
											: "0%",
									}}></div>
							</div>
						</div>
						<div className="statBar">
							<div className="label">
								Popularity: {movie1.popularity?.toFixed(0)}
							</div>
							<div className="barContainer">
								<div
									className="bar fill orange"
									style={{
										width: animate
											? `${getStatPercent(movie1.popularity, maxPopularity)}%`
											: "0%",
									}}></div>
							</div>
						</div>
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
						<div className="statBar">
							<div className="label">
								Revenue: ${(movie2.revenue / 1000000).toFixed(1)}M
							</div>
							<div className="barContainer">
								<div
									className="bar fill"
									style={{
										width: animate
											? `${getStatPercent(movie2.revenue, maxRevenue)}%`
											: "0%",
									}}></div>
							</div>
						</div>
						<div className="statBar">
							<div className="label">
								Rating: {movie2.vote_average?.toFixed(1)}
							</div>
							<div className="barContainer">
								<div
									className="bar fill green"
									style={{
										width: animate
											? `${getStatPercent(movie2.vote_average, maxRating)}%`
											: "0%",
									}}></div>
							</div>
						</div>
						<div className="statBar">
							<div className="label">
								Popularity: {movie2.popularity?.toFixed(0)}
							</div>
							<div className="barContainer">
								<div
									className="bar fill orange"
									style={{
										width: animate
											? `${getStatPercent(movie2.popularity, maxPopularity)}%`
											: "0%",
									}}></div>
							</div>
						</div>
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
