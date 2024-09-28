import { JSONSchema7 } from "json-schema";

class PromptBuf {
	static encode(j: any): string {
		const oss: string[] = [];
		this.encodeValue(j, oss);
		return oss.join("");
	}

	static decode(minified: string, schema: JSONSchema7): any {
		const iss = minified.split("");
		return this.decodeValue(iss, schema);
	}

	private static encodeValue(j: any, oss: string[]): void {
		if (typeof j === "object" && j !== null) {
			if (Array.isArray(j)) {
				oss.push("{");
				for (let i = 0; i < j.length; i++) {
					this.encodeValue(j[i], oss);
					if (i < j.length - 1) oss.push(" ");
				}
				oss.push("}");
			} else {
				oss.push("[");
				const keys = Object.keys(j);
				for (let i = 0; i < keys.length; i++) {
					this.encodeValue(j[keys[i]], oss);
					if (i < keys.length - 1) oss.push(" ");
				}
				oss.push("]");
			}
		} else if (typeof j === "string") {
			oss.push(`"${j}"`);
		} else if (typeof j === "number") {
			oss.push(j.toString());
		} else if (typeof j === "boolean") {
			oss.push(j ? "1" : "0");
		} else if (j === null) {
			oss.push("null");
		}
	}

	private static decodeValue(iss: string[], schema: JSONSchema7): any {
		const c = iss.shift();

		if (c === "[") {
			return this.decodeObject(iss, schema);
		} else if (c === "{") {
			return this.decodeArray(iss, schema);
		} else if (c === '"') {
			return this.decodeString(iss);
		} else {
			iss.unshift(c!);
			return this.decodePrimitive(iss, schema);
		}
	}

	private static decodeObject(iss: string[], schema: JSONSchema7): any {
		const obj: any = {};
		const properties = schema.properties || {};
		const keys = Object.keys(properties);
		let i = 0;

		while (iss[0] !== "]" && i < keys.length) {
			obj[keys[i]] = this.decodeValue(iss, properties[keys[i]] as JSONSchema7);
			i++;
			if (iss[0] === ",") iss.shift();
		}
		iss.shift(); // consume ']'
		return obj;
	}

	private static decodeArray(iss: string[], schema: JSONSchema7): any[] {
		const arr: any[] = [];
		const elementSchema = Array.isArray(schema.items)
			? schema.items[0]
			: schema.items || {};

		while (iss[0] !== "}") {
			const nextChar = iss.shift()!;
			iss.unshift(nextChar);
			arr.push(this.decodePrimitive(iss, elementSchema as JSONSchema7));
		}
		iss.shift(); // consume '}'
		return arr;
	}

	private static decodeString(iss: string[]): string {
		let value = "";
		let char;
		while ((char = iss.shift()) !== '"') {
			value += char;
		}
		return value;
	}

	private static decodePrimitive(iss: string[], schema: JSONSchema7): any {
		const value = this.readUntil(iss, " }]");

		if (schema.type === "boolean") {
			return value === "1";
		} else if (schema.type === "integer") {
			return parseInt(value, 10);
		} else if (schema.type === "number") {
			return parseFloat(value);
		} else if (value === "null") {
			return null;
		} else {
			return value;
		}
	}

	private static readUntil(iss: string[], delimiters: string): string {
		let value = "";
		let char;
		while (iss.length > 0 && !delimiters.includes(iss[0])) {
			char = iss.shift();
			value += char;
		}
		return value;
	}
}

export default PromptBuf;
