import json
from typing import Any, Dict
from enum import Enum
import pytest
from promptbuf import Promptbuf

JSONSchema = Dict[str, Any]


class Color(Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"


def run_test(name: str, schema: JSONSchema, value: Any):
    pb = Promptbuf(schema)
    encoded = pb.encode(value)
    decoded = pb.decode(encoded)
    assert json.dumps(value) == json.dumps(decoded), f"Test failed: {name}"


@pytest.mark.parametrize(
    "name,schema,value",
    [
        ("Integer, single digit", {"type": "integer"}, 1),
        ("Integer, many digits", {"type": "integer"}, 15),
        ("Number, single digit", {"type": "number"}, 2.5),
        ("Number, many digit", {"type": "number"}, 2307.588),
        ("String", {"type": "string"}, "Test string"),
        ("Boolean", {"type": "boolean"}, True),
        ("Null", {"type": "null"}, None),
        (
            "Enum",
            {"type": "string", "enum": ["red", "green", "blue"]},
            Color.BLUE.value,
        ),
    ],
)
def test_primitives(name, schema, value):
    run_test(name, schema, value)


@pytest.mark.parametrize(
    "name,schema,value",
    [
        (
            "Array of integers, single digit",
            {"type": "array", "items": {"type": "integer"}},
            [1, 2],
        ),
        (
            "Array of integers, many digits",
            {"type": "array", "items": {"type": "integer"}},
            [11, 22],
        ),
        (
            "Array of numbers, single digit",
            {"type": "array", "items": {"type": "number"}},
            [1.5, 2.5],
        ),
        (
            "Array of numbers, many digits",
            {"type": "array", "items": {"type": "number"}},
            [11.55, 22.55],
        ),
        (
            "Array of strings",
            {"type": "array", "items": {"type": "string"}},
            ["test", "string"],
        ),
        (
            "Array of enums",
            {
                "type": "array",
                "items": {"type": "string", "enum": ["red", "green", "blue"]},
            },
            [Color.BLUE.value, Color.GREEN.value, Color.RED.value],
        ),
    ],
)
def test_arrays(name, schema, value):
    run_test(name, schema, value)


@pytest.mark.parametrize(
    "name,schema,value",
    [
        (
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
        ),
        (
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
        ),
        (
            "Nested objects",
            {
                "type": "object",
                "properties": {
                    "age": {"type": "integer"},
                    "isEnabled": {"type": "boolean"},
                },
            },
            {"age": 29, "isEnabled": True},
        ),
        (
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
        ),
        (
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
            {
                "name": {"first": "Tyler", "last": "O'Briant"},
                "age": 29,
                "isEnabled": True,
            },
        ),
        (
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
        ),
        (
            "Nested array of objects",
            {
                "type": "object",
                "properties": {
                    "employees": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                },
                                "role": {
                                    "type": "string",
                                },
                                "salary": {
                                    "type": "integer",
                                },
                            },
                        },
                    },
                },
            },
            {
                "employees": [
                    {
                        "name": "Alice",
                        "role": "Developer",
                        "salary": 70000,
                    },
                    {
                        "name": "Bob",
                        "role": "Designer",
                        "salary": 60000,
                    },
                ],
            },
        ),
    ],
)
def test_objects(name, schema, value):
    run_test(name, schema, value)
