import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const javascriptTool = tool(async ({ code }) => {
	const response = await fetch(
		process.env.EXECUTOR_URL || "",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ code })
		}
	)

	const result = await response.json();
	return result;
}, {
	name: "run_javascript_code_tool",
	description: `
		Run general purpose javascript code.
		This can be used to access Internet or do any computation needed.
		The output will be composed of stdout and stderr
		The code should be written in a way that it could be executed in javascript eval in node environment
	`,
	schema: z.object({
		code: z.string().describe("The code to be executed")
	})
})

export const agent = createReactAgent({
	llm: new ChatGoogleGenerativeAI({
		model: "gemini-2.0-flash",
		temperature: 0,
		maxOutputTokens: 1024,
		apiKey: process.env.GOOGLE_API_KEY,
	}),
	tools: [javascriptTool],
	checkpointSaver: new MemorySaver(),
})