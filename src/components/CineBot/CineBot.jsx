import React, { useState, useEffect, useRef } from "react";
import { IoVideocamSharp, IoClose, IoSend } from "react-icons/io5";
import { fetchChatResponse } from "../../utils/groqApi";
import "./style.scss";

const CineBot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content:
				"Hey there! I'm CineBot, your movie expert. Need a recommendation or have a cinema question? Ask away! 🍿🎬",
		},
	]);
	const [isLoading, setIsLoading] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const messagesEndRef = useRef(null);
	const chatWindowRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const [dragDistance, setDragDistance] = useState(0);

	// Drag Logic
	const onMouseDown = (e) => {
		// Allow dragging from header OR the toggle button
		if (
			e.target.closest(".chat-header") ||
			e.target.closest(".cinebot-toggle")
		) {
			setIsDragging(true);
			setDragDistance(0);
			setDragStart({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		}
	};

	useEffect(() => {
		const onMouseMove = (e) => {
			if (!isDragging) return;

			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;

			// Calculate distance moved to distinguish drag from click
			const dist = Math.sqrt(
				Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2),
			);
			setDragDistance((prev) => prev + dist);

			setPosition({ x: newX, y: newY });
		};

		const onMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [isDragging, dragStart, position]);

	const handleToggle = () => {
		// Only toggle if it wasn't a significant drag
		if (dragDistance < 10) {
			setIsOpen(!isOpen);
		}
	};

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Prepare context for API: only send relevant messages to keep it efficient
		const apiMessages = [...messages, userMessage].slice(-10); // Keep last 10 for context

		const botResponse = await fetchChatResponse(apiMessages);

		setMessages((prev) => [
			...prev,
			{ role: "assistant", content: botResponse },
		]);
		setIsLoading(false);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") handleSend();
	};

	return (
		<div
			className={`cinebot-container ${isOpen ? "open" : ""} ${isDragging ? "dragging" : ""}`}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`,
			}}>
			{/* Chat Window */}
			<div
				className="chat-window"
				ref={chatWindowRef}
				onMouseDown={onMouseDown}>
				<div className="chat-header">
					<div className="bot-info">
						<div className="bot-avatar">🤖</div>
						<div className="bot-details">
							<h3>CineBot</h3>
							<span>Movie Expert • Online</span>
						</div>
					</div>
					<button className="close-btn" onClick={() => setIsOpen(false)}>
						<IoClose size={24} />
					</button>
				</div>

				<div className="chat-messages">
					{messages.map((msg, index) => (
						<div key={index} className={`message ${msg.role}`}>
							<div className="message-bubble">{msg.content}</div>
						</div>
					))}
					{isLoading && (
						<div className="message assistant loading">
							<div className="message-bubble">
								<div className="dot-typing">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				<div className="chat-input-area">
					<input
						type="text"
						placeholder="Ask about a movie..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={handleKeyPress}
					/>
					<button
						className="send-btn"
						onClick={handleSend}
						disabled={isLoading}>
						<IoSend size={20} />
					</button>
				</div>
			</div>

			{/* Toggle Button */}
			<button
				className="cinebot-toggle"
				onClick={handleToggle}
				onMouseDown={onMouseDown}>
				{isOpen ? <IoClose size={30} /> : <IoVideocamSharp size={30} />}
			</button>
		</div>
	);
};

export default CineBot;
