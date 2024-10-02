import { JSONSchema7 } from "json-schema";

export class Promptbuf {
	schema: JSONSchema7;

	constructor(schema: JSONSchema7) {
		this.schema = schema;
	}

	public encode(value: any): string {
		const output: string[] = [];

		this.__encode(value, this.schema, output);

		return output.join(" ");
	}

	private __encode(v: any, s: JSONSchema7, output: string[]) {
		switch (s.type) {
			case "object":
				let ov: string[] = [];
				if (!s.properties) return "{}";

				const pKeys = Object.keys(s.properties);
				for (let i = 0; i < pKeys.length; i++) {
					this.__encode(v[pKeys[i]], s.properties[pKeys[i]] as JSONSchema7, ov);
				}

				output.push("{" + ov.join(" ") + "}");
				break;

			case "array":
				// For now, arrays can only contain a single type
				if (!s.items) return "[]";
				let av: string[] = [];

				for (let i = 0; i < v.length; i++) {
					this.__encode(v[i], s.items as JSONSchema7, av);
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
	}

	public decode(v: string): any {
		return this.__decode(v.split(""), this.schema);
	}

	private __decode(v: any, s: JSONSchema7): any {
		const char = v.shift();

		if (char === undefined) {
			return undefined;
		}

		switch (char) {
			case "{":
				return this.__decode_object(v, s);
			case "[":
				return this.__decode_array(v, s);
			case '"':
				return this.__decode_string(v);
			case " ":
			case "}":
			case "]":
				return this.__decode(v, s);
			default:
				v.unshift(char);
				return this.__decode_primitive(v, s);
		}
	}

	private __decode_object(v: string[], s: JSONSchema7): any {
		const o: any = {};

		if (!s.properties) return undefined;

		const pKeys = Object.keys(s.properties);

		for (let i = 0; i < pKeys.length; i++) {
			o[pKeys[i]] = this.__decode(v, s.properties[pKeys[i]] as JSONSchema7);
		}

		return o;
	}

	private __decode_array(v: string[], s: JSONSchema7): any[] {
		const a = [];

		while (v.length > 0 && v[0] !== "]") {
			const value = this.__decode(v, s.items as JSONSchema7);

			if (value !== undefined) {
				a.push(value);
			}
		}

		return a;
	}

	private __decode_string(v: string[]) {
		const value = this.read_until(v, ['"']);
		v.shift();
		return value;
	}

	private __decode_primitive(v: string[], s: JSONSchema7): any {
		const value = this.read_until(v, [" ", "}", "]"]);

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
	}

	private read_until(v: string[], delimiters: string[]): string {
		let value = "";

		while (v.length > 0 && !delimiters.includes(v[0])) {
			const char = v.shift();
			value += char;
		}

		return value;
	}
}
