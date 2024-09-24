cmake_minimum_required(VERSION 3.10)
project(promptbuf)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add the library
add_library(promptbuf src/promptbuf.cpp)
target_include_directories(promptbuf PUBLIC 
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${CMAKE_CURRENT_SOURCE_DIR}/include)

# Main executable
add_executable(promptbuf_demo src/main.cpp)
target_link_libraries(promptbuf_demo PRIVATE promptbuf)
