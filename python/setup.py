from setuptools import setup, find_packages

setup(
    name="promptbuf",
    version="0.1.1",
    author="Tyler O'Briant",
    author_email="tyler@tetraresearch.io",
    description="A brief description of promptbuf",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/Tetra-Research/promptbuf",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[],
)
