#pragma once

#include <string>
#include <json.hpp>

class PromptBuf
{
public:
    std::string encode(const nlohmann::json &j);
    nlohmann::json decode(const std::string &encoded, const nlohmann::json &schema);

private:
    void encodeValue(const nlohmann::json &j, std::ostringstream &oss);
    nlohmann::json decodeValue(std::istringstream &iss, const nlohmann::json &schema);
    nlohmann::json decodeObject(std::istringstream &iss, const nlohmann::json &schema);
    nlohmann::json decodeArray(std::istringstream &iss, const nlohmann::json &schema);
    std::string decodeString(std::istringstream &iss);
    nlohmann::json decodePrimitive(std::istringstream &iss, char firstChar, const nlohmann::json &schema);
    std::string readUntil(std::istringstream &iss, const std::string &delimiters);
};