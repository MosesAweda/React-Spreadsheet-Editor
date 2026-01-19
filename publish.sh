#!/bin/bash

# Build the library
echo "Building library..."
npm run build

# Copy lib-package.json to package.json for publishing
echo "Preparing package.json..."
cp lib-package.json dist/package.json

# Copy README.md to dist folder
echo "Copying README..."
cp README.md dist/

# Publish to npm
echo "Publishing to npm..."
cd dist
npm publish

# Clean up
echo "Cleaning up..."
cd ..

echo "✅ Published successfully!"