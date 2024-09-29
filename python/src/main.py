from typing import Any, Dict
from enum import Enum
import json
from python.src.promptbuf import (
    encode,
    decode,
)

JSONSchema = Dict[
    str, Any
]  # need to flesh out the type here so we have support across TS and Python


def run_test(name: str, schema: JSONSchema, value: Any):
    print(f"\n=== {name} ===")
    encoded = encode(value, schema)
    decoded = decode(encoded, schema)

    is_match = json.dumps(value) == json.dumps(decoded)

    if not is_match:
        print("Test failed!")
        print("Value:")
        print(json.dumps(value))

        print("\n")

        print("Encoded")
        print(encoded)

        print("\n")

        print("Decoded:")
        print(json.dumps(decoded))
    else:
        print("Passed!")


class Color(Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"


def main():
    # Primitives
    run_test("Integer, single digit", {"type": "integer"}, 1)
    run_test("Integer, many digits", {"type": "integer"}, 15)
    run_test("Number, single digit", {"type": "number"}, 2.5)
    run_test("Number, many digit", {"type": "number"}, 2307.588)
    run_test("String", {"type": "string"}, "Test string")
    run_test("Boolean", {"type": "boolean"}, True)
    run_test("Null", {"type": "null"}, None)
    run_test(
        "Enum", {"type": "string", "enum": ["red", "green", "blue"]}, Color.BLUE.value
    )

    # Everything below here fails despite the encodings being correct visually in the logs
    run_test(
        "Array of integers, single digit",
        {"type": "array", "items": {"type": "integer"}},
        [1, 2],
    )
    run_test(
        "Array of integers, many digits",
        {"type": "array", "items": {"type": "integer"}},
        [11, 22],
    )
    run_test(
        "Array of numbers, single digit",
        {"type": "array", "items": {"type": "number"}},
        [1.5, 2.5],
    )
    run_test(
        "Array of numbers, many digits",
        {"type": "array", "items": {"type": "number"}},
        [11.55, 22.55],
    )
    run_test(
        "Array of strings",
        {"type": "array", "items": {"type": "string"}},
        ["test", "string"],
    )
    run_test(
        "Array of enums",
        {
            "type": "array",
            "items": {"type": "string", "enum": ["red", "green", "blue"]},
        },
        [Color.BLUE.value, Color.GREEN.value, Color.RED.value],
    )
    run_test(
        "Simple object",
        {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer"},
                "isEnabled": {"type": "boolean"},
            },
        },
        {"name": "Tyler", "age": 29, "isEnabled": True},
    )
    run_test(
        "Simple object with array",
        {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer"},
                "isEnabled": {"type": "boolean"},
                "ids": {"type": "array", "items": {"type": "integer"}},
            },
        },
        {"name": "Tyler", "age": 29, "isEnabled": False, "ids": [1, 2, 3, 4, 5]},
    )
    run_test(
        "Nested objects",
        {
            "type": "object",
            "properties": {
                "age": {"type": "integer"},
                "isEnabled": {"type": "boolean"},
            },
        },
        {"age": 29, "isEnabled": True},
    )
    run_test(
        "Nested objects with name",
        {
            "type": "object",
            "properties": {
                "name": {
                    "type": "object",
                    "properties": {
                        "first": {"type": "string"},
                        "last": {"type": "string"},
                    },
                },
            },
        },
        {"name": {"first": "Tyler", "last": "O'Briant"}},
    )
    run_test(
        "Complex nested object",
        {
            "type": "object",
            "properties": {
                "name": {
                    "type": "object",
                    "properties": {
                        "first": {"type": "string"},
                        "last": {"type": "string"},
                    },
                },
                "age": {"type": "integer"},
                "isEnabled": {"type": "boolean"},
            },
        },
        {"name": {"first": "Tyler", "last": "O'Briant"}, "age": 29, "isEnabled": True},
    )
    run_test(
        "Object with array and primitives",
        {
            "type": "object",
            "properties": {
                "ids": {
                    "type": "array",
                    "items": {"type": "integer"},
                },
                "age": {"type": "integer"},
                "isEnabled": {"type": "boolean"},
            },
        },
        {"ids": [1, 2, 3, 4, 5], "age": 29, "isEnabled": False},
    )


if __name__ == "__main__":
    main()
