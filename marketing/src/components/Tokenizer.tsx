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

interface Model {
	model: TiktokenModel;
	name: string;
	// enc: (
	// 	model: TiktokenModel,
	// 	extend_special_tokens?: Record<string, number>
	// ) => Tiktoken;
	enc: Tiktoken;
}

const models: Model[] = [
	{
		model: "gpt-3.5-turbo",
		name: "GPT-3.5 Turbo",
		enc: encoding_for_model("gpt-4o"),
	},
	{ model: "gpt-4", name: "GPT-4", enc: encoding_for_model("gpt-4o") },
	{ model: "gpt-4o", name: "GPT-4o", enc: encoding_for_model("gpt-4o") },
	{
		model: "gpt-4o-mini",
		name: "GPT-4o mini",
		enc: encoding_for_model("gpt-4o"),
	},
];

function Tokenizer() {
	const [selectedExample, setSelectedExample] = useState<Example | null>(null);
	const [selectedModel, setSelectedModel] = useState<Model | null>(null);
	const [prettyFormattingEnabled, setPrettyFormattingEnabled] = useState(false);

	// const numValueTokens = enc.encode(
	// 	JSON.stringify(selectedExample.value)
	// ).length;
	// const numEncodedTokens = enc.encode(encoded).length;
	// const percentReduction =
	// 	100 * ((numValueTokens - numEncodedTokens) / numValueTokens);

	/*
	here's what i'm thinking.

	it's a markdown blob.  it has three tabs - json, ts, python

	*/

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

	return (
		<div className="text-white pt-20 px-40">
			<div className="space-y-4">
				<div>
					<div className="flex space-x-2 mb-2 justify-start">
						<Select
							value={selectedExample?.id ?? undefined}
							onValueChange={(id) =>
								setSelectedExample(examples.find((e) => e.id === id)!)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select an example" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{...examples.map((e) => {
										return <SelectItem value={e.id}>{e.name}</SelectItem>;
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
						<Select
							value={selectedModel?.model ?? undefined}
							onValueChange={(model) =>
								setSelectedModel(models.find((m) => m.model == model)!)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select a model" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{...models.map((m) => {
										return <SelectItem value={m.model}>{m.name}</SelectItem>;
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
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
					</div>
					<div className="flex gap-x-4">
						<Textarea
							className="h-40 resize-none"
							placeholder="Select an example to preview"
							value={
								selectedExample?.value
									? JSON.stringify(
											selectedExample?.value,
											null,
											prettyFormattingEnabled ? 2 : 0
									  )
									: ""
							}
							readOnly
						/>
						{selectedExample && selectedModel && (
							<div className="text-left">
								<h3>Tokens</h3>
								<p>
									{
										encoding_for_model(selectedModel.model).encode(
											JSON.stringify(selectedExample.value)
										).length
									}
								</p>
							</div>
						)}
					</div>
				</div>
				<div className="flex gap-x-4">
					<Textarea
						className="h-40 resize-none"
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
					{selectedExample && selectedModel && (
						<div className="text-left">
							<h3>Tokens</h3>
							<p>
								{
									encoding_for_model(selectedModel.model).encode(
										new Promptbuf(selectedExample.schema).encode(
											selectedExample.value
										)
									).length
								}
							</p>
							<p className="text-xs">{percentReduction}%</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Tokenizer;
