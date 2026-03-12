import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useSelector } from "react-redux";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";

import "./style.scss";

const CATEGORY_TABS = [
	{ key: "trending", label: "🔥 Trending" },
	{ key: "popular", label: "⭐ Popular" },
	{ key: "top_rated", label: "🏆 Top Rated" },
	{ key: "search", label: "🔍 Search" },
];

const NODE_COLORS = {
	movie: "#da2f68",
	actor: "#f89e00",
	director: "#4ecdc4",
	genre: "#a855f7",
};

const CineGraph = () => {
	const navigate = useNavigate();
	const graphRef = useRef();
	const containerRef = useRef();
	const { url } = useSelector((state) => state.home);

	const [loading, setLoading] = useState(true);
	const [graphData, setGraphData] = useState({ nodes: [], links: [] });
	const [activeTab, setActiveTab] = useState("trending");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [expandedNodes, setExpandedNodes] = useState(new Set());
	const [stats, setStats] = useState({ movies: 0, actors: 0, directors: 0, connections: 0 });
	const [graphPaused, setGraphPaused] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
	const [searchLoading, setSearchLoading] = useState(false);
	const [expandingNode, setExpandingNode] = useState(null);
	const [imageCache, setImageCache] = useState({});
	const [page, setPage] = useState(1);
	const [loadingMore, setLoadingMore] = useState(false);

	// Track container dimensions
	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				setDimensions({ width: rect.width, height: rect.height });
			}
		};
		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	// Preload images for nodes
	const preloadImage = useCallback((src) => {
		return new Promise((resolve) => {
			if (imageCache[src]) {
				resolve(imageCache[src]);
				return;
			}
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				setImageCache((prev) => ({ ...prev, [src]: img }));
				resolve(img);
			};
			img.onerror = () => resolve(null);
			img.src = src;
		});
	}, [imageCache]);

	// Fetch initial graph based on category
	const fetchCategoryData = useCallback(async (category, pageNum = 1) => {
		if (!url.poster) return;
		if (pageNum === 1) setLoading(true);
		else setLoadingMore(true);

		try {
			let endpoint;
			switch (category) {
				case "trending":
					endpoint = "/trending/movie/week";
					break;
				case "popular":
					endpoint = "/movie/popular";
					break;
				case "top_rated":
					endpoint = "/movie/top_rated";
					break;
				default:
					return;
			}

			const res = await fetchDataFromApi(endpoint, { page: pageNum });
			const movies = res.results.slice(0, 20);
			await buildGraphFromMovies(movies, pageNum > 1);
		} catch (error) {
			console.error("Error fetching graph data:", error);
		}

		setLoading(false);
		setLoadingMore(false);
	}, [url]);

	// Build the graph from a list of movies
	const buildGraphFromMovies = async (movies, append = false) => {
		const nodes = append ? [...graphData.nodes] : [];
		const links = append ? [...graphData.links] : [];
		const existingIds = new Set(nodes.map((n) => n.id));
		const actorIds = new Set(
			nodes.filter((n) => n.type === "actor").map((n) => n.id)
		);
		const directorIds = new Set(
			nodes.filter((n) => n.type === "director").map((n) => n.id)
		);

		// Add movie nodes
		for (const movie of movies) {
			const movieId = `m_${movie.id}`;
			if (existingIds.has(movieId)) continue;

			const posterUrl = movie.poster_path
				? url.poster + movie.poster_path
				: null;

			nodes.push({
				id: movieId,
				name: movie.title,
				val: 22,
				type: "movie",
				img: posterUrl,
				color: NODE_COLORS.movie,
				realId: movie.id,
				rating: movie.vote_average,
				releaseDate: movie.release_date,
				overview: movie.overview,
			});
			existingIds.add(movieId);

			// Preload poster
			if (posterUrl) preloadImage(posterUrl);
		}

		// Fetch credits in parallel (batch of 5)
		const batchSize = 5;
		for (let i = 0; i < movies.length; i += batchSize) {
			const batch = movies.slice(i, i + batchSize);
			const creditPromises = batch.map((movie) =>
				fetchDataFromApi(`/movie/${movie.id}/credits`)
			);
			const creditsResults = await Promise.all(creditPromises);

			creditsResults.forEach((credits, idx) => {
				const movie = batch[idx];
				const movieId = `m_${movie.id}`;

				// Add top 5 cast
				if (credits?.cast) {
					credits.cast.slice(0, 5).forEach((actor) => {
						const actorNodeId = `a_${actor.id}`;
						if (!existingIds.has(actorNodeId)) {
							const profileUrl = actor.profile_path
								? url.profile + actor.profile_path
								: null;
							nodes.push({
								id: actorNodeId,
								name: actor.name,
								val: 12,
								type: "actor",
								img: profileUrl,
								color: NODE_COLORS.actor,
								realId: actor.id,
								character: actor.character,
							});
							existingIds.add(actorNodeId);
							actorIds.add(actor.id);
							if (profileUrl) preloadImage(profileUrl);
						}
						const linkId = `${movieId}-${actorNodeId}`;
						if (!links.find((l) => l.id === linkId)) {
							links.push({
								source: movieId,
								target: actorNodeId,
								id: linkId,
								label: actor.character || "",
							});
						}
					});
				}

				// Add director
				if (credits?.crew) {
					const directors = credits.crew.filter(
						(c) => c.job === "Director"
					);
					directors.forEach((director) => {
						const dirNodeId = `d_${director.id}`;
						if (!existingIds.has(dirNodeId)) {
							const profileUrl = director.profile_path
								? url.profile + director.profile_path
								: null;
							nodes.push({
								id: dirNodeId,
								name: director.name,
								val: 15,
								type: "director",
								img: profileUrl,
								color: NODE_COLORS.director,
								realId: director.id,
							});
							existingIds.add(dirNodeId);
							directorIds.add(director.id);
							if (profileUrl) preloadImage(profileUrl);
						}
						const linkId = `${movieId}-${dirNodeId}`;
						if (!links.find((l) => l.id === linkId)) {
							links.push({
								source: movieId,
								target: dirNodeId,
								id: linkId,
								label: "Director",
							});
						}
					});
				}
			});
		}

		setGraphData({ nodes, links });
		updateStats(nodes, links);
	};

	// Expand a node — load more connections
	const expandNode = async (node) => {
		if (expandedNodes.has(node.id)) return;
		setExpandingNode(node.id);

		try {
			const newNodes = [...graphData.nodes];
			const newLinks = [...graphData.links];
			const existingIds = new Set(newNodes.map((n) => n.id));

			if (node.type === "actor" || node.type === "director") {
				// Fetch person's movie credits
				const credits = await fetchDataFromApi(
					`/person/${node.realId}/movie_credits`
				);
				const topMovies = (credits?.cast || credits?.crew || [])
					.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
					.slice(0, 8);

				for (const movie of topMovies) {
					const movieId = `m_${movie.id}`;
					if (!existingIds.has(movieId)) {
						const posterUrl = movie.poster_path
							? url.poster + movie.poster_path
							: null;
						newNodes.push({
							id: movieId,
							name: movie.title,
							val: 22,
							type: "movie",
							img: posterUrl,
							color: NODE_COLORS.movie,
							realId: movie.id,
							rating: movie.vote_average,
							releaseDate: movie.release_date,
							overview: movie.overview,
						});
						existingIds.add(movieId);
						if (posterUrl) preloadImage(posterUrl);
					}
					const linkId = `${movieId}-${node.id}`;
					if (!newLinks.find((l) => l.id === linkId)) {
						newLinks.push({
							source: movieId,
							target: node.id,
							id: linkId,
							label: movie.character || node.type === "director" ? "Director" : "",
						});
					}
				}
			} else if (node.type === "movie") {
				// Fetch movie credits
				const credits = await fetchDataFromApi(
					`/movie/${node.realId}/credits`
				);

				// Top 8 cast
				if (credits?.cast) {
					credits.cast.slice(0, 8).forEach((actor) => {
						const actorNodeId = `a_${actor.id}`;
						if (!existingIds.has(actorNodeId)) {
							const profileUrl = actor.profile_path
								? url.profile + actor.profile_path
								: null;
							newNodes.push({
								id: actorNodeId,
								name: actor.name,
								val: 12,
								type: "actor",
								img: profileUrl,
								color: NODE_COLORS.actor,
								realId: actor.id,
								character: actor.character,
							});
							existingIds.add(actorNodeId);
							if (profileUrl) preloadImage(profileUrl);
						}
						const linkId = `${node.id}-${actorNodeId}`;
						if (!newLinks.find((l) => l.id === linkId)) {
							newLinks.push({
								source: node.id,
								target: actorNodeId,
								id: linkId,
								label: actor.character || "",
							});
						}
					});
				}

				// Directors
				if (credits?.crew) {
					credits.crew
						.filter((c) => c.job === "Director")
						.forEach((director) => {
							const dirNodeId = `d_${director.id}`;
							if (!existingIds.has(dirNodeId)) {
								const profileUrl = director.profile_path
									? url.profile + director.profile_path
									: null;
								newNodes.push({
									id: dirNodeId,
									name: director.name,
									val: 15,
									type: "director",
									img: profileUrl,
									color: NODE_COLORS.director,
									realId: director.id,
								});
								existingIds.add(dirNodeId);
								if (profileUrl) preloadImage(profileUrl);
							}
							const linkId = `${node.id}-${dirNodeId}`;
							if (!newLinks.find((l) => l.id === linkId)) {
								newLinks.push({
									source: node.id,
									target: dirNodeId,
									id: linkId,
									label: "Director",
								});
							}
						});
				}
			}

			setGraphData({ nodes: newNodes, links: newLinks });
			setExpandedNodes((prev) => new Set(prev).add(node.id));
			updateStats(newNodes, newLinks);
		} catch (error) {
			console.error("Error expanding node:", error);
		}

		setExpandingNode(null);
	};

	const updateStats = (nodes, links) => {
		setStats({
			movies: nodes.filter((n) => n.type === "movie").length,
			actors: nodes.filter((n) => n.type === "actor").length,
			directors: nodes.filter((n) => n.type === "director").length,
			connections: links.length,
		});
	};

	// Search for movies or actors
	const handleSearch = async (query) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}
		setSearchLoading(true);
		try {
			const res = await fetchDataFromApi("/search/multi", {
				query,
			});
			const filtered = (res.results || [])
				.filter(
					(r) =>
						r.media_type === "movie" || r.media_type === "person"
				)
				.slice(0, 10);
			setSearchResults(filtered);
		} catch (error) {
			console.error("Error searching:", error);
		}
		setSearchLoading(false);
	};

	// Add a search result to the graph
	const addToGraph = async (item) => {
		setLoading(true);
		setSearchResults([]);
		setSearchQuery("");

		try {
			if (item.media_type === "movie") {
				await buildGraphFromMovies([item], graphData.nodes.length > 0);
			} else if (item.media_type === "person") {
				// Fetch person's movies and build graph
				const credits = await fetchDataFromApi(
					`/person/${item.id}/movie_credits`
				);
				const topMovies = (credits?.cast || [])
					.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
					.slice(0, 10);

				// Add person node first
				const personNodeId = `a_${item.id}`;
				const newNodes = [...graphData.nodes];
				const newLinks = [...graphData.links];
				const existingIds = new Set(newNodes.map((n) => n.id));

				if (!existingIds.has(personNodeId)) {
					const profileUrl = item.profile_path
						? url.profile + item.profile_path
						: null;
					newNodes.push({
						id: personNodeId,
						name: item.name,
						val: 14,
						type: "actor",
						img: profileUrl,
						color: NODE_COLORS.actor,
						realId: item.id,
					});
					existingIds.add(personNodeId);
				}

				setGraphData({ nodes: newNodes, links: newLinks });
				await buildGraphFromMovies(topMovies, true);
			}
		} catch (error) {
			console.error("Error adding to graph:", error);
		}
		setLoading(false);
	};

	// Initial load
	useEffect(() => {
		if (url.poster && activeTab !== "search") {
			setPage(1);
			setExpandedNodes(new Set());
			setSelectedNode(null);
			fetchCategoryData(activeTab, 1);
		}
	}, [activeTab, url]);

	// Handle node click — expand or select
	const handleNodeClick = useCallback(
		(node) => {
			if (selectedNode?.id === node.id) {
				// Double click behavior — navigate
				if (node.type === "movie") {
					navigate(`/movie/${node.realId}`);
				} else {
					navigate(`/person/${node.realId}`);
				}
			} else {
				setSelectedNode(node);
				// Auto expand on click
				if (!expandedNodes.has(node.id)) {
					expandNode(node);
				}
			}
		},
		[selectedNode, expandedNodes, navigate]
	);

	// Custom node rendering with images
	const nodeCanvasObject = useCallback(
		(node, ctx, globalScale) => {
			const isSelected = selectedNode?.id === node.id;
			const isExpanding = expandingNode === node.id;
			const isExpanded = expandedNodes.has(node.id);
			const size = node.type === "movie" ? 10 : node.type === "director" ? 7 : 6;
			const imgSize = size * 2;

			// Glow effect
			if (isSelected) {
				ctx.shadowColor = node.color;
				ctx.shadowBlur = 20;
			} else if (isExpanding) {
				ctx.shadowColor = "#ffffff";
				ctx.shadowBlur = 15;
			}

			// Draw node circle
			ctx.beginPath();
			ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
			ctx.fillStyle = node.color;
			ctx.fill();

			if (isSelected) {
				ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 2;
				ctx.stroke();
			} else if (isExpanded) {
				ctx.strokeStyle = "rgba(255,255,255,0.4)";
				ctx.lineWidth = 1;
				ctx.stroke();
			}

			ctx.shadowColor = "transparent";
			ctx.shadowBlur = 0;

			// Draw image if available and zoomed in enough
			if (node.img && globalScale > 0.6) {
				const cachedImg = imageCache[node.img];
				if (cachedImg) {
					ctx.save();
					ctx.beginPath();
					ctx.arc(node.x, node.y, size - 1, 0, 2 * Math.PI);
					ctx.clip();
					try {
						ctx.drawImage(
							cachedImg,
							node.x - (size - 1),
							node.y - (size - 1),
							(size - 1) * 2,
							(size - 1) * 2
						);
					} catch (e) {
						// fallback - just use the color fill
					}
					ctx.restore();
				}
			}

			// Label
			if (globalScale > 0.5) {
				const label = node.name;
				const fontSize = Math.max(3, 11 / globalScale);
				ctx.font = `${isSelected ? "bold " : ""}${fontSize}px 'Outfit', sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "top";

				// Text background
				const textWidth = ctx.measureText(label).width;
				const padding = 2;
				ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
				ctx.fillRect(
					node.x - textWidth / 2 - padding,
					node.y + size + 2,
					textWidth + padding * 2,
					fontSize + padding
				);

				ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.85)";
				ctx.fillText(label, node.x, node.y + size + 3);
			}

			// Type indicator icon
			if (globalScale > 0.8 && !imageCache[node.img]) {
				ctx.font = `${8 / globalScale}px sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "white";
				const icon = node.type === "movie" ? "🎬" : node.type === "director" ? "🎥" : "🎭";
				ctx.fillText(icon, node.x, node.y);
			}
		},
		[selectedNode, expandingNode, expandedNodes, imageCache]
	);

	// Custom link rendering
	const linkCanvasObject = useCallback(
		(link, ctx, globalScale) => {
			const start = link.source;
			const end = link.target;

			// Check if link is connected to selected node
			const isHighlighted =
				selectedNode &&
				(start.id === selectedNode.id || end.id === selectedNode.id);

			ctx.beginPath();
			ctx.moveTo(start.x, start.y);
			ctx.lineTo(end.x, end.y);
			ctx.strokeStyle = isHighlighted
				? "rgba(255, 255, 255, 0.5)"
				: "rgba(255, 255, 255, 0.08)";
			ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
			ctx.stroke();
		},
		[selectedNode]
	);

	// Graph controls
	const handleZoomIn = () => graphRef.current?.zoom(graphRef.current.zoom() * 1.3, 300);
	const handleZoomOut = () => graphRef.current?.zoom(graphRef.current.zoom() / 1.3, 300);
	const handleCenter = () => graphRef.current?.zoomToFit(400, 50);
	const handleReset = () => {
		setExpandedNodes(new Set());
		setSelectedNode(null);
		setPage(1);
		fetchCategoryData(activeTab, 1);
	};

	const handleLoadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchCategoryData(activeTab, nextPage);
	};

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery) handleSearch(searchQuery);
		}, 400);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Find most connected person
	const mostConnected = useMemo(() => {
		if (!graphData.nodes.length) return null;
		const connectionCounts = {};
		graphData.links.forEach((link) => {
			const sourceId = typeof link.source === "object" ? link.source.id : link.source;
			const targetId = typeof link.target === "object" ? link.target.id : link.target;
			connectionCounts[sourceId] = (connectionCounts[sourceId] || 0) + 1;
			connectionCounts[targetId] = (connectionCounts[targetId] || 0) + 1;
		});
		const personNodes = graphData.nodes.filter(
			(n) => n.type === "actor" || n.type === "director"
		);
		let maxNode = null;
		let maxCount = 0;
		personNodes.forEach((node) => {
			const count = connectionCounts[node.id] || 0;
			if (count > maxCount) {
				maxCount = count;
				maxNode = { ...node, connections: count };
			}
		});
		return maxNode;
	}, [graphData]);

	return (
		<div className="cineGraphPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>🕸️ CineGraph</h1>
					<p>
						Explore the cosmic web of cinema — discover hidden
						connections between actors, directors, and films
					</p>
				</div>

				{/* Category Tabs */}
				<div className="tabBar">
					{CATEGORY_TABS.map((tab) => (
						<button
							key={tab.key}
							className={`tab ${activeTab === tab.key ? "active" : ""}`}
							onClick={() => setActiveTab(tab.key)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Search Bar */}
				{activeTab === "search" && (
					<div className="searchSection">
						<div className="searchInputWrapper">
							<span className="searchIcon">🔍</span>
							<input
								type="text"
								placeholder="Search any movie or actor to explore connections..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="searchInput"
							/>
							{searchQuery && (
								<button
									className="clearBtn"
									onClick={() => {
										setSearchQuery("");
										setSearchResults([]);
									}}
								>
									✕
								</button>
							)}
						</div>

						{searchLoading && (
							<div className="searchStatus">Searching...</div>
						)}

						{searchResults.length > 0 && (
							<div className="searchDropdown">
								{searchResults.map((item) => (
									<button
										key={`${item.media_type}_${item.id}`}
										className="searchResultItem"
										onClick={() => addToGraph(item)}
									>
										<span className="resultType">
											{item.media_type === "movie"
												? "🎬"
												: "🎭"}
										</span>
										<div className="resultInfo">
											<span className="resultName">
												{item.title || item.name}
											</span>
											<span className="resultMeta">
												{item.media_type === "movie"
													? item.release_date?.slice(0, 4) || ""
													: "Person"}
												{item.vote_average
													? ` · ⭐ ${item.vote_average.toFixed(1)}`
													: ""}
											</span>
										</div>
										<span className="addIcon">+ Add</span>
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* Stats Bar */}
				{!loading && graphData.nodes.length > 0 && (
					<div className="statsBar">
						<div className="stat">
							<span className="statIcon movie">🎬</span>
							<span className="statValue">{stats.movies}</span>
							<span className="statLabel">Movies</span>
						</div>
						<div className="stat">
							<span className="statIcon actor">🎭</span>
							<span className="statValue">{stats.actors}</span>
							<span className="statLabel">Actors</span>
						</div>
						<div className="stat">
							<span className="statIcon director">🎥</span>
							<span className="statValue">{stats.directors}</span>
							<span className="statLabel">Directors</span>
						</div>
						<div className="stat">
							<span className="statIcon connection">🔗</span>
							<span className="statValue">{stats.connections}</span>
							<span className="statLabel">Connections</span>
						</div>
						{mostConnected && (
							<div className="stat highlight">
								<span className="statIcon">👑</span>
								<span className="statValue">{mostConnected.name}</span>
								<span className="statLabel">
									Most Connected ({mostConnected.connections})
								</span>
							</div>
						)}
					</div>
				)}

				{/* Main Graph Area */}
				{loading && graphData.nodes.length === 0 ? (
					<div className="loadingArea">
						<Spinner initial={true} />
						<p className="loadingText">Building the cinematic universe...</p>
					</div>
				) : (
					<div className="graphWrapper">
						<div className="graphContainer" ref={containerRef}>
							<ForceGraph2D
								ref={graphRef}
								graphData={graphData}
								width={dimensions.width}
								height={dimensions.height}
								nodeLabel=""
								nodeRelSize={6}
								nodeCanvasObject={nodeCanvasObject}
								linkCanvasObject={linkCanvasObject}
								onNodeClick={handleNodeClick}
								onBackgroundClick={() => setSelectedNode(null)}
								cooldownTicks={graphPaused ? 0 : Infinity}
								d3AlphaDecay={0.02}
								d3VelocityDecay={0.3}
								enableNodeDrag={true}
								backgroundColor="transparent"
								onNodeHover={(node) => {
									if (containerRef.current) {
										containerRef.current.style.cursor = node
											? "pointer"
											: "default";
									}
								}}
							/>

							{/* Graph Controls */}
							<div className="graphControls">
								<button onClick={handleZoomIn} title="Zoom In">+</button>
								<button onClick={handleZoomOut} title="Zoom Out">−</button>
								<button onClick={handleCenter} title="Fit to View">⊙</button>
								<button
									onClick={() => setGraphPaused(!graphPaused)}
									title={graphPaused ? "Resume" : "Pause"}
									className={graphPaused ? "active" : ""}
								>
									{graphPaused ? "▶" : "⏸"}
								</button>
								<button onClick={handleReset} title="Reset Graph">↺</button>
							</div>

							{/* Legend */}
							<div className="legend">
								<div className="item">
									<span className="dot movie"></span> Movie
								</div>
								<div className="item">
									<span className="dot actor"></span> Actor
								</div>
								<div className="item">
									<span className="dot director"></span>{" "}
									Director
								</div>
							</div>

							{/* Expand hint */}
							{graphData.nodes.length > 0 && (
								<div className="hint">
									Click a node to expand · Click again to navigate
								</div>
							)}

							{/* Loading more overlay */}
							{(loadingMore || expandingNode) && (
								<div className="loadingOverlay">
									<div className="loadingPulse"></div>
									<span>{expandingNode ? "Expanding connections..." : "Loading more..."}</span>
								</div>
							)}
						</div>

						{/* Load More Button */}
						{activeTab !== "search" && !loading && (
							<button className="loadMoreBtn" onClick={handleLoadMore} disabled={loadingMore}>
								{loadingMore ? "Loading..." : "🌐 Load More Movies"}
							</button>
						)}

						{/* Selected Node Detail Panel */}
						{selectedNode && (
							<div className="detailPanel">
								<button
									className="closePanel"
									onClick={() => setSelectedNode(null)}
								>
									✕
								</button>
								<div className="panelHeader">
									<div
										className="nodeTypeTag"
										style={{
											background: selectedNode.color,
										}}
									>
										{selectedNode.type === "movie"
											? "🎬 Movie"
											: selectedNode.type === "director"
											? "🎥 Director"
											: "🎭 Actor"}
									</div>
									<h3>{selectedNode.name}</h3>
								</div>

								{selectedNode.img && (
									<div className="panelImage">
										<img
											src={selectedNode.img}
											alt={selectedNode.name}
											onError={(e) => {
												e.target.style.display = "none";
											}}
										/>
									</div>
								)}

								{selectedNode.rating && (
									<div className="panelRating">
										⭐ {selectedNode.rating.toFixed(1)} / 10
									</div>
								)}

								{selectedNode.releaseDate && (
									<div className="panelMeta">
										📅 {selectedNode.releaseDate}
									</div>
								)}

								{selectedNode.character && (
									<div className="panelMeta">
										🎭 as {selectedNode.character}
									</div>
								)}

								{selectedNode.overview && (
									<p className="panelOverview">
										{selectedNode.overview}
									</p>
								)}

								<div className="panelConnections">
									🔗{" "}
									{
										graphData.links.filter((l) => {
											const sId =
												typeof l.source === "object"
													? l.source.id
													: l.source;
											const tId =
												typeof l.target === "object"
													? l.target.id
													: l.target;
											return (
												sId === selectedNode.id ||
												tId === selectedNode.id
											);
										}).length
									}{" "}
									connections
								</div>

								<div className="panelActions">
									<button
										className="actionBtn primary"
										onClick={() => {
											if (selectedNode.type === "movie") {
												navigate(
													`/movie/${selectedNode.realId}`
												);
											} else {
												navigate(
													`/person/${selectedNode.realId}`
												);
											}
										}}
									>
										View Details →
									</button>

									{!expandedNodes.has(selectedNode.id) && (
										<button
											className="actionBtn secondary"
											onClick={() =>
												expandNode(selectedNode)
											}
											disabled={expandingNode === selectedNode.id}
										>
											{expandingNode === selectedNode.id
												? "Expanding..."
												: "🔍 Expand Connections"}
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default CineGraph;
