#!/bin/bash

if test -d venv/lib/python3.11/site-packages; then
  if test -f lambda_package.zip; then
    rm lambda_package.zip
  fi

  zip -r lambda_package.zip venv/lib/python3.11/site-packages
  zip lambda_package.zip lambda_function.py

  exit 0
else
  echo "Missing venv, stopping build"
  exit 1
fi