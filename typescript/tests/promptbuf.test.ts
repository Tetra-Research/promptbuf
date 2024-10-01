import { JSONSchema7 } from "json-schema";
import { Promptbuf } from "../src/promptbuf";

const runTest = (name: string, schema: JSONSchema7, value: any) => {
	const pb = new Promptbuf(schema);
	const encoded = pb.encode(value);
	const decoded = pb.decode(encoded);

	expect(decoded).toEqual(value);
};

enum Color {
	RED = "red",
	GREEN = "green",
	BLUE = "blue",
}

describe("Promptbuf encoding and decoding tests", () => {
	/*
		Primitives
	*/
	test("Integer, single digit", () => {
		runTest("Integer, single digit", { type: "integer" }, 1);
	});

	test("Integer, many digits", () => {
		runTest("Integer, many digits", { type: "integer" }, 15);
	});

	test("Number, single digit", () => {
		runTest("Number, single digit", { type: "number" }, 2.5);
	});

	test("Number, many digits", () => {
		runTest("Number, many digits", { type: "number" }, 2307.588);
	});

	test("String", () => {
		runTest("String", { type: "string" }, "Test string");
	});

	test("Boolean", () => {
		runTest("Boolean", { type: "boolean" }, true);
	});

	test("Null", () => {
		runTest("Null", { type: "null" }, null);
	});

	test("Enum", () => {
		runTest(
			"Enum",
			{ type: "string", enum: ["red", "green", "blue"] },
			Color.BLUE
		);
	});

	/*
		Arrays
	*/
	test("Array of integers, single digit", () => {
		runTest(
			"Array of integers, single digit",
			{ type: "array", items: { type: "integer" } },
			[1, 2]
		);
	});

	test("Array of integers, many digits", () => {
		runTest(
			"Array of integers, many digits",
			{ type: "array", items: { type: "integer" } },
			[11, 22]
		);
	});

	test("Array of numbers, single digit", () => {
		runTest(
			"Array of numbers, single digit",
			{ type: "array", items: { type: "number" } },
			[1.5, 2.5]
		);
	});

	test("Array of numbers, many digits", () => {
		runTest(
			"Array of numbers, many digits",
			{ type: "array", items: { type: "number" } },
			[11.55, 22.55]
		);
	});

	test("Array of strings", () => {
		runTest("Array of strings", { type: "array", items: { type: "string" } }, [
			"test",
			"string",
		]);
	});

	test("Array of enums", () => {
		runTest(
			"Array of enums",
			{
				type: "array",
				items: { type: "string", enum: ["red", "green", "blue"] },
			},
			[Color.BLUE, Color.GREEN, Color.RED]
		);
	});

	/*
		Objects
	*/
	test("Simple object", () => {
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
	});

	test("Simple object with array", () => {
		runTest(
			"Simple object with array",
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
	});

	test("Nested objects", () => {
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
	});

	test("Nested objects with name", () => {
		runTest(
			"Nested objects with name",
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
	});

	test("Nested objects with age and name", () => {
		runTest(
			"Nested objects with age and name",
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
	});

	test("Nested objects with array", () => {
		runTest(
			"Nested objects with array",
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
	});
});
