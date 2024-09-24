#include "promptbuf.hpp"
#include <iostream>
#include <json.hpp>

int main()
{
    PromptBuf pb;

    std::cout << "\n\n";

    // Basic int and string
    nlohmann::json schema = {
        {"id", 0},
        {"name", ""}};

    nlohmann::json original = {
        {"id", 1},
        {"name", "Tyler"}};

    // std::cout << "Schema " << schema << std::endl;
    std::cout << "Original " << original << std::endl;

    std::string encoded = pb.encode(original);
    std::cout << "Encoded: " << encoded << std::endl;

    nlohmann::json decoded = pb.decode(encoded, schema);
    std::cout << "Decoded: " << decoded.dump() << std::endl;

    std::cout << "\n\n";

    // Boolean
    schema = {
        {"id", 0},
        {"is_good", false}};

    original = {
        {"id", 1},
        {"is_good", true}};

    // std::cout << "Schema " << schema << std::endl;
    std::cout << "Original " << original << std::endl;

    encoded = pb.encode(original);
    std::cout << "Encoded: " << encoded << std::endl;

    decoded = pb.decode(encoded, schema);
    std::cout << "Decoded: " << decoded.dump() << std::endl; // not working

    std::cout << "\n\n";

    // Array
    schema = {
        {"boolean_value", false},
        {"integer_value", 0},
        {"float_value", 0.0},
        {"string_value", ""}};

    original = {
        {"boolean_value", false},
        {"integer_value", 20},
        {"float_value", 1.0},
        {"string_value", "i'm a string!"}};

    // std::cout << "Schema " << schema << std::endl;
    std::cout << "Original " << original << std::endl;

    encoded = pb.encode(original);
    std::cout << "Encoded: " << encoded << std::endl;

    decoded = pb.decode(encoded, schema);
    std::cout << "Decoded: " << decoded.dump() << std::endl;

    std::cout << "\n\n";

    // Null
    schema = {
        {"record", nullptr},
        {"string_value", "i'm a string!"}};

    original = {
        {"record", nullptr},
        {"string_value", "i'm a string!"}};

    // std::cout << "Schema " << schema << std::endl;
    std::cout << "Original " << original << std::endl;

    encoded = pb.encode(original);
    std::cout << "Encoded: " << encoded << std::endl;

    decoded = pb.decode(encoded, schema);
    std::cout << "Decoded: " << decoded.dump() << std::endl;

    std::cout << "\n\n";

    // Array
    schema = {{"ids", nlohmann::json::array({0})}};
    original = {{"ids", {1, 2, 3, 4}}};

    encoded = pb.encode(original);
    std::cout << "Encoded: " << encoded << std::endl;

    decoded = pb.decode(encoded, schema);
    std::cout << "Decoded: " << decoded.dump() << std::endl;

    std::cout << "\n\n";

    // Null
    schema = {
        {"is_enabled", false},
        {"is_disabled", false},
    };

    original = {
        {"is_enabled", true},
        {"is_disabled", false},
    };

    // std::cout << "Schema " << schema << std::endl;
    std::cout << "Original " << original << std::endl;

    encoded = pb.encode(original);
    std::cout << "Encoded: " << encoded << std::endl;

    decoded = pb.decode(encoded, schema);
    std::cout << "Decoded: " << decoded.dump() << std::endl;

    std::cout << "\n\n";

    return 0;
}