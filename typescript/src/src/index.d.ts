import { JSONSchema7 } from "json-schema";
export declare class Promptbuf {
    schema: JSONSchema7;
    constructor(schema: JSONSchema7);
    encode(value: any): string;
    private __encode;
    decode(v: string): any;
    private __decode;
    private __decode_object;
    private __decode_array;
    private __decode_string;
    private __decode_primitive;
    private read_until;
}
