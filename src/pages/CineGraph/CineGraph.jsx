import React, { useState, useEffect, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useSelector } from "react-redux";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";

import "./style.scss";

const CineGraph = () => {
	const navigate = useNavigate();
	const { url } = useSelector((state) => state.home);
	const [loading, setLoading] = useState(true);
	const [graphData, setGraphData] = useState({ nodes: [], links: [] });

	useEffect(() => {
		const fetchGraphData = async () => {
			setLoading(true);
			try {
				// 1. Get trending movies
				const res = await fetchDataFromApi("/trending/movie/week");
				const movies = res.results.slice(0, 12);

				const nodes = [];
				const links = [];
				const actorIds = new Set();

				// Add movie nodes
				movies.forEach((movie) => {
					nodes.push({
						id: `m_${movie.id}`,
						name: movie.title,
						val: 20,
						type: "movie",
						img: url.poster + movie.poster_path,
						color: "#da2f68",
					});
				});

				// Fetch credits for each movie
				for (const movie of movies) {
					const credits = await fetchDataFromApi(`/movie/${movie.id}/credits`);
					const mainCast = credits.cast.slice(0, 5);

					mainCast.forEach((actor) => {
						const actorNodeId = `a_${actor.id}`;
						if (!actorIds.has(actor.id)) {
							nodes.push({
								id: actorNodeId,
								name: actor.name,
								val: 10,
								type: "actor",
								img: url.profile + actor.profile_path,
								color: "#f89e00",
                                realId: actor.id
							});
							actorIds.add(actor.id);
						}
						links.push({
							source: `m_${movie.id}`,
							target: actorNodeId,
						});
					});
				}

				setGraphData({ nodes, links });
			} catch (error) {
				console.error("Error fetching graph data:", error);
			}
			setLoading(false);
		};

		if (url.poster) {
			fetchGraphData();
		}
	}, [url]);

	const handleClick = (node) => {
		if (node.type === "movie") {
			navigate(`/movie/${node.id.replace("m_", "")}`);
		} else {
			navigate(`/person/${node.realId}`);
		}
	};

	return (
		<div className="cineGraphPage">
			<ContentWrapper>
				<div className="pageHeader">
					<h1>🕸️ CineGraph</h1>
					<p>Explore the cosmic connections between your favorite stars and films</p>
				</div>
				{loading ? (
					<Spinner initial={true} />
				) : (
					<div className="graphContainer">
						<ForceGraph2D
							graphData={graphData}
							nodeLabel="name"
							nodeRelSize={6}
							linkColor={() => "rgba(255, 255, 255, 0.2)"}
							nodeCanvasObject={(node, ctx, globalScale) => {
								const label = node.name;
								const fontSize = 12 / globalScale;
								ctx.font = `${fontSize}px Outfit`;
								const textWidth = ctx.measureText(label).width;
								const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

								ctx.fillStyle = node.color;
								ctx.beginPath();
								ctx.arc(node.x, node.y, node.type === "movie" ? 8 : 4, 0, 2 * Math.PI, false);
								ctx.fill();

								ctx.textAlign = 'center';
								ctx.textBaseline = 'middle';
								ctx.fillStyle = "white";
								ctx.fillText(label, node.x, node.y + (node.type === "movie" ? 12 : 8));
							}}
							onNodeClick={handleClick}
						/>
                        <div className="legend">
                            <div className="item"><span className="dot movie"></span> Movie</div>
                            <div className="item"><span className="dot actor"></span> Actor</div>
                        </div>
					</div>
				)}
			</ContentWrapper>
		</div>
	);
};

export default CineGraph;
