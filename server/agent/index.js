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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const agent_1 = require("./agent");
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { prompt, thread_id } = req.body;
    const result = yield agent_1.agent.invoke({
        messages: [{
                role: "user",
                content: prompt
            }]
    }, {
        configurable: { thread_id }
    });
    res.json((_a = result.messages.at(-1)) === null || _a === void 0 ? void 0 : _a.content);
}));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
