import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const agent = createReactAgent({
	llm: new ChatGoogleGenerativeAI({
		model: "gemini-2.0-flash",
		temperature: 0,
		maxOutputTokens: 1024,
		apiKey: process.env.GOOGLE_API_KEY,
	}),
	tools: [],
})

agent.invoke({
	messages: {
		role: "user",
		content: "hello, how can you help me?"
	}
}).then((res) => {
	console.log(res.messages.at(-1)?.content);
})