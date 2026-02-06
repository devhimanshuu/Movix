import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
	console.error(
		"GROQ_API_KEY is missing! Make sure VITE_GROQ_API_KEY is set in your .env file and restart the server.",
	);
}

export const fetchChatResponse = async (messages) => {
	try {
		const response = await axios.post(
			GROQ_API_URL,
			{
				model: "llama-3.3-70b-versatile", // Upgraded to user requested high-performance model
				messages: [
					{
						role: "system",
						content:
							"You are CineBot, the ultimate movie expert for the Movix application. You help users find movies, explain plots, and provide recommendations. Your style is helpful, enthusiastic, and knowledgeable about cinema. Keep responses concise but engaging. Use emojis related to film.",
					},
					...messages,
				],
				temperature: 0.7,
				max_tokens: 500,
			},
			{
				headers: {
					Authorization: `Bearer ${GROQ_API_KEY}`,
					"Content-Type": "application/json",
				},
			},
		);
		return response.data.choices[0].message.content;
	} catch (error) {
		console.error("Groq API Error:", error);
		const errorMsg =
			error.response?.data?.error?.message || error.message || "Unknown error";
		return `I'm having a bit of trouble connecting: ${errorMsg} 🎬`;
	}
};
