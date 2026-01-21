#!/bin/bash

echo "🧪 Testing package with CSS import..."

# Create test directory
TEST_DIR="test-css-import"
if [ -d "$TEST_DIR" ]; then
  rm -rf "$TEST_DIR"
fi

# Build and pack
npm run build
cp lib-package.json dist/package.json
cp README.md dist/
cd dist
npm pack
TARBALL=$(ls *.tgz | head -1)
mv $TARBALL ../
cd ..

# Create minimal test
mkdir $TEST_DIR
cd $TEST_DIR

# Install local package
npm init -y
npm install ../$TARBALL

# Test CSS import
node -e "
try {
  const fs = require('fs');
  const path = './node_modules/react-spreadsheet-editor/styles.css';
  if (fs.existsSync(path)) {
    console.log('✅ CSS file exists');
    const content = fs.readFileSync(path, 'utf8');
    if (content.includes('--background') && content.includes('tailwind')) {
      console.log('✅ CSS content is correct');
    } else {
      console.log('❌ CSS content is missing expected styles');
    }
  } else {
    console.log('❌ CSS file not found');
  }
} catch (e) {
  console.log('❌ Error:', e.message);
}
"

cd ..
rm -rf $TEST_DIR
rm $TARBALL

echo "✅ Test completed!"