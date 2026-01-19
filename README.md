# React Spreadsheet Editor

A powerful, developer-friendly React spreadsheet component with Excel import/export, formulas, and styling capabilities.

## Features

- 📊 **Excel Import/Export** - Import .xlsx files and export to Excel or JSON
- 🧮 **Formula Support** - SUM, AVERAGE, MIN, MAX, COUNT, IF, CONCAT and more
- 🎨 **Cell Styling** - Bold, italic, underline, text alignment, colors
- 📏 **Resizable Columns** - Drag to resize columns with minimum width constraints
- ⌨️ **Keyboard Navigation** - Arrow keys, Enter, Tab navigation
- 🔄 **Undo/Redo** - Full history management with Ctrl+Z/Ctrl+Y
- 🎯 **TypeScript** - Full TypeScript support with type definitions
- 🌙 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Works on desktop and mobile devices

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Props](#props)
- [Advanced Usage](#advanced-usage)
- [Data Structure](#data-structure)
- [Utility Functions](#utility-functions)
- [Formulas](#formulas)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install react-spreadsheet-editor
# or
yarn add react-spreadsheet-editor
# or
bun add react-spreadsheet-editor
```

## Quick Start

```tsx
import React from 'react';
import { SpreadsheetEditor } from 'react-spreadsheet-editor';
import 'react-spreadsheet-editor/styles.css'; // Import styles

function App() {
  const handleChange = (data: any) => {
    console.log('Spreadsheet data changed:', data);
  };

  const handleExport = (data: any) => {
    console.log('Exported data:', data);
  };

  const handleImport = (data: any) => {
    console.log('Imported data:', data);
  };

  return (
    <div style={{ height: '600px' }}>
      <SpreadsheetEditor
        onChange={handleChange}
        onExport={handleExport}
        onImport={handleImport}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `initialData` | `SpreadsheetData` | Initial spreadsheet data |
| `onChange` | `(data: SpreadsheetData) => void` | Called when data changes |
| `onExport` | `(data: SpreadsheetData) => void` | Called when data is exported |
| `onImport` | `(data: SpreadsheetData) => void` | Called when data is imported |
| `className` | `string` | Additional CSS classes |

## Advanced Usage

### With Initial Data

```tsx
import { SpreadsheetEditor, createEmptySpreadsheet } from 'react-spreadsheet-editor';

const initialData = createEmptySpreadsheet();
// Add some initial data
initialData.cells['A1'] = { value: 'Hello' };
initialData.cells['B1'] = { value: 'World' };

<SpreadsheetEditor initialData={initialData} />
```

### Custom Styling

```tsx
<SpreadsheetEditor
  className="border rounded-lg shadow-lg"
  onChange={handleChange}
/>
```

### Working with Formulas

The spreadsheet supports various formulas:

```
=SUM(A1:A10)        // Sum of range
=AVERAGE(B1:B5)     // Average of range
=MIN(C1:C10)        // Minimum value
=MAX(D1:D10)        // Maximum value
=COUNT(E1:E10)      // Count non-empty cells
=IF(F1>10,"High","Low")  // Conditional logic
=CONCAT(G1," ",H1)  // Concatenate strings
```

## Data Structure

```typescript
interface SpreadsheetData {
  cells: Record<string, Cell>;
  columnWidths: Record<number, number>;
  rowHeights: Record<number, number>;
  rowCount: number;
  columnCount: number;
}

interface Cell {
  value: string;
  formula?: string;
  computedValue?: string | number;
  style?: CellStyle;
}

interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
}
```

## Utility Functions

```tsx
import {
  getCellId,
  getColumnLabel,
  parseCellId,
  createEmptySpreadsheet,
  exportToJSON,
  computeAllCells
} from 'react-spreadsheet-editor';

// Get cell ID from coordinates
const cellId = getCellId(0, 0); // "A1"

// Get column label from index
const label = getColumnLabel(0); // "A"

// Parse cell ID to coordinates
const position = parseCellId("B2"); // { row: 1, col: 1 }

// Create empty spreadsheet
const data = createEmptySpreadsheet();

// Export to JSON format
const json = exportToJSON(spreadsheetData);

// Compute all formulas
const computed = computeAllCells(spreadsheetData);
```

## Formulas

The spreadsheet supports a variety of built-in formulas:

### Math Functions
- `SUM(range)` - Sum all values in a range
- `AVERAGE(range)` - Calculate average of values
- `MIN(range)` - Find minimum value
- `MAX(range)` - Find maximum value
- `COUNT(range)` - Count non-empty cells

### Text Functions
- `CONCAT(str1, str2, ...)` - Combine strings
- `IF(condition, true_value, false_value)` - Conditional formula

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Arrow Keys | Navigate between cells |
| Enter | Edit selected cell |
| Escape | Cancel editing |
| Ctrl+Z | Undo |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| Ctrl+B | Toggle bold |
| Ctrl+I | Toggle italic |
| Ctrl+U | Toggle underline |

## Styling Requirements

The component includes pre-built styles. Simply import the CSS file:

```tsx
import 'react-spreadsheet-editor/styles.css';
```

The styles are built with Tailwind CSS and include all necessary variables for both light and dark themes.

## Development

### Prerequisites

- Node.js 16+ or Bun
- npm, yarn, or bun package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/MosesAweda/React-Spreadsheet-Editor.git
cd React-Spreadsheet-Editor

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The development server will start at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Build for development
npm run build:dev

# Preview build output
npm run preview
```

### Testing

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
npm run lint
```

### Project Structure

```
src/
├── components/
│   ├── Spreadsheet/          # Main spreadsheet component
│   │   ├── SpreadsheetEditor.tsx    # Main editor component
│   │   ├── SpreadsheetGrid.tsx      # Grid display
│   │   ├── SpreadsheetCell.tsx      # Individual cell
│   │   ├── FormulaBar.tsx           # Formula input bar
│   │   ├── SpreadsheetToolbar.tsx   # Toolbar with actions
│   │   └── index.ts
│   ├── ui/                  # UI components (Radix UI + Shadcn)
│   └── NavLink.tsx
├── hooks/                   # Custom React hooks
├── lib/
│   ├── spreadsheet/
│   │   ├── types.ts        # Type definitions
│   │   ├── formulas.ts     # Formula computation
│   │   └── excelUtils.ts   # Excel import/export
│   └── utils.ts
├── pages/                   # App pages
├── test/                    # Test files
└── App.tsx
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit them (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing code style and includes appropriate tests.

## License

MIT © Moses Aweda

## Support

- 📧 Email: awedamoses@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/MosesAweda/React-Spreadsheet-Editor)
- 📖 Documentation: [GitHub Wiki](https://github.com/MosesAweda/React-Spreadsheet-Editor)

## Acknowledgments

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide React](https://lucide.dev) (for icons)
