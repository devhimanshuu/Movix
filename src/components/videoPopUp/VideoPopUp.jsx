import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import "./style.scss";

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
	const [theaterMode, setTheaterMode] = useState(false);
	const [lightsOut, setLightsOut] = useState(false);
	const [curtainsOpen, setCurtainsOpen] = useState(false);

	useEffect(() => {
		if (show) {
			// Sequence the theater experience
			setTimeout(() => setTheaterMode(true), 100);
			setTimeout(() => setLightsOut(true), 600);
			setTimeout(() => setCurtainsOpen(true), 1200);
		} else {
			// Reset states when closing
			setTheaterMode(false);
			setLightsOut(false);
			setCurtainsOpen(false);
		}
	}, [show]);

	const hidePopup = () => {
		setShow(false);
		setVideoId(null);
	};

	return (
		<div
			className={`videoPopup ${show ? "visible" : ""} ${theaterMode ? "theater" : ""}`}>
			<div className="opacityLayer" onClick={hidePopup}></div>

			{/* Virtual Cinema Environment */}
			<div className={`cinemaEnvironment ${lightsOut ? "lightsOut" : ""}`}>
				{/* Theater Seats */}
				<div className="theaterSeats">
					<div className="seatRow front">
						<div className="seat"></div>
						<div className="seat"></div>
						<div className="seat viewer"></div>
						<div className="seat"></div>
						<div className="seat"></div>
					</div>
					<div className="seatRow back">
						<div className="seat"></div>
						<div className="seat"></div>
						<div className="seat"></div>
						<div className="seat"></div>
						<div className="seat"></div>
						<div className="seat"></div>
					</div>
				</div>

				{/* Theater Walls */}
				<div className="theaterWalls">
					<div className="wall left"></div>
					<div className="wall right"></div>
					<div className="wall back"></div>
				</div>

				{/* Ambient Lighting from Screen */}
				<div className="screenGlow"></div>

				{/* Red Curtains */}
				<div className={`curtains ${curtainsOpen ? "open" : ""}`}>
					<div className="curtain left"></div>
					<div className="curtain right"></div>
					<div className="curtainTop"></div>
				</div>

				{/* Movie Screen */}
				<div className="movieScreen">
					<div className="screenFrame">
						<div className="videoPlayer">
							<span className="closeBtn" onClick={hidePopup}>
								✕ Exit Theater
							</span>
							{videoId && (
								<ReactPlayer
									url={`https://www.youtube.com/watch?v=${videoId}`}
									controls
									width="100%"
									height="100%"
									playing={curtainsOpen}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Theater Mode Toggle */}
				<div className="theaterControls">
					<button
						className="modeToggle"
						onClick={() => setTheaterMode(!theaterMode)}
						title="Toggle Theater Mode">
						{theaterMode ? "🎬 Theater" : "📺 Normal"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default VideoPopup;
