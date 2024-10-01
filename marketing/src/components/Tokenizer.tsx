import { useEffect, useState } from "react";
import { encoding_for_model } from "tiktoken";
import { Promptbuf } from "promptbuf";

const enc = encoding_for_model("gpt-4o");
function Tokenizer() {
	const preloads = [
		{
			name: "Simple object",
			schema: {
				type: "object",
				properties: {
					name: { type: "string" },
					age: { type: "integer" },
					verifiedAccount: { type: "boolean" },
				},
			},
			value: {
				name: "John Doe",
				age: 29,
				verifiedAccount: true,
			},
		},
	];

	const [selected] = useState(preloads[0]);
	const [encoded, setEncoded] = useState("");

	useEffect(() => {
		const pb = new Promptbuf(selected.schema);

		setEncoded(pb.encode(selected.value));
	}, [selected]);

	const numValueTokens = enc.encode(JSON.stringify(selected.value)).length;
	const numEncodedTokens = enc.encode(encoded).length;
	const percentReduction =
		100 * ((numValueTokens - numEncodedTokens) / numValueTokens);

	return (
		<div className="text-white">
			<h1 className="text-white">Tokenizer</h1>
			<div>
				<p>Value</p>
				<p>{JSON.stringify(selected.value, null, 2)}</p>
				<p>{numValueTokens}</p>
			</div>
			<div>
				<p>Encoded</p>
				<p>{encoded}</p>
				<p>{numEncodedTokens}</p>
			</div>
			<div>
				<p>Reduced by: {percentReduction}%</p>
			</div>
		</div>
	);
}

export default Tokenizer;
