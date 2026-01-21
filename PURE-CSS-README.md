# React Spreadsheet Editor

A powerful, developer-friendly React spreadsheet component with Excel import/export, formulas, and styling capabilities. Built with **pure CSS and JavaScript** - no external UI dependencies or style conflicts.

## ✨ Key Features

- 📊 **Excel Import/Export** - Import .xlsx files and export to Excel or JSON
- 🧮 **Formula Support** - SUM, AVERAGE, MIN, MAX, COUNT, IF, CONCAT and more
- 🎨 **Cell Styling** - Bold, italic, underline, text alignment, colors
- 📏 **Resizable Columns** - Drag to resize columns with minimum width constraints
- ⌨️ **Keyboard Navigation** - Arrow keys, Enter, Tab navigation
- 🔄 **Undo/Redo** - Full history management with Ctrl+Z/Ctrl+Y
- 🎯 **TypeScript** - Full TypeScript support with type definitions
- 📱 **Responsive** - Works on desktop and mobile devices
- 🎯 **Zero Conflicts** - Pure CSS with scoped classes, no external UI dependencies
- 🚀 **Lightweight** - Minimal bundle size with no unnecessary dependencies

## 🚀 Installation

```bash
npm install react-spreadsheet-editor
# or
yarn add react-spreadsheet-editor
# or
bun add react-spreadsheet-editor
```

## 📖 Quick Start

```tsx
import React from 'react';
import { SpreadsheetEditor } from 'react-spreadsheet-editor';
import 'react-spreadsheet-editor/styles.css'; // Import scoped styles

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

## 🎨 Styling Architecture

### Pure CSS with Scoped Classes

All styles are scoped with the `rse-` prefix to prevent conflicts with your existing styles:

```css
.rse-spreadsheet { /* Main container */ }
.rse-toolbar { /* Toolbar styles */ }
.rse-btn { /* Button styles */ }
.rse-cell { /* Cell styles */ }
/* ... and more */
```

### CSS Custom Properties

The component uses CSS custom properties for easy theming:

```css
.rse-spreadsheet {
  --rse-primary: #2563eb;
  --rse-border: #e5e7eb;
  --rse-bg: #ffffff;
  /* ... customize as needed */
}
```

### Dark Mode Support

Simply add the `dark` class to enable dark mode:

```tsx
<SpreadsheetEditor className="dark" />
```

### Custom Styling

Override styles by targeting scoped classes:

```css
.my-custom-spreadsheet .rse-btn {
  border-radius: 8px;
}

.my-custom-spreadsheet .rse-cell {
  font-family: 'Monaco', monospace;
}
```

## 📋 Props

| Prop | Type | Description |
|------|------|-------------|
| `initialData` | `SpreadsheetData` | Initial spreadsheet data |
| `onChange` | `(data: SpreadsheetData) => void` | Called when data changes |
| `onExport` | `(data: SpreadsheetData) => void` | Called when data is exported |
| `onImport` | `(data: SpreadsheetData) => void` | Called when data is imported |
| `className` | `string` | Additional CSS classes |

## 🔧 Advanced Usage

### With Initial Data

```tsx
import { SpreadsheetEditor, createEmptySpreadsheet } from 'react-spreadsheet-editor';

const initialData = createEmptySpreadsheet();
initialData.cells['A1'] = { value: 'Hello' };
initialData.cells['B1'] = { value: 'World' };

<SpreadsheetEditor initialData={initialData} />
```

### Custom Styling

```tsx
<SpreadsheetEditor
  className="my-custom-spreadsheet dark"
  onChange={handleChange}
/>
```

### Working with Formulas

```
=SUM(A1:A10)        // Sum of range
=AVERAGE(B1:B5)     // Average of range
=MIN(C1:C10)        // Minimum value
=MAX(D1:D10)        // Maximum value
=COUNT(E1:E10)      // Count non-empty cells
=IF(F1>10,"High","Low")  // Conditional logic
=CONCAT(G1," ",H1)  // Concatenate strings
```

## 📊 Data Structure

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

## 🛠️ Utility Functions

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

## ⌨️ Keyboard Shortcuts

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

## 🎯 Why Pure CSS?

### ✅ Benefits

- **Zero Conflicts** - Scoped classes prevent style collisions
- **Lightweight** - No external UI library dependencies
- **Customizable** - Easy to override and theme
- **Portable** - Works in any React environment
- **Performance** - Minimal CSS bundle size
- **Maintainable** - Simple, predictable styling

### 🔄 Migration from UI Libraries

If you're migrating from a version that used external UI libraries:

1. Remove any UI library dependencies
2. Update your imports to use the new CSS file
3. Customize styles using CSS custom properties
4. No component API changes required!

## 🌐 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📦 Bundle Size

- **Core Library**: ~45KB gzipped
- **CSS Styles**: ~8KB gzipped
- **Total**: ~53KB gzipped

## 🤝 Contributing

We welcome contributions! The pure CSS approach makes it easier to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes (styles are in `src/spreadsheet.css`)
4. Test your changes
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT © Moses Aweda

## 🆘 Support

- 📧 Email: awedamoses@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/MosesAweda/React-Spreadsheet-Editor)
- 📖 Documentation: [GitHub Wiki](https://github.com/MosesAweda/React-Spreadsheet-Editor)

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Lucide React](https://lucide.dev) (for icons)
- Pure CSS (no external UI dependencies!)