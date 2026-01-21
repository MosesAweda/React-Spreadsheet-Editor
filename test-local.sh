#!/bin/bash

echo "🧪 Testing React Spreadsheet Editor locally..."

# Build the library
echo "📦 Building library..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Create a tarball for local testing
echo "📦 Creating package tarball..."
cp lib-package.json package.json
cp README.md dist/
cd dist
npm pack
TARBALL=$(ls *.tgz | head -1)
mv $TARBALL ../
cd ..
git checkout package.json

echo "✅ Package created: $TARBALL"

# Create test directory
TEST_DIR="test-package"
if [ -d "$TEST_DIR" ]; then
  rm -rf "$TEST_DIR"
fi

echo "🏗️  Creating test React app..."
npx create-react-app $TEST_DIR --template typescript
cd $TEST_DIR

# Install the local package
echo "📦 Installing local package..."
npm install ../$TARBALL

# Install required peer dependencies
echo "📦 Installing peer dependencies..."
npm install tailwindcss

# Create test component
echo "🧪 Creating test component..."
cat > src/TestSpreadsheet.tsx << 'EOF'
import React from 'react';
import { SpreadsheetEditor, createEmptySpreadsheet } from 'react-spreadsheet-editor';

function TestSpreadsheet() {
  const handleChange = (data: any) => {
    console.log('Spreadsheet data changed:', data);
  };

  const handleExport = (data: any) => {
    console.log('Exported data:', data);
  };

  const handleImport = (data: any) => {
    console.log('Imported data:', data);
  };

  const initialData = createEmptySpreadsheet();
  initialData.cells['A1'] = { value: 'Hello' };
  initialData.cells['B1'] = { value: 'World' };

  return (
    <div style={{ height: '600px', padding: '20px' }}>
      <h1>React Spreadsheet Editor Test</h1>
      <SpreadsheetEditor
        initialData={initialData}
        onChange={handleChange}
        onExport={handleExport}
        onImport={handleImport}
      />
    </div>
  );
}

export default TestSpreadsheet;
EOF

# Update App.tsx
cat > src/App.tsx << 'EOF'
import React from 'react';
import TestSpreadsheet from './TestSpreadsheet';
import './App.css';

function App() {
  return (
    <div className="App">
      <TestSpreadsheet />
    </div>
  );
}

export default App;
EOF

# Add Tailwind CSS
echo "🎨 Setting up Tailwind CSS..."
npx tailwindcss init -p

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-spreadsheet-editor/dist/**/*.{js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Add Tailwind to CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 220 13% 13%;
  --border: 220 13% 90%;
  --input: 220 13% 90%;
  --ring: 217 91% 50%;
  --cell-bg: 0 0% 100%;
  --cell-bg-selected: 217 91% 97%;
  --cell-border: 220 13% 88%;
  --cell-border-selected: 217 91% 50%;
  --header-bg: 220 14% 96%;
  --header-fg: 220 9% 46%;
  --toolbar-bg: 0 0% 100%;
  --toolbar-border: 220 13% 92%;
  --formula-bar-bg: 220 14% 98%;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

echo "🚀 Starting test server..."
echo "📝 Test app created in: $TEST_DIR"
echo "🌐 Opening http://localhost:3000"

npm start