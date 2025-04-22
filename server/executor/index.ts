import express from "express";
import cors from "cors";

const evalAndCaptureOutput = async (code: string) => {
	const oldLog = console.log;
	const oldError = console.error;

	const output: Array<string> = [];
	const errorOutput: Array<string> = [];

	console.log = (...args) => output.push(args.join(' '));
	console.error = (...args) => errorOutput.push(args.join(' '));

	try {
		await eval(code);
	} catch (error: Error | any) {
		errorOutput.push(error!.message);
	}

	console.log = oldLog;
	console.error = oldError;

	return {
		stdout: output.join("\n"),
		stderr: errorOutput.join("\n")
	}
}

const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));

app.post('/', async (req, res) => {
	const { code } = req.body;

	const result = await evalAndCaptureOutput(code);
	res.json(result);
})

app.listen(3000, () => console.log("Server Running at 3000"))