# Makefile for promptbuf Python project

# Python and virtual environment settings
PYTHON := python3
VENV := .venv
VENV_BIN := $(VENV)/bin

# Package information
PACKAGE_NAME := promptbuf

.PHONY: venv clean build install install-dev test lint upload

venv:
	${VENV}/bin/activate

clean:
	rm -rf build dist *.egg-info
	find . -type d -name "__pycache__" -exec rm -rf {} +

# build: clean
# 	python -m build

build: clean
	python setup.py sdist bdist_wheel

upload: build
	twine upload dist/*
	clean

# Install requirements
install:
	pip install -r requirements.txt

# Install promptbuf
install-promptbuf:
	pip install .

install-promptbuf-dev:
	pip install -e .

test:
	pytest