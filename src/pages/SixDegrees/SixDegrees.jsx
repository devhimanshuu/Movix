import React, { useState, useCallback, useRef, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaRandom, FaSyncAlt } from "react-icons/fa";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../utils/api";
import Spinner from "../../components/Spinner/Spinner";
import "./style.scss";

const SixDegrees = () => {
	const navigate = useNavigate();
	const fgRef = useRef();

	const [actor1, setActor1] = useState("");
	const [actor2, setActor2] = useState("");
	const [actor1Results, setActor1Results] = useState([]);
	const [actor2Results, setActor2Results] = useState([]);
	const [selectedActor1, setSelectedActor1] = useState(null);
	const [selectedActor2, setSelectedActor2] = useState(null);
	const [searching, setSearching] = useState(false);
	const [loading, setLoading] = useState(false);
	const [graphData, setGraphData] = useState({ nodes: [], links: [] });
	const [pathFound, setPathFound] = useState(false);
	const [degreeCount, setDegreeCount] = useState(0);
	const [error, setError] = useState(null);

	// Search for actors
	const searchActor = async (query, setResults) => {
		if (query.length < 2) {
			setResults([]);
			return;
		}

		try {
			const res = await fetchDataFromApi(`/search/person?query=${query}`);
			setResults(res.results.slice(0, 5));
		} catch (err) {
			console.error("Error searching actor:", err);
		}
	};

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			if (actor1) searchActor(actor1, setActor1Results);
		}, 300);
		return () => clearTimeout(timer);
	}, [actor1]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (actor2) searchActor(actor2, setActor2Results);
		}, 300);
		return () => clearTimeout(timer);
	}, [actor2]);

	// Get actor's movies
	const getActorMovies = async (actorId) => {
		try {
			const res = await fetchDataFromApi(`/person/${actorId}/movie_credits`);
			return res.cast || [];
		} catch (err) {
			console.error("Error fetching actor movies:", err);
			return [];
		}
	};

	// Get movie cast
	const getMovieCast = async (movieId) => {
		try {
			const res = await fetchDataFromApi(`/movie/${movieId}/credits`);
			return res.cast || [];
		} catch (err) {
			console.error("Error fetching movie cast:", err);
			return [];
		}
	};

	// BFS to find shortest path
	const findConnection = async () => {
		if (!selectedActor1 || !selectedActor2) {
			setError("Please select both actors");
			return;
		}

		if (selectedActor1.id === selectedActor2.id) {
			setError("Please select two different actors");
			return;
		}

		setLoading(true);
		setError(null);
		setPathFound(false);

		try {
			// BFS implementation
			const queue = [[{ type: "actor", ...selectedActor1 }]];
			const visited = new Set([selectedActor1.id]);
			const maxDepth = 4; // Limit to 4 degrees

			while (queue.length > 0) {
				const path = queue.shift();
				const current = path[path.length - 1];

				// Check if we've reached max depth
				if (path.length > maxDepth * 2) break;

				if (current.type === "actor") {
					// If we found the target actor
					if (current.id === selectedActor2.id) {
						buildGraph(path);
						setDegreeCount(Math.floor(path.length / 2));
						setPathFound(true);
						setLoading(false);
						return;
					}

					// Get actor's movies
					const movies = await getActorMovies(current.id);

					// Add movies to queue (limit to top 20 popular movies)
					const topMovies = movies
						.filter((m) => m.popularity > 5)
						.sort((a, b) => b.popularity - a.popularity)
						.slice(0, 20);

					for (const movie of topMovies) {
						if (!visited.has(`movie-${movie.id}`)) {
							visited.add(`movie-${movie.id}`);
							queue.push([...path, { type: "movie", ...movie }]);
						}
					}
				} else if (current.type === "movie") {
					// Get movie's cast
					const cast = await getMovieCast(current.id);

					// Add actors to queue (limit to top 15 billed actors)
					const topCast = cast.slice(0, 15);

					for (const actor of topCast) {
						if (!visited.has(actor.id)) {
							visited.add(actor.id);
							queue.push([...path, { type: "actor", ...actor }]);
						}
					}
				}
			}

			// No path found
			setError("No connection found within 4 degrees. Try different actors!");
			setLoading(false);
		} catch (err) {
			console.error("Error finding connection:", err);
			setError("An error occurred. Please try again.");
			setLoading(false);
		}
	};

	// Build graph visualization
	const buildGraph = (path) => {
		const nodes = [];
		const links = [];

		path.forEach((item, index) => {
			// Add node
			nodes.push({
				id: item.type === "actor" ? `actor-${item.id}` : `movie-${item.id}`,
				name: item.type === "actor" ? item.name : item.title,
				type: item.type,
				val: item.type === "actor" ? 15 : 10,
				color: item.type === "actor" ? "#ff6b6b" : "#4ecdc4",
				data: item,
			});

			// Add link to previous node
			if (index > 0) {
				links.push({
					source:
						path[index - 1].type === "actor"
							? `actor-${path[index - 1].id}`
							: `movie-${path[index - 1].id}`,
					target:
						item.type === "actor" ? `actor-${item.id}` : `movie-${item.id}`,
					value: 2,
				});
			}
		});

		setGraphData({ nodes, links });

		// Zoom to fit after a delay
		setTimeout(() => {
			if (fgRef.current) {
				fgRef.current.zoomToFit(400, 50);
			}
		}, 500);
	};

	// Random actors for quick start
	const loadRandomActors = async () => {
		setLoading(true);
		try {
			const popularActors = [
				{ id: 2963, name: "Nicolas Cage" },
				{ id: 3894, name: "Christian Bale" },
				{ id: 6193, name: "Leonardo DiCaprio" },
				{ id: 3223, name: "Robert Downey Jr." },
				{ id: 8691, name: "Scarlett Johansson" },
				{ id: 1245, name: "Keanu Reeves" },
				{ id: 287, name: "Brad Pitt" },
				{ id: 500, name: "Tom Cruise" },
			];

			const random1 =
				popularActors[Math.floor(Math.random() * popularActors.length)];
			let random2 =
				popularActors[Math.floor(Math.random() * popularActors.length)];

			// Ensure different actors
			while (random2.id === random1.id) {
				random2 =
					popularActors[Math.floor(Math.random() * popularActors.length)];
			}

			setSelectedActor1(random1);
			setSelectedActor2(random2);
			setActor1(random1.name);
			setActor2(random2.name);
		} catch (err) {
			console.error("Error loading random actors:", err);
		}
		setLoading(false);
	};

	const reset = () => {
		setActor1("");
		setActor2("");
		setSelectedActor1(null);
		setSelectedActor2(null);
		setGraphData({ nodes: [], links: [] });
		setPathFound(false);
		setError(null);
		setDegreeCount(0);
	};

	const handleNodeClick = useCallback(
		(node) => {
			if (node.type === "movie") {
				navigate(`/movie/${node.data.id}`);
			} else {
				navigate(`/person/${node.data.id}`);
			}
		},
		[navigate],
	);

	return (
		<div className="sixDegreesPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>🎭 Six Degrees of Separation</h1>
					<p>Find the shortest connection between any two actors</p>
				</div>

				<div className="searchSection">
					<div className="searchRow">
						<div className="searchBox">
							<label>First Actor</label>
							<input
								type="text"
								placeholder="e.g., Kevin Bacon"
								value={actor1}
								onChange={(e) => {
									setActor1(e.target.value);
									setSelectedActor1(null);
								}}
							/>
							{actor1Results.length > 0 && !selectedActor1 && (
								<div className="searchResults">
									{actor1Results.map((actor) => (
										<div
											key={actor.id}
											className="resultItem"
											onClick={() => {
												setSelectedActor1(actor);
												setActor1(actor.name);
												setActor1Results([]);
											}}>
											<span>{actor.name}</span>
											{actor.known_for_department && (
												<span className="dept">
													{actor.known_for_department}
												</span>
											)}
										</div>
									))}
								</div>
							)}
						</div>

						<div className="searchBox">
							<label>Second Actor</label>
							<input
								type="text"
								placeholder="e.g., Tom Hanks"
								value={actor2}
								onChange={(e) => {
									setActor2(e.target.value);
									setSelectedActor2(null);
								}}
							/>
							{actor2Results.length > 0 && !selectedActor2 && (
								<div className="searchResults">
									{actor2Results.map((actor) => (
										<div
											key={actor.id}
											className="resultItem"
											onClick={() => {
												setSelectedActor2(actor);
												setActor2(actor.name);
												setActor2Results([]);
											}}>
											<span>{actor.name}</span>
											{actor.known_for_department && (
												<span className="dept">
													{actor.known_for_department}
												</span>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="actionButtons">
						<button
							className="btn primary"
							onClick={findConnection}
							disabled={!selectedActor1 || !selectedActor2 || loading}>
							<FaSearch /> Find Connection
						</button>
						<button className="btn secondary" onClick={loadRandomActors}>
							<FaRandom /> Random Actors
						</button>
						<button className="btn secondary" onClick={reset}>
							<FaSyncAlt /> Reset
						</button>
					</div>

					{error && <div className="errorMessage">{error}</div>}
				</div>

				{loading && (
					<div className="loadingSection">
						<Spinner initial={true} />
						<p>Searching through the Hollywood network...</p>
					</div>
				)}

				{pathFound && graphData.nodes.length > 0 && (
					<div className="resultSection">
						<div className="resultHeader">
							<h2>
								🎉 Connection Found: {degreeCount} Degree
								{degreeCount !== 1 ? "s" : ""} of Separation!
							</h2>
							<p className="legend">
								<span className="actorDot"></span> Actors
								<span className="movieDot"></span> Movies
								<span className="hint">Click nodes to view details</span>
							</p>
						</div>

						<div className="graphContainer">
							<ForceGraph2D
								ref={fgRef}
								graphData={graphData}
								nodeLabel="name"
								nodeColor="color"
								nodeVal="val"
								linkColor={() => "rgba(255, 255, 255, 0.2)"}
								linkWidth={2}
								onNodeClick={handleNodeClick}
								nodeCanvasObject={(node, ctx, globalScale) => {
									const label = node.name;
									const fontSize = 12 / globalScale;
									ctx.font = `${fontSize}px Sans-Serif`;

									// Draw node circle
									ctx.beginPath();
									ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
									ctx.fillStyle = node.color;
									ctx.fill();
									ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
									ctx.lineWidth = 2 / globalScale;
									ctx.stroke();

									// Draw label
									ctx.textAlign = "center";
									ctx.textBaseline = "middle";
									ctx.fillStyle = "white";
									ctx.fillText(label, node.x, node.y + node.val + fontSize + 2);
								}}
								width={window.innerWidth > 768 ? 900 : window.innerWidth - 40}
								height={500}
								backgroundColor="#04152d"
							/>
						</div>
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default SixDegrees;
