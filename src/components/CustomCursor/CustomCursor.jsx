import React, { useState, useEffect } from "react";
import "./style.scss";

const CustomCursor = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	useEffect(() => {
		let rafId = null;
		const targetPos = { x: 0, y: 0 };
		const currentPos = { x: 0, y: 0 };

		const updatePosition = () => {
			// Ease the follower ring for a premium feel
			currentPos.x += (targetPos.x - currentPos.x) * 0.15;
			currentPos.y += (targetPos.y - currentPos.y) * 0.15;

			setPosition({ x: currentPos.x, y: currentPos.y });
			rafId = requestAnimationFrame(updatePosition);
		};

		const onMouseMove = (e) => {
			targetPos.x = e.clientX;
			targetPos.y = e.clientY;

			const target = e.target;
			const isClickable =
				target.tagName.toLowerCase() === "button" ||
				target.tagName.toLowerCase() === "a" ||
				target.closest(".cursor-pointer") ||
				target.closest("button") ||
				target.closest("a") ||
				window.getComputedStyle(target).cursor === "pointer";

			setIsHovering(isClickable);
			setIsHidden(false);
		};

		const onMouseEnter = () => setIsHidden(false);
		const onMouseLeave = () => setIsHidden(true);
		const onMouseDown = () => setIsClicked(true);
		const onMouseUp = () => setIsClicked(false);

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseenter", onMouseEnter);
		document.addEventListener("mouseleave", onMouseLeave);
		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("mouseup", onMouseUp);

		rafId = requestAnimationFrame(updatePosition);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseenter", onMouseEnter);
			document.removeEventListener("mouseleave", onMouseLeave);
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("mouseup", onMouseUp);
			cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<>
			<div
				className={`custom-cursor ${isHovering ? "cursor-hover" : ""} ${isHidden ? "cursor-hidden" : ""} ${isClicked ? "cursor-clicked" : ""}`}
				style={{
					transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
				}}
			/>
			<div
				className={`cursor-dot ${isHidden ? "cursor-hidden" : ""} ${isClicked ? "cursor-clicked" : ""}`}
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			/>
		</>
	);
};

export default CustomCursor;
