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

## Installation

```bash
npm install react-spreadsheet-editor
```

## Quick Start

```tsx
import React from 'react';
import { SpreadsheetEditor } from 'react-spreadsheet-editor';
import 'react-spreadsheet-editor/dist/styles.css'; // Import styles

function App() {
  const handleChange = (data) => {
    console.log('Spreadsheet data changed:', data);
  };

  const handleExport = (data) => {
    console.log('Exported data:', data);
  };

  const handleImport = (data) => {
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

## Styling Requirements

This component requires Tailwind CSS. If you're not using Tailwind, you can:

1. **Install Tailwind CSS** (recommended):
```bash
npm install tailwindcss
```

2. **Or use the included styles**:
```tsx
import { styles } from 'react-spreadsheet-editor';
// Inject styles into your app
```

## Keyboard Shortcuts

- **Arrow Keys**: Navigate between cells
- **Enter**: Edit selected cell
- **Escape**: Cancel editing
- **Ctrl+Z**: Undo
- **Ctrl+Y / Ctrl+Shift+Z**: Redo
- **Ctrl+B**: Toggle bold
- **Ctrl+I**: Toggle italic
- **Ctrl+U**: Toggle underline

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Moses Aweda

## Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/MosesAweda)
- 📖 Documentation: [GitHub Wiki](https://github.com/MosesAweda)`