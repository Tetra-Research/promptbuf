import PromptBuf from "./promptbuf";
import { JSONSchema7 } from "json-schema";

function runTest(testName: string, schema: JSONSchema7, original: any): void {
	console.log(`\n=== ${testName} ===`);
	console.log("Original:");
	console.log(JSON.stringify(original, null, 2));

	console.log("\n");

	const encoded = PromptBuf.encode(original);
	console.log("Encoded:");
	console.log(encoded);

	console.log("\n");

	const decoded = PromptBuf.decode(encoded, schema);
	console.log("Decoded:");
	console.log(JSON.stringify(decoded, null, 2));

	if (JSON.stringify(original) !== JSON.stringify(decoded)) {
		console.log("Test failed: Original and decoded do not match.");
	}
}

function main() {
	// Test 1: Basic int and string
	runTest(
		"Basic int and string",
		{
			type: "object",
			properties: {
				id: { type: "integer" },
				name: { type: "string" },
			},
		},
		{ id: 1, name: "Tyler" }
	);

	// Test 2: Boolean
	runTest(
		"Boolean",
		{
			type: "object",
			properties: {
				id: { type: "integer" },
				is_good: { type: "boolean" },
			},
		},
		{ id: 1, is_good: true }
	);

	// Test 3: Multiple types
	runTest(
		"Multiple types",
		{
			type: "object",
			properties: {
				boolean_value: { type: "boolean" },
				integer_value: { type: "integer" },
				float_value: { type: "number" },
				string_value: { type: "string" },
			},
		},
		{
			boolean_value: false,
			integer_value: 20,
			float_value: 1.0,
			string_value: "i'm a string!",
		}
	);

	// Test 4: Null
	runTest(
		"Null",
		{
			type: "object",
			properties: {
				record: { type: "null" },
				string_value: { type: "string" },
			},
		},
		{ record: null, string_value: "i'm a string!" }
	);

	// Test 5: Primitive Array
	runTest(
		"Primitive Array",
		{
			type: "object",
			properties: {
				ids: {
					type: "array",
					items: { type: "integer" },
				},
			},
		},
		{ ids: [1, 2, 3, 4] }
	);

	// Test 6: Double Booleans
	runTest(
		"Double Booleans",
		{
			type: "object",
			properties: {
				is_enabled: { type: "boolean" },
				is_disabled: { type: "boolean" },
			},
		},
		{ is_enabled: true, is_disabled: false }
	);

	console.log("\n\n");
}

main();
