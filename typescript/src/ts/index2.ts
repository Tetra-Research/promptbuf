import { JSONSchema7 } from "json-schema";
import { encode } from "./promptbuf2";

const runTest = (name: string, schema: JSONSchema7, value: any) => {
	console.log(`\n=== ${name} ===`);
	console.log("Value:");
	console.log(JSON.stringify(value, null, 2));

	console.log("\n");

	console.log("Encoded");
	const encoded = encode(value, schema);
	console.log(encoded);

	// console.log("\n");

	// const decoded = "";
	// console.log("Decoded:");
	// console.log(decoded);

	// if (JSON.stringify(value) !== JSON.stringify(decoded)) {
	// 	console.log("Test failed: Original and decoded do not match.");
	// }
};

enum Color {
	RED = "red",
	GREEN = "green",
	BLUE = "blue",
}

const main = () => {
	// runTest("Integer, single digit", { type: "integer" }, 1);
	// runTest("Integer, many digits", { type: "integer" }, 15);
	// runTest("Number, single digit", { type: "number" }, 2.5);
	// runTest("Number, many digit", { type: "number" }, 2307.588);
	// runTest("String", { type: "string" }, "Test string");
	// runTest("Null", { type: "null" }, null);
	// runTest(
	// 	"Enum",
	// 	{ type: "string", enum: ["red", "green", "blue"] },
	// 	Color.BLUE
	// );
	// runTest(
	// 	"Array of integers, single digit",
	// 	{ type: "array", items: { type: "integer" } },
	// 	[1, 2]
	// );
	// runTest(
	// 	"Array of integers, many digits",
	// 	{ type: "array", items: { type: "integer" } },
	// 	[11, 22]
	// );
	// runTest(
	// 	"Array of numbers, single digit",
	// 	{ type: "array", items: { type: "number" } },
	// 	[1.5, 2.5]
	// );
	// runTest(
	// 	"Array of numbers, many digits",
	// 	{ type: "array", items: { type: "number" } },
	// 	[11.55, 22.55]
	// );
	// runTest("Array of strings", { type: "array", items: { type: "string" } }, [
	// 	"test",
	// 	"string",
	// ]);
	// runTest(
	// 	"Array of enums",
	// 	{
	// 		type: "array",
	// 		items: { type: "string", enum: ["red", "green", "blue"] },
	// 	},
	// 	[Color.BLUE, Color.GREEN, Color.RED]
	// );
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

		{ name: "Tyler", age: 29, isEnabled: true, ids: [1, 2, 3, 4, 5] }
	);
};

main();
