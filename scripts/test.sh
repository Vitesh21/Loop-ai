#!/bin/bash

# Generate mock data
echo "Generating mock data..."
npm run generate-mock-data

# Run tests
echo "Running tests..."
npm test
