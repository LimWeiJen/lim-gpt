"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const google_genai_1 = require("@langchain/google-genai");
const tools_1 = require("@langchain/core/tools");
const langgraph_1 = require("@langchain/langgraph");
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const javascriptTool = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ code }) {
    const response = yield fetch(process.env.EXECUTOR_URL || "", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
    });
    const result = yield response.json();
    return result;
}), {
    name: "run_javascript_code_tool",
    description: `
		Run general purpose javascript code.
		This can be used to access Internet or do any computation needed.
		The output will be composed of stdout and stderr
		The code should be written in a way that it could be executed in javascript eval in node environment
	`,
    schema: zod_1.z.object({
        code: zod_1.z.string().describe("The code to be executed")
    })
});
exports.agent = (0, prebuilt_1.createReactAgent)({
    llm: new google_genai_1.ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0,
        maxOutputTokens: 1024,
        apiKey: process.env.GOOGLE_API_KEY,
    }),
    tools: [javascriptTool],
    checkpointSaver: new langgraph_1.MemorySaver(),
});
