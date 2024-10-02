import { useState } from "react";
import { encoding_for_model, Tiktoken, TiktokenModel } from "tiktoken";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Promptbuf } from "promptbuf"; // type: ignore
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { JSONSchema7 } from "json-schema";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface Example {
	id: string;
	name: string;
	schema: JSONSchema7;
	value: unknown;
}

const examples: Example[] = [
	{
		id: "simple_object",
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
	{
		id: "nested_object",
		name: "Nested object",
		schema: {
			type: "object",
			properties: {
				product: {
					type: "object",
					properties: {
						id: {
							type: "integer",
						},
						name: {
							type: "string",
						},
						specifications: {
							type: "object",
							properties: {
								ram: {
									type: "string",
								},
								cpu: {
									type: "string",
								},
								ports: {
									type: "array",
									items: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
		},
		value: {
			product: {
				id: 101,
				name: "Laptop",
				specifications: {
					ram: "16GB",
					cpu: "Intel i7",
					ports: ["USB", "HDMI", "Ethernet"],
				},
			},
		},
	},
	{
		name: "Array of objects",
		id: "array_of_objects",
		value: {
			employees: [
				{
					name: "Alice",
					role: "Developer",
					salary: 70000,
				},
				{
					name: "Bob",
					role: "Designer",
					salary: 60000,
				},
			],
		},
		schema: {
			type: "object",
			properties: {
				employees: {
					type: "array",
					items: {
						type: "object",
						properties: {
							name: {
								type: "string",
							},
							role: {
								type: "string",
							},
							salary: {
								type: "integer",
							},
						},
					},
				},
			},
		},
	},
];

const buildTSExample = (ex: Example) => {
	const pb = new Promptbuf(ex.schema);
	const schemaStr = JSON.stringify(ex.schema, null, 2);
	const valueStr = JSON.stringify(ex.value, null, 2);
	const encoded = pb.encode(ex.value);
	const decodedStr = JSON.stringify(pb.decode(encoded), null, 0);

	return `import { Promptbuf } from "promptbuf";

const json_schema = ${schemaStr};

value = ${valueStr}

const pb = new Promptbuf(json_schema);

const encoded = pb.encode(value);

console.log(encoded); // ${encoded}

const decoded = pb.decode(value);

console.log(decoded); // ${decodedStr}
`;
};

const buildPythonExample = (ex: Example) => {
	const pb = new Promptbuf(ex.schema);
	const schemaStr = JSON.stringify(ex.schema, null, 2);
	const valueStr = JSON.stringify(ex.value, null, 2);
	const encoded = pb.encode(ex.value);
	const decodedStr = JSON.stringify(pb.decode(encoded), null, 0);

	return `from promptbuf import Promptbuf

json_schema = ${schemaStr}

value = ${valueStr}

const pb = Promptbuf(json_schema)

const encoded = pb.encode(value)

print(encoded) # ${encoded}

const decoded = pb.decode(value)

print(decoded) # ${decodedStr}
`;
};

interface Model {
	model: TiktokenModel;
	name: string;
	enc: Tiktoken;
	tps: number;
}

const models: Model[] = [
	// tps: https://artificialanalysis.ai/leaderboards/models
	{
		model: "gpt-3.5-turbo",
		name: "GPT-3.5 Turbo",
		enc: encoding_for_model("gpt-4o"),
		tps: 88.1,
	},
	{
		model: "gpt-4",
		name: "GPT-4",
		enc: encoding_for_model("gpt-4"),
		tps: 28.6,
	},
	{
		model: "gpt-4o",
		name: "GPT-4o",
		enc: encoding_for_model("gpt-4o"),
		tps: 124.3,
	},
	{
		model: "gpt-4o-mini",
		name: "GPT-4o mini",
		enc: encoding_for_model("gpt-4o"),
		tps: 105.2,
	},
];

function Metric({ title, value }: { title: string; value: string }) {
	return (
		<div className="flex justify-center items-center">
			<div className="text-left w-2/4 md:w-full">
				<h3 className="text-sm sm:text-base lg:text-lg font-semibold">
					{title}
				</h3>
				<p className="text-xl sm:text-2xl lg:text-3xl font-bold">{value}</p>
			</div>
		</div>
	);
}

function Tokenizer() {
	const [selectedExample, setSelectedExample] = useState<Example | null>(null);
	const [selectedModel, setSelectedModel] = useState<Model | null>(null);
	const [selectedFormat, setSelectedFormat] = useState<
		"JSON" | "Typescript" | "Python"
	>("JSON");
	const [prettyFormattingEnabled, setPrettyFormattingEnabled] = useState(false);

	const bothSelected = selectedExample && selectedModel;

	const numJSONTokens = !bothSelected
		? 0
		: selectedModel.enc.encode(
				JSON.stringify(
					selectedExample.value,
					null,
					prettyFormattingEnabled ? 2 : 0
				)
		  ).length;

	const numEncodedTokens = !bothSelected
		? 0
		: selectedModel.enc.encode(
				new Promptbuf(selectedExample.schema).encode(selectedExample.value)
		  ).length;

	const percentReduction = !bothSelected
		? 0
		: Math.round(100 * ((numEncodedTokens - numJSONTokens) / numJSONTokens));

	const latencyReduction = !bothSelected
		? 0
		: // tokens * (1 / tokens/ms)
		  Math.round(
				(numEncodedTokens - numJSONTokens) * (1 / (selectedModel.tps / 1000))
		  );

	const getExampleValue = (
		example: Example,
		format: "JSON" | "Typescript" | "Python",
		prettyFormat: boolean = false
	) => {
		switch (format) {
			case "Typescript": {
				return buildTSExample(example);
			}
			case "Python": {
				return buildPythonExample(example);
			}
			default: {
				return JSON.stringify(example.value, null, prettyFormat ? 2 : 0);
			}
		}
	};

	return (
		<div className="w-full flex items-center justify-center">
			<div className="text-black py-4 sm:py-8 md:py-12 lg:py-20 flex items-center justify-center flex-col space-y-8 w-full px-4 sm:px-6 md:px-8 lg:w-3/4 xl:w-2/3">
				<div className="space-y-4 w-full">
					{/* Controls */}
					<div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
						{/* Example Controls */}
						<div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
							<Select
								value={selectedExample?.id ?? undefined}
								onValueChange={(id) =>
									setSelectedExample(examples.find((e) => e.id === id)!)
								}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Select an example" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{examples.map((e) => (
											<SelectItem key={e.id} value={e.id}>
												{e.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Select
								value={selectedModel?.model ?? undefined}
								onValueChange={(model) =>
									setSelectedModel(models.find((m) => m.model == model)!)
								}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Select a model" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{models.map((m) => (
											<SelectItem key={m.model} value={m.model}>
												{m.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{selectedFormat === "JSON" && (
								<div className="flex items-center space-x-2">
									<Switch
										id="test"
										checked={prettyFormattingEnabled}
										onCheckedChange={() =>
											setPrettyFormattingEnabled(!prettyFormattingEnabled)
										}
										defaultChecked={false}
									/>
									<Label htmlFor="airplane-mode">Pretty formatted</Label>
								</div>
							)}
						</div>
						<div className="mt-4 sm:mt-0">
							{/* Text controls */}
							<Select
								value={selectedFormat}
								onValueChange={(f: "JSON" | "Typescript" | "Python") =>
									setSelectedFormat(f)
								}
							>
								<SelectTrigger className="w-full sm:w-auto">
									<SelectValue placeholder="Select format" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{["JSON", "Typescript", "Python"].map((f) => (
											<SelectItem key={f} value={f}>
												{f}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-4 mt-4">
						<Textarea
							className="h-40 md:h-48 lg:h-56 resize-none flex-grow"
							placeholder="Select an example to preview"
							value={
								selectedExample
									? getExampleValue(
											selectedExample,
											selectedFormat,
											prettyFormattingEnabled
									  )
									: ""
							}
							readOnly
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-4">
						<Textarea
							className="h-40 md:h-48 lg:h-56 resize-none flex-grow"
							placeholder="Select an example to preview"
							value={
								selectedExample
									? new Promptbuf(selectedExample.schema).encode(
											selectedExample.value
									  )
									: ""
							}
							readOnly
						/>
					</div>
				</div>
				{/* <div className="w-full px-4 sm:px-6 md:px-8  lg:w-3/4 xl:w-2/3"> */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-11/12">
					<Metric
						title="Original Tokens"
						value={
							bothSelected
								? encoding_for_model(selectedModel.model)
										.encode(JSON.stringify(selectedExample.value))
										.length.toString()
								: "--"
						}
					/>
					<Metric
						title="Encoded Tokens"
						value={
							bothSelected
								? encoding_for_model(selectedModel.model)
										.encode(
											new Promptbuf(selectedExample.schema).encode(
												selectedExample.value
											)
										)
										.length.toString()
								: "--"
						}
					/>
					<Metric
						title="Token Count"
						value={bothSelected ? `${percentReduction}%` : "--"}
					/>
					<Metric
						title="Latency Change"
						value={bothSelected ? `${latencyReduction} ms` : "--"}
					/>
				</div>
				{/* </div> */}
			</div>
		</div>
	);
}

export default Tokenizer;
