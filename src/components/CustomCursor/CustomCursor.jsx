import React, { useState, useEffect } from "react";
import "./style.scss";

const CustomCursor = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const [isHidden, setIsHidden] = useState(false);

	useEffect(() => {
		const addEventListeners = () => {
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseenter", onMouseEnter);
			document.addEventListener("mouseleave", onMouseLeave);
			document.addEventListener("mousedown", onMouseDown);
			document.addEventListener("mouseup", onMouseUp);
		};

		const removeEventListeners = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseenter", onMouseEnter);
			document.removeEventListener("mouseleave", onMouseLeave);
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("mouseup", onMouseUp);
		};

		const onMouseMove = (e) => {
			setPosition({ x: e.clientX, y: e.clientY });

			const target = e.target;
			const isClickable =
				target.tagName.toLowerCase() === "button" ||
				target.tagName.toLowerCase() === "a" ||
				target.closest(".cursor-pointer") ||
				target.closest("button") ||
				target.closest("a") ||
				window.getComputedStyle(target).cursor === "pointer";

			setIsHovering(isClickable);
		};

		const onMouseEnter = () => setIsHidden(false);
		const onMouseLeave = () => setIsHidden(true);
		const onMouseDown = () => setIsHovering(true);
		const onMouseUp = () => setIsHovering(false);

		addEventListeners();
		return () => removeEventListeners();
	}, []);

	return (
		<>
			<div
				className={`custom-cursor ${isHovering ? "cursor-hover" : ""} ${isHidden ? "cursor-hidden" : ""}`}
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			/>
			<div
				className={`cursor-dot ${isHidden ? "cursor-hidden" : ""}`}
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			/>
		</>
	);
};

export default CustomCursor;
