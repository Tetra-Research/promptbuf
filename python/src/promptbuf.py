from typing import Any, Dict, List, Union

JSONSchema = Dict[str, Any]


def encode(v: Any, s: JSONSchema) -> str:
    output = []

    __encode(v, s, output)

    return " ".join(output)


def __encode(v: Any, s: JSONSchema, output: List[str]):
    s_type = s.get("type")

    if s_type == "object":
        ov = []
        if not s.get("properties"):
            return "{}"

        p_keys = list(s["properties"].keys())
        for key in p_keys:
            __encode(v.get(key), s["properties"][key], ov)

        output.append("{" + " ".join(ov) + "}")

    elif s_type == "array":
        if not s.get("items"):
            return "[]"
        av = []

        for item in v:
            __encode(item, s["items"], av)

        output.append("[" + " ".join(av) + "]")

    elif s_type == "string":
        if s.get("enum"):
            output.append(str(s["enum"].index(v)))
        else:
            output.append(f'"{v}"')

    elif s_type in ["integer", "number"]:
        output.append(str(v))

    elif s_type == "boolean":
        output.append("1" if v else "0")

    elif s_type == "null":
        output.append("null")

    else:
        return ""


def decode(v: str, s: JSONSchema) -> Any:
    return __decode(list(v), s)


def __decode(v: List[str], s: JSONSchema) -> Any:
    if not v:
        return None

    char = v.pop(0)

    if char == "{":
        return __decode_object(v, s)
    elif char == "[":
        return __decode_array(v, s)
    elif char == '"':
        return __decode_string(v)
    elif char in [" ", "}", "]"]:
        return __decode(v, s)
    else:
        v.insert(0, char)
        return __decode_primitive(v, s)


def __decode_object(v: List[str], s: JSONSchema) -> Dict[str, Any]:
    o = {}

    if not s.get("properties"):
        return None

    p_keys = list(s["properties"].keys())

    for key in p_keys:
        o[key] = __decode(v, s["properties"][key])

    return o


def __decode_array(v: List[str], s: JSONSchema) -> List[Any]:
    a = []
    while v[0] != "]":
        a.append(__decode(v, s["items"]))
    v.pop(0)  # Remove the closing bracket
    return a


def __decode_string(v: List[str]) -> str:
    value = read_until(v, ['"'])
    v.pop(0)  # Remove the closing quote
    return value


def __decode_primitive(
    v: List[str], s: JSONSchema
) -> Union[int, float, bool, None, str]:
    value = read_until(v, [" ", "}", "]"])

    s_type = s.get("type")

    if s_type == "integer":
        return int(value)
    elif s_type == "number":
        return float(value)
    elif s_type == "boolean":
        return value == "1"
    elif s_type == "null":
        return None
    elif s_type == "string":
        if s.get("enum"):
            return s["enum"][int(value)]
        return value


def read_until(v: List[str], delimiters: List[str]) -> str:
    value = ""

    while v and v[0] not in delimiters:
        value += v.pop(0)

    return value
