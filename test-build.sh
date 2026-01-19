#!/bin/bash

echo "🧪 Quick build test..."

# Build the library
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "📦 Generated files:"
  ls -la dist/
  
  echo ""
  echo "📋 Package contents:"
  cp lib-package.json package.json
  cp README.md dist/
  cd dist
  npm pack --dry-run
  cd ..
  git checkout package.json
else
  echo "❌ Build failed!"
  exit 1
fi