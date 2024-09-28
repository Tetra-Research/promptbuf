import { JSONSchema7 } from "json-schema";
import { decode, encode } from "./promptbuf2";

const runTest = (name: string, schema: JSONSchema7, value: any) => {
	console.log(`\n=== ${name} ===`);
	const encoded = encode(value, schema);
	const decoded = decode(encoded, schema);

	const is_match = JSON.stringify(value) === JSON.stringify(decoded);

	if (!is_match) {
		console.log("Test failed!");
		console.log("Value:");
		console.log(JSON.stringify(value));

		console.log("\n");

		console.log("Encoded");
		console.log(encoded);

		console.log("\n");

		console.log("Decoded:");
		console.log(JSON.stringify(decoded));
	} else {
		console.log("Passed!");
	}
};

enum Color {
	RED = "red",
	GREEN = "green",
	BLUE = "blue",
}

const main = () => {
	/*
		Primitives
	*/
	runTest("Integer, single digit", { type: "integer" }, 1);
	runTest("Integer, many digits", { type: "integer" }, 15);
	runTest("Number, single digit", { type: "number" }, 2.5);
	runTest("Number, many digit", { type: "number" }, 2307.588);
	runTest("String", { type: "string" }, "Test string");
	runTest("Boolean", { type: "boolean" }, true);
	runTest("Null", { type: "null" }, null);
	runTest(
		"Enum",
		{ type: "string", enum: ["red", "green", "blue"] },
		Color.BLUE
	);
	/*
		Everything below here fails despite the encodings being correct visually in the logs
	*/
	runTest(
		"Array of integers, single digit",
		{ type: "array", items: { type: "integer" } },
		[1, 2]
	);
	runTest(
		"Array of integers, many digits",
		{ type: "array", items: { type: "integer" } },
		[11, 22]
	);
	runTest(
		"Array of numbers, single digit",
		{ type: "array", items: { type: "number" } },
		[1.5, 2.5]
	);
	runTest(
		"Array of numbers, many digits",
		{ type: "array", items: { type: "number" } },
		[11.55, 22.55]
	);
	runTest("Array of strings", { type: "array", items: { type: "string" } }, [
		"test",
		"string",
	]);
	runTest(
		"Array of enums",
		{
			type: "array",
			items: { type: "string", enum: ["red", "green", "blue"] },
		},
		[Color.BLUE, Color.GREEN, Color.RED]
	);
	runTest(
		"Simple object",
		{
			type: "object",
			properties: {
				name: { type: "string" },
				age: { type: "integer" },
				isEnabled: { type: "boolean" },
			},
		},
		{ name: "Tyler", age: 29, isEnabled: true }
	);
	runTest(
		"Simple object",
		{
			type: "object",
			properties: {
				name: { type: "string" },
				age: { type: "integer" },
				isEnabled: { type: "boolean" },
				ids: { type: "array", items: { type: "number" } },
			},
		},
		{ name: "Tyler", age: 29, isEnabled: false, ids: [1, 2, 3, 4, 5] }
	);
	runTest(
		"Nested objects",
		{
			type: "object",
			properties: {
				age: { type: "integer" },
				isEnabled: { type: "boolean" },
			},
		},
		{ age: 29, isEnabled: true }
	);
	runTest(
		"Nested objects",
		{
			type: "object",
			properties: {
				name: {
					type: "object",
					properties: { first: { type: "string" }, last: { type: "string" } },
				},
			},
		},
		{ name: { first: "Tyler", last: "O'Briant" } }
	);
	runTest(
		"Nested objects",
		{
			type: "object",
			properties: {
				name: {
					type: "object",
					properties: { first: { type: "string" }, last: { type: "string" } },
				},
				age: { type: "integer" },
				isEnabled: { type: "boolean" },
			},
		},
		{ name: { first: "Tyler", last: "O'Briant" }, age: 29, isEnabled: true }
	);
	runTest(
		"Nested objects",
		{
			type: "object",
			properties: {
				ids: {
					type: "array",
					items: { type: "integer" },
				},
				age: { type: "integer" },
				isEnabled: { type: "boolean" },
			},
		},
		{ ids: [1, 2, 3, 4, 5], age: 29, isEnabled: false }
	);
};

main();
