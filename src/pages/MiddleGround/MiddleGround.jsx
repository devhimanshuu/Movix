import React, { useState } from "react";
import { useSelector } from "react-redux";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Carousel from "../../components/Carousel/Carousel";
import Spinner from "../../components/Spinner/Spinner";

import "./style.scss";

const MiddleGround = () => {
	const { genres } = useSelector((state) => state.home);
	const [person1Genre, setPerson1Genre] = useState("");
	const [person2Genre, setPerson2Genre] = useState("");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);

	const genreList = Object.values(genres);

	const findCommonGround = async () => {
		if (!person1Genre || !person2Genre) return;

		setLoading(true);
		try {
			// TMDB can filter by multiple genres using comma (OR) or comma-separated list
			// For "Middle Ground", we want movies that have BOTH (AND operation is usually with comma or separate params)
			// Actually, TMDB uses comma for OR and comma (in with_genres) for AND depends on the API version.
			// Let's use with_genres with both IDs.
			const res = await fetchDataFromApi("/discover/movie", {
				with_genres: `${person1Genre},${person2Genre}`,
				sort_by: "popularity.desc",
			});
			setData(res?.results || []);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	return (
		<div className="middleGroundPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>👫 Middle Ground</h1>
					<p>Two people, two tastes, one perfectly matched movie.</p>
				</div>

				<div className="plannerBox">
					<div className="selectionArea">
						<div className="person">
							<h3>Person A likes...</h3>
							<select
								value={person1Genre}
								onChange={(e) => setPerson1Genre(e.target.value)}>
								<option value="">Choose a genre</option>
								{genreList.map((g) => (
									<option key={g.id} value={g.id}>
										{g.name}
									</option>
								))}
							</select>
						</div>

						<div className="vs">🤝</div>

						<div className="person">
							<h3>Person B likes...</h3>
							<select
								value={person2Genre}
								onChange={(e) => setPerson2Genre(e.target.value)}>
								<option value="">Choose a genre</option>
								{genreList.map((g) => (
									<option key={g.id} value={g.id}>
										{g.name}
									</option>
								))}
							</select>
						</div>
					</div>

					<button
						className="findBtn"
						onClick={findCommonGround}
						disabled={!person1Genre || !person2Genre || loading}>
						{loading ? "Finding matches..." : "Discover Common Ground"}
					</button>
				</div>

				{data && (
					<div className="resultsArea">
						<div className="sectionTitle">Matched for your group night:</div>
						{data.length > 0 ? (
							<Carousel data={data} loading={loading} endpoint="movie" />
						) : (
							<div className="noResults">
								No movies found that perfectly match both genres. Try a different combination!
							</div>
						)}
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default MiddleGround;
