/*
The new schema we're aiming for is literally minifiying

so {} are objects, [] are arrays
booleans are 0/1
strings stay ""
nulls stay null
enums are their positional value
*/
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

export const encode = (v: any, s: JSONSchema7): string => {
	const output: string[] = [];

	__encode(v, s, output);

	return output.join(" ");
};

const __encode = (v: any, s: JSONSchema7, output: string[]) => {
	// if

	switch (s.type) {
		case "object":
			let ov: string[] = [];
			if (!s.properties) return "{}";

			const pKeys = Object.keys(s.properties);
			for (let i = 0; i < pKeys.length; i++) {
				__encode(v[pKeys[i]], s.properties[pKeys[i]] as JSONSchema7, ov);
			}

			output.push("{" + ov.join(" ") + "}");
			break;

		case "array":
			if (!s.items) return "[]";
			let av: string[] = [];

			// For now, we only support single-type arrays

			for (let i = 0; i < v.length; i++) {
				__encode(v[i], s.items as JSONSchema7, av);
			}

			output.push("[" + av.join(" ") + "]");
			break;

		case "string":
			if (s.enum) {
				output.push(s.enum.findIndex((k) => k === v).toString());
			} else {
				output.push(`"${v}"`);
			}
			break;

		case "integer":
		case "number":
			output.push(v.toString());
			break;
		case "boolean":
			output.push(v ? "1" : "0");
			break;

		case "null":
			output.push("null");
			break;

		default:
			return "";
	}
};

export const decode = (v: string, s: JSONSchema7) => {
	return __decode(v.split(""), s);
};

const __decode = (v: string[], s: JSONSchema7): any => {
	const char = v.shift();

	if (char === undefined) {
		return undefined;
	}

	switch (char) {
		case "{":
			return __decode_object(v, s);
		case "[":
			return __decode_array(v, s);
		case '"':
			return __decode_string(v);
		case " ":
		case "}":
		case "]":
			return __decode(v, s);
		default:
			v.unshift(char);
			return __decode_primitive(v, s);
	}
};

const __decode_object = (v: string[], s: JSONSchema7): any => {
	const o: any = {};

	if (!s.properties) return undefined;

	const pKeys = Object.keys(s.properties);

	for (let i = 0; i < pKeys.length; i++) {
		o[pKeys[i]] = __decode(v, s.properties[pKeys[i]] as JSONSchema7);
	}

	return o;
};

const __decode_array = (v: string[], s: JSONSchema7): any[] => {
	const a = [];
	while (v[0] !== "]") {
		a.push(__decode(v, s.items as JSONSchema7));
	}
	return a;
};

const __decode_string = (v: string[]) => {
	const value = read_until(v, ['"']);
	v.shift();
	return value;
};

const __decode_primitive = (v: string[], s: JSONSchema7) => {
	const value = read_until(v, [" ", "}", "]"]);

	switch (s.type) {
		case "integer":
			return parseInt(value, 10);
		case "number":
			return parseFloat(value);
		case "boolean":
			return value === "1";
		case "null":
			return null;
		case "string":
			if (s.enum) {
				return s.enum[parseInt(value, 10)];
			}
			return value;
	}
};

const read_until = (v: string[], delimiters: string[]) => {
	let value = "";

	while (v.length > 0 && !delimiters.includes(v[0])) {
		const char = v.shift();
		value += char;
	}

	return value;
};
