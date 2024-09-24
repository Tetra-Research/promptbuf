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
};