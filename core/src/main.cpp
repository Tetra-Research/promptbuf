#include "promptbuf.hpp"
#include <iostream>
#include <json.hpp>

void runTest(const std::string &testName, const nlohmann::json &schema, const nlohmann::json &original, PromptBuf &pb)
{
    std::cout << "\n=== " << testName << " ===\n";
    std::cout << "Original:\n"
              << original.dump() << std::endl;

    std::cout << "\n"
              << std::endl;

    std::string encoded = pb.encode(original);
    std::cout << "Encoded:\n"
              << encoded << std::endl;

    std::cout << "\n"
              << std::endl;

    nlohmann::json decoded = pb.decode(encoded, schema);
    std::cout << "Decoded:\n"
              << decoded.dump(2) << std::endl;

    std::cout << "\n"
              << std::endl;

    if (original == decoded)
    {
        std::cout << "Test passed: Original and decoded match.\n";
    }
    else
    {
        std::cout << "Test failed: Original and decoded do not match.\n";
    }
}

int main()
{
    PromptBuf pb;

    // Test 1: Basic int and string
    runTest("Basic int and string",
            {{"id", 0}, {"name", ""}},
            {{"id", 1}, {"name", "Tyler"}},
            pb);

    // Test 2: Boolean
    runTest("Boolean",
            {{"id", 0}, {"is_good", false}},
            {{"id", 1}, {"is_good", true}},
            pb);

    // Test 3: Multiple types
    runTest("Multiple types",
            {{"boolean_value", false}, {"integer_value", 0}, {"float_value", 0.0}, {"string_value", ""}},
            {{"boolean_value", false}, {"integer_value", 20}, {"float_value", 1.0}, {"string_value", "i'm a string!"}},
            pb);

    // Test 4: Null
    runTest("Null",
            {{"record", nullptr}, {"string_value", ""}},
            {{"record", nullptr}, {"string_value", "i'm a string!"}},
            pb);

    // Test 5: Primitive Array
    runTest("Primitive Array",
            {{"ids", nlohmann::json::array({0})}},
            {{"ids", {1, 2, 3, 4}}},
            pb);

    // Test 6: Double Booleans
    runTest("Double Booleans",
            {{"is_enabled", false}, {"is_disabled", false}},
            {{"is_enabled", true}, {"is_disabled", false}},
            pb);

    return 0;
}