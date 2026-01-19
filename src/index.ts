// Main component exports
export { SpreadsheetEditor } from './components/Spreadsheet/SpreadsheetEditor';
export type { SpreadsheetEditorProps } from './components/Spreadsheet/SpreadsheetEditor';

// Type exports
export type {
  SpreadsheetData,
  Cell,
  CellStyle,
  CellPosition,
  CellRange,
} from './lib/spreadsheet/types';

// Utility exports
export {
  getCellId,
  getColumnLabel,
  parseCellId,
  createEmptySpreadsheet,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from './lib/spreadsheet/types';

export { computeAllCells } from './lib/spreadsheet/formulas';
export { importExcel, exportToExcel, downloadJSON, exportToJSON } from './lib/spreadsheet/excelUtils';