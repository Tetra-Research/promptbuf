import { useEffect, useState } from "react";
import { encoding_for_model } from "tiktoken";
import { Promptbuf } from "promptbuf";

const enc = encoding_for_model("gpt-4o");
function Tokenizer() {
	const [inputText, setInputText] = useState("");
	const [encodedText, setEncodedText] = useState("");

	useEffect(() => {
		const pb = new Promptbuf({
			type: "array",
			items: { type: "integer" },
		});

		setEncodedText(pb.encode(inputText));
	}, [inputText]);

	return (
		<div className="text-white">
			<h1 className="text-white">Tokenizer</h1>
			<p>{JSON.stringify(encodedText)}</p>
			<input
				type="text"
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				placeholder="Enter text"
				className="border p-2 mr-2 text-black"
			/>
			<p className="text-white">input: {inputText}</p>
			<p className="text-white">encoded: {encodedText}</p>
			<p className="text-white">{enc.encode(inputText).length}</p>
		</div>
	);
}

export default Tokenizer;
