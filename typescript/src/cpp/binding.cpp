#include "../../core/src/promptbuf.hpp"
#include <emscripten/bind.h>
#include "../../core/include/json.hpp "

using json = nlohmann::json;

// Wrapper functions to handle string conversion
std::string encode_wrapper(const std::string &json_string)
{
    json j = json::parse(json_string);
    return PromptBuf::encode(j);
}

std::string decode_wrapper(const std::string &minified, const std::string &schema_string)
{
    json schema = json::parse(schema_string);
    json result = PromptBuf::decode(minified, schema);
    return result.dump();
}

EMSCRIPTEN_BINDINGS(promptbuf_module)
{
    emscripten::function("encode", &encode_wrapper);
    emscripten::function("decode", &decode_wrapper);
}