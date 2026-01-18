export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
}

export interface Cell {
  value: string;
  formula?: string;
  computedValue?: string | number;
  style?: CellStyle;
}

export interface SpreadsheetData {
  cells: Record<string, Cell>;
  columnWidths: Record<number, number>;
  rowHeights: Record<number, number>;
  rowCount: number;
  columnCount: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

export interface SpreadsheetState {
  data: SpreadsheetData;
  selectedCell: CellPosition | null;
  selectedRange: CellRange | null;
  editingCell: CellPosition | null;
}

export const DEFAULT_COLUMN_WIDTH = 100;
export const DEFAULT_ROW_HEIGHT = 28;
export const DEFAULT_ROW_COUNT = 100;
export const DEFAULT_COLUMN_COUNT = 26;

export function getCellId(row: number, col: number): string {
  return `${getColumnLabel(col)}${row + 1}`;
}

export function getColumnLabel(col: number): string {
  let label = '';
  let n = col;
  while (n >= 0) {
    label = String.fromCharCode((n % 26) + 65) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}

export function parseCellId(cellId: string): CellPosition | null {
  const match = cellId.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const colLabel = match[1];
  const rowNum = parseInt(match[2], 10) - 1;
  
  let col = 0;
  for (let i = 0; i < colLabel.length; i++) {
    col = col * 26 + (colLabel.charCodeAt(i) - 64);
  }
  col -= 1;
  
  return { row: rowNum, col };
}

export function createEmptySpreadsheet(): SpreadsheetData {
  return {
    cells: {},
    columnWidths: {},
    rowHeights: {},
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
  };
}
