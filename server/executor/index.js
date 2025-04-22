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
const port = 3000;
const evalAndCaptureOutput = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const oldLog = console.log;
    const oldError = console.error;
    const output = [];
    const errorOutput = [];
    console.log = (...args) => output.push(args.join(' '));
    console.error = (...args) => errorOutput.push(args.join(' '));
    try {
        yield eval(code);
    }
    catch (error) {
        errorOutput.push(error.message);
    }
    console.log = oldLog;
    console.error = oldError;
    return {
        stdout: output.join("\n"),
        stderr: errorOutput.join("\n")
    };
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const result = yield evalAndCaptureOutput(code);
    res.json(result);
}));
app.listen(port, () => console.log("Server Running at 3000"));
