import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../utils/api";
import Spinner from "../../components/Spinner/Spinner";
import "./style.scss";

// Curated filming locations database (can be expanded or loaded from external JSON)
// Note: TMDB API doesn't provide filming locations, so we maintain a curated list
const FILMING_LOCATIONS_DB = [
	{
		country: "New Zealand",
		lat: -41.2865,
		lng: 174.7762,
		city: "Wellington",
		movieIds: [120, 121, 122, 1216, 57158, 122917], // LOTR & Hobbit trilogies
		color: "#ff6b6b",
	},
	{
		country: "Iceland",
		lat: 64.9631,
		lng: -19.0208,
		city: "Reykjavik",
		movieIds: [152532, 335984, 181808, 330457], // Star Wars, Blade Runner, Interstellar
		color: "#4ecdc4",
	},
	{
		country: "USA - New York",
		lat: 40.7128,
		lng: -74.006,
		city: "New York City",
		movieIds: [155, 1726, 24428, 603, 680, 27205], // Dark Knight, Avengers, Matrix, Inception
		color: "#ffd93d",
	},
	{
		country: "UK - London",
		lat: 51.5074,
		lng: -0.1278,
		city: "London",
		movieIds: [671, 672, 673, 36669, 370172, 127380], // Harry Potter, Bond films
		color: "#a8e6cf",
	},
	{
		country: "Japan - Tokyo",
		lat: 35.6762,
		lng: 139.6503,
		city: "Tokyo",
		movieIds: [245891, 324857, 129, 140420, 19995], // John Wick, Spider-Verse, Avatar
		color: "#ff6b9d",
	},
	{
		country: "Morocco",
		lat: 31.7917,
		lng: -7.0926,
		city: "Marrakech",
		movieIds: [141052, 1895, 1924, 206647], // Gladiator, Star Wars, Spectre
		color: "#ffb347",
	},
	{
		country: "Australia - Sydney",
		lat: -33.8688,
		lng: 151.2093,
		city: "Sydney",
		movieIds: [603, 604, 605, 76757, 284053], // Matrix trilogy, Thor
		color: "#c7ceea",
	},
	{
		country: "Italy - Rome",
		lat: 41.9028,
		lng: 12.4964,
		city: "Rome",
		movieIds: [1924, 207703, 36669, 137106, 496243], // Gladiator, Kingsman, Skyfall
		color: "#b4f8c8",
	},
	{
		country: "India - Mumbai",
		lat: 19.076,
		lng: 72.8777,
		city: "Mumbai",
		movieIds: [13, 100402, 1930, 19995], // Slumdog Millionaire
		color: "#fbe7c6",
	},
	{
		country: "Canada - Toronto",
		lat: 43.6532,
		lng: -79.3832,
		city: "Toronto",
		movieIds: [27205, 49026, 245891, 335983], // Inception, Dark Knight Rises
		color: "#a0c4ff",
	},
	{
		country: "France - Paris",
		lat: 48.8566,
		lng: 2.3522,
		city: "Paris",
		movieIds: [27205, 608, 137113, 207703], // Inception, Amelie, Midnight in Paris
		color: "#ffd6e7",
	},
	{
		country: "Egypt - Giza",
		lat: 29.9792,
		lng: 31.1342,
		city: "Cairo",
		movieIds: [36669, 1895, 85], // Raiders of the Lost Ark, Transformers
		color: "#f4a261",
	},
	{
		country: "Norway",
		lat: 59.9139,
		lng: 10.7522,
		city: "Oslo",
		movieIds: [181808, 335984, 283995], // Star Wars, Guardians of the Galaxy
		color: "#90e0ef",
	},
	{
		country: "Spain - Barcelona",
		lat: 41.3851,
		lng: 2.1734,
		city: "Barcelona",
		movieIds: [76757, 127585, 496243], // Vicky Cristina Barcelona
		color: "#e76f51",
	},
	{
		country: "Thailand - Bangkok",
		lat: 13.7563,
		lng: 100.5018,
		city: "Bangkok",
		movieIds: [290859, 127585, 76757], // Hangover II
		color: "#06ffa5",
	},
];

const GlobeTrotter = () => {
	const navigate = useNavigate();
	const globeEl = useRef();
	const { url } = useSelector((state) => state.home);

	const [selectedLocation, setSelectedLocation] = useState(null);
	const [hoveredLocation, setHoveredLocation] = useState(null);
	const [globeReady, setGlobeReady] = useState(false);
	const [locationsWithMovies, setLocationsWithMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedMovies, setSelectedMovies] = useState([]);
	const [loadingMovies, setLoadingMovies] = useState(false);

	// Fetch movie details for all locations on mount
	useEffect(() => {
		const fetchAllLocations = async () => {
			setLoading(true);
			const locationsData = await Promise.all(
				FILMING_LOCATIONS_DB.map(async (location) => {
					// Fetch first 5 movies for each location to keep it manageable
					const moviePromises = location.movieIds
						.slice(0, 6)
						.map((id) => fetchDataFromApi(`/movie/${id}`).catch(() => null));
					const movies = await Promise.all(moviePromises);
					const validMovies = movies.filter((m) => m !== null);

					return {
						...location,
						movies: validMovies,
						movieCount: validMovies.length,
					};
				}),
			);

			setLocationsWithMovies(locationsData.filter((loc) => loc.movieCount > 0));
			setLoading(false);
		};

		fetchAllLocations();
	}, []);

	useEffect(() => {
		if (globeEl.current && !loading) {
			// Auto-rotate the globe
			globeEl.current.controls().autoRotate = true;
			globeEl.current.controls().autoRotateSpeed = 0.5;
			setGlobeReady(true);

			// Set initial point of view
			globeEl.current.pointOfView({ altitude: 2.5 }, 1000);
		}
	}, [loading]);

	const handleLocationClick = async (location) => {
		setLoadingMovies(true);
		setSelectedLocation(location);
		setSelectedMovies(location.movies);
		setLoadingMovies(false);

		// Stop auto-rotation when a location is selected
		if (globeEl.current) {
			globeEl.current.controls().autoRotate = false;
			// Zoom to location
			globeEl.current.pointOfView(
				{
					lat: location.lat,
					lng: location.lng,
					altitude: 1.5,
				},
				2000,
			);
		}
	};

	const handleMovieClick = (movieId) => {
		navigate(`/movie/${movieId}`);
	};

	const closeModal = () => {
		setSelectedLocation(null);
		setSelectedMovies([]);
		// Resume auto-rotation
		if (globeEl.current) {
			globeEl.current.controls().autoRotate = true;
			globeEl.current.pointOfView({ altitude: 2.5 }, 1000);
		}
	};

	if (loading) {
		return (
			<div className="globeTrotterPage">
				<ContentWrapper>
					<div className="pageHeader">
						<h1>🗺️ GlobeTrotter</h1>
						<p>Loading filming locations...</p>
					</div>
					<Spinner initial={true} />
				</ContentWrapper>
			</div>
		);
	}

	return (
		<div className="globeTrotterPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>🗺️ GlobeTrotter</h1>
					<p>
						Explore {locationsWithMovies.length} iconic filming locations around
						the world
					</p>
					<div className="instructions">
						<span>🌍 Spin the globe</span>
						<span>📍 Click on markers</span>
						<span>🎬 Discover movies</span>
					</div>
				</div>

				<div className="globeContainer">
					<Globe
						ref={globeEl}
						globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
						backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
						pointsData={locationsWithMovies}
						pointLat="lat"
						pointLng="lng"
						pointColor="color"
						pointAltitude={0.02}
						pointRadius={0.6}
						pointLabel={(d) => `
              <div style="
                background: rgba(0,0,0,0.9);
                padding: 12px 16px;
                border-radius: 8px;
                color: white;
                font-family: Arial;
                border: 2px solid ${d.color};
              ">
                <strong style="font-size: 16px;">${d.city}, ${d.country}</strong><br/>
                <span style="color: #aaa; font-size: 12px;">${d.movieCount} movies filmed here</span>
              </div>
            `}
						onPointClick={handleLocationClick}
						onPointHover={(point) => setHoveredLocation(point)}
						atmosphereColor="#4a90e2"
						atmosphereAltitude={0.25}
						width={window.innerWidth > 768 ? 900 : window.innerWidth - 40}
						height={window.innerWidth > 768 ? 600 : 400}
					/>
				</div>

				{selectedLocation && (
					<div className="locationModal" onClick={closeModal}>
						<div className="modalContent" onClick={(e) => e.stopPropagation()}>
							<button className="closeBtn" onClick={closeModal}>
								✕
							</button>
							<h2>
								📍 {selectedLocation.city}, {selectedLocation.country}
							</h2>
							<p className="subtitle">
								{selectedMovies.length} iconic movies filmed here
							</p>
							{loadingMovies ? (
								<Spinner initial={true} />
							) : (
								<div className="moviesList">
									{selectedMovies.map((movie) => (
										<div
											key={movie.id}
											className="movieItem"
											onClick={() => handleMovieClick(movie.id)}>
											<div className="movieInfo">
												<span className="movieTitle">{movie.title}</span>
												<span className="movieYear">
													{movie.release_date?.split("-")[0]}
												</span>
											</div>
											<span className="arrow">→</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				<div className="legend">
					<h3>Featured Locations ({locationsWithMovies.length})</h3>
					<div className="legendItems">
						{locationsWithMovies.map((loc, idx) => (
							<div
								key={idx}
								className="legendItem"
								onClick={() => handleLocationClick(loc)}>
								<span
									className="dot"
									style={{ backgroundColor: loc.color }}></span>
								<span className="name">
									{loc.country} ({loc.movieCount})
								</span>
							</div>
						))}
					</div>
				</div>
			</ContentWrapper>
		</div>
	);
};

export default GlobeTrotter;
