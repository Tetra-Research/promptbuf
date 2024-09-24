#include "promptbuf.hpp"
#include <sstream>

#include <string>
#include <vector>
#include <sstream>
#include <json.hpp>
#include <iostream>

using json = nlohmann::json;

std::string PromptBuf::encode(const json &j)
{
    std::ostringstream oss;
    encodeValue(j, oss);
    return oss.str();
}

json PromptBuf::decode(const std::string &minified, const json &schema)
{
    std::istringstream iss(minified);
    return decodeValue(iss, schema);
}

void PromptBuf::encodeValue(const json &j, std::ostringstream &oss)
{
    if (j.is_object())
    {
        oss << "[";
        for (auto it = j.begin(); it != j.end(); ++it)
        {
            encodeValue(it.value(), oss);
            if (std::next(it) != j.end())
                oss << " ";
        }
        oss << "]";
    }
    else if (j.is_array())
    {
        oss << "{";
        for (size_t i = 0; i < j.size(); ++i)
        {
            encodeValue(j[i], oss);
            if (i < j.size() - 1)
                oss << " ";
        }
        oss << "}";
    }
    else if (j.is_string())
    {
        oss << "\"" << j.get<std::string>() << "\"";
    }
    else if (j.is_number())
    {
        oss << j.get<double>();
    }
    else if (j.is_boolean())
    {
        oss << (j.get<bool>() ? "1" : "0");
    }
    else if (j.is_null())
    {
        oss << "null";
    }
}

json PromptBuf::decodeValue(std::istringstream &iss, const json &schema)
{
    char c;
    iss >> c;
    if (c == '[')
    {
        json obj;
        auto it = schema.begin();
        while (iss.peek() != ']' && it != schema.end())
        {
            obj[it.key()] = decodeValue(iss, it.value());
            ++it;
            if (iss.peek() == ',')
                iss.get();
        }
        iss.get(); // consume ']'
        return obj;
    }
    else if (c == '{')
    {
        json arr = json::array();
        json element_schema = schema.is_array() ? schema[0] : schema;
        while (iss.peek() != '}')
        {
            std::string value;

            char ch;
            while (iss.get(ch) && ch != ' ' && ch != ',' && ch != '}')
            {
                value += ch;
            }
            if (ch == '}')
            {
                iss.putback(ch);
            }

            if (element_schema.is_number_integer())
            {
                arr.push_back(std::stoi(value));
            }
            else if (element_schema.is_number_float())
            {
                arr.push_back(std::stod(value));
            }
            else if (element_schema.is_boolean())
            {
                arr.push_back(value == "1");
            }
            else
            {
                arr.push_back(value);
            }

            if (iss.peek() == ',')
            {
                std::cout << "Jumping" << std::endl;
                iss.get();
            }
        }

        iss.get(); // consume '}'

        return arr;
    }
    else if (c == '"')
    {
        std::string value;
        std::getline(iss, value, '"');
        return value;
    }
    else
    {
        iss.putback(c);
        std::string value;

        char ch;
        while (iss.get(ch) && ch != ' ' && ch != ',' && ch != '}' && ch != ']')
        {
            value += ch;
        }
        if (ch == ']')
        {
            iss.putback(ch);
        }

        if (schema.is_boolean())
        {
            return (value == "1");
        }
        else if (schema.is_number_integer())
        {
            return std::stoi(value);
        }
        else if (schema.is_number_float())
        {
            return std::stod(value);
        }
        else if (schema.is_string())
        {
            return value;
        }
        else if (value == "null")
        {
            return nullptr;
        }
        else
        {
            return value;
        }
    }
};