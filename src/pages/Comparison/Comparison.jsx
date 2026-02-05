import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Img from "../../components/lazyLoadImage/img";
import CircleRating from "../../components/circleRating/CircleRating";
import PosterFallback from "../../assets/no-poster.png";
import {
	removeFromComparison,
	clearComparison,
	addToComparison,
} from "../../store/comparisonSlice";
import { fetchDataFromApi } from "../../utils/api";
import BoxOfficeBattle from "./BoxOfficeBattle";

const Comparison = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { url, genres } = useSelector((state) => state.home);
	const comparison = useSelector((state) => state.comparison.items);
	const [showModal, setShowModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searching, setSearching] = useState(false);

	if (comparison.length === 0) {
		return (
			<div className="comparisonPage">
				<ContentWrapper>
					<div className="noComparison">
						<h2>No movies to compare</h2>
						<p>Add movies to comparison from any page to get started</p>
						<button onClick={() => navigate("/")} className="backBtn">
							Back to Home
						</button>
					</div>
				</ContentWrapper>
			</div>
		);
	}

	const handleRemove = (id) => {
		dispatch(removeFromComparison(id));
	};

	const handleClearAll = () => {
		dispatch(clearComparison());
	};

	const handleSearch = async (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.trim().length > 0) {
			setSearching(true);
			try {
				const response = await fetchDataFromApi(`/search/multi?query=${query}`);
				const filtered = response.results.filter(
					(item) =>
						(item.media_type === "movie" || item.media_type === "tv") &&
						!comparison.some((comp) => comp.id === item.id),
				);
				setSearchResults(filtered.slice(0, 10));
			} catch (error) {
				console.error("Search error:", error);
			}
			setSearching(false);
		} else {
			setSearchResults([]);
		}
	};

	const handleAddFromModal = (movie) => {
		dispatch(
			addToComparison({
				...movie,
				media_type: movie.media_type,
			}),
		);
		setSearchQuery("");
		setSearchResults([]);
	};

	return (
		<div className="comparisonPage">
			<ContentWrapper>
				<div className="comparisonHeader">
					<h1>Movie Comparison</h1>
					<div className="headerActions">
						<span className="movieCount">
							{comparison.length} movie(s) selected
						</span>
						<button className="addBtn" onClick={() => setShowModal(true)}>
							+ Add Movie
						</button>
						{comparison.length > 0 && (
							<button className="clearBtn" onClick={handleClearAll}>
								Clear All
							</button>
						)}
					</div>
				</div>

				{comparison.length === 2 ? (
					<BoxOfficeBattle items={comparison} />
				) : (
					<div className="comparisonContainer">
						{comparison.map((movie) => {
							const posterUrl = movie.poster_path
								? url.poster + movie.poster_path
								: PosterFallback;

							return (
								<div key={movie.id} className="comparisonCard">
									<div className="cardHeader">
										<button
											className="removeBtn"
											onClick={() => handleRemove(movie.id)}
											title="Remove from comparison">
											✕
										</button>
									</div>

									<div className="posterSection">
										<Img src={posterUrl} alt={movie.title} />
									</div>

									<div className="detailsSection">
										<h3
											className="title"
											onClick={() =>
												navigate(`/${movie.media_type || "movie"}/${movie.id}`)
											}>
											{movie.title || movie.name}
										</h3>

										<div className="ratingRow">
											<span className="label">Rating:</span>
											<div className="ratingValue">
												<CircleRating
													rating={movie.vote_average?.toFixed(1) || "0"}
												/>
												<span className="score">
													{movie.vote_average?.toFixed(1)}/10
												</span>
											</div>
										</div>

										<div className="detailRow">
											<span className="label">Release Date:</span>
											<span className="value">
												{movie.release_date || movie.first_air_date
													? dayjs(
															movie.release_date || movie.first_air_date,
														).format("MMM D, YYYY")
													: "N/A"}
											</span>
										</div>

										<div className="detailRow">
											<span className="label">Type:</span>
											<span className="value capitalize">
												{movie.media_type === "tv" ? "TV Show" : "Movie"}
											</span>
										</div>

										{movie.genre_ids && movie.genre_ids.length > 0 && (
											<div className="detailRow">
												<span className="label">Genres:</span>
												<span className="value">
													{movie.genre_ids
														.slice(0, 3)
														.map((g) => genres[g]?.name)
														.filter(Boolean)
														.join(", ")}
												</span>
											</div>
										)}

										{movie.overview && (
											<div className="overviewRow">
												<span className="label">Overview:</span>
												<p className="overview">{movie.overview}</p>
											</div>
										)}

										<button
											className="viewBtn"
											onClick={() =>
												navigate(`/${movie.media_type || "movie"}/${movie.id}`)
											}>
											View Details
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{showModal && (
					<div className="modalOverlay" onClick={() => setShowModal(false)}>
						<div className="modalContent" onClick={(e) => e.stopPropagation()}>
							<div className="modalHeader">
								<h2>Add Movie to Comparison</h2>
								<button
									className="closeBtn"
									onClick={() => setShowModal(false)}>
									✕
								</button>
							</div>

							<div className="modalSearchBox">
								<input
									type="text"
									placeholder="Search for a movie or TV show..."
									value={searchQuery}
									onChange={handleSearch}
									autoFocus
								/>
							</div>

							{searchQuery && searchResults.length > 0 && (
								<div className="modalResults">
									{searchResults.map((item) => {
										const posterUrl = item.poster_path
											? url.poster + item.poster_path
											: PosterFallback;
										const isAlreadyAdded = comparison.some(
											(c) => c.id === item.id,
										);

										return (
											<div key={item.id} className="resultItem">
												<img src={posterUrl} alt={item.title || item.name} />
												<div className="resultInfo">
													<h4>{item.title || item.name}</h4>
													<p>
														{item.media_type === "tv" ? "TV Show" : "Movie"}
													</p>
													<p className="year">
														{item.release_date || item.first_air_date
															? new Date(
																	item.release_date || item.first_air_date,
																).getFullYear()
															: "N/A"}
													</p>
												</div>
												<button
													className={`addResultBtn ${isAlreadyAdded ? "added" : ""}`}
													onClick={() =>
														!isAlreadyAdded && handleAddFromModal(item)
													}
													disabled={isAlreadyAdded}>
													{isAlreadyAdded ? "Added" : "Add"}
												</button>
											</div>
										);
									})}
								</div>
							)}

							{searchQuery && searchResults.length === 0 && !searching && (
								<div className="noResults">
									<p>No movies found for "{searchQuery}"</p>
								</div>
							)}

							{searching && (
								<div className="noResults">
									<p>Searching...</p>
								</div>
							)}
						</div>
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default Comparison;
