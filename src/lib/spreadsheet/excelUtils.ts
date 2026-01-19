import * as XLSX from 'xlsx';
import { SpreadsheetData, Cell, CellStyle, getCellId, getColumnLabel, DEFAULT_COLUMN_COUNT, DEFAULT_ROW_COUNT } from './types';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
}

export interface JSONExportData {
  rows: Array<Record<string, {
    value: string;
    formula?: string;
    style?: CellStyle;
  }>>;
  metadata: {
    rowCount: number;
    columnCount: number;
    exportedAt: string;
  };
}

export function importExcel(file: File): Promise<SpreadsheetData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const spreadsheetData: SpreadsheetData = {
          cells: {},
          columnWidths: {},
          rowHeights: {},
          rowCount: DEFAULT_ROW_COUNT,
          columnCount: DEFAULT_COLUMN_COUNT,
        };
        
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        spreadsheetData.rowCount = Math.max(range.e.r + 1, DEFAULT_ROW_COUNT);
        spreadsheetData.columnCount = Math.max(range.e.c + 1, DEFAULT_COLUMN_COUNT);
        
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const wsCell = worksheet[cellAddress];
            
            if (wsCell) {
              const cellId = getCellId(row, col);
              const cell: Cell = {
                value: wsCell.v !== undefined ? String(wsCell.v) : '',
                style: {},
              };
              
              if (wsCell.f) {
                cell.formula = `=${wsCell.f}`;
              }
              
              // Extract styles if available
              if (wsCell.s) {
                if (wsCell.s.font?.bold) cell.style!.bold = true;
                if (wsCell.s.font?.italic) cell.style!.italic = true;
                if (wsCell.s.font?.underline) cell.style!.underline = true;
                if (wsCell.s.font?.strike) cell.style!.strikethrough = true;
              }
              
              spreadsheetData.cells[cellId] = cell;
            }
          }
        }
        
        // Get column widths
        if (worksheet['!cols']) {
          worksheet['!cols'].forEach((col, index) => {
            if (col?.wpx) {
              spreadsheetData.columnWidths[index] = col.wpx;
            }
          });
        }
        
        resolve(spreadsheetData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(data: SpreadsheetData, options: ExportOptions = {}): void {
  const timestamp = new Date().toISOString().slice(0, 10);
  const { filename = `spreadsheet-${timestamp}.xlsx`, sheetName = 'Sheet1' } = options;
  
  const worksheet: XLSX.WorkSheet = {};
  
  let maxRow = 0;
  let maxCol = 0;
  
  for (const [cellId, cell] of Object.entries(data.cells)) {
    if (!cell.value && !cell.formula) continue;
    
    const match = cellId.match(/^([A-Z]+)(\d+)$/);
    if (!match) continue;
    
    const colLabel = match[1];
    const rowNum = parseInt(match[2], 10) - 1;
    
    let col = 0;
    for (let i = 0; i < colLabel.length; i++) {
      col = col * 26 + (colLabel.charCodeAt(i) - 64);
    }
    col -= 1;
    
    maxRow = Math.max(maxRow, rowNum);
    maxCol = Math.max(maxCol, col);
    
    const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: col });
    
    const numValue = parseFloat(cell.value);
    const isNumber = !isNaN(numValue) && /^-?\d*\.?\d+$/.test(cell.value.trim());
    
    const wsCell: XLSX.CellObject = {
      t: isNumber ? 'n' : 's',
      v: isNumber ? numValue : cell.value,
    };
    
    if (cell.formula) {
      wsCell.f = cell.formula.startsWith('=') ? cell.formula.slice(1) : cell.formula;
    }
    
    worksheet[cellAddress] = wsCell;
  }
  
  worksheet['!ref'] = `A1:${XLSX.utils.encode_cell({ r: maxRow, c: maxCol })}`;
  
  // Set column widths
  const cols: XLSX.ColInfo[] = [];
  for (let i = 0; i <= maxCol; i++) {
    cols.push({ wpx: data.columnWidths[i] || 100 });
  }
  worksheet['!cols'] = cols;
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Use writeFile with proper options to avoid browser warnings
  try {
    XLSX.writeFile(workbook, filename, { 
      bookType: 'xlsx',
      type: 'binary'
    });
  } catch (error) {
    console.error('Export failed:', error);
  }
}

export function exportToJSON(data: SpreadsheetData): JSONExportData {
  const rows: Array<Record<string, { value: string; formula?: string; style?: CellStyle }>> = [];
  
  // Group cells by row
  const cellsByRow: Record<number, Record<string, Cell>> = {};
  
  for (const [cellId, cell] of Object.entries(data.cells)) {
    if (!cell.value && !cell.formula) continue;
    
    const match = cellId.match(/^([A-Z]+)(\d+)$/);
    if (!match) continue;
    
    const rowNum = parseInt(match[2], 10) - 1;
    const colLabel = match[1];
    
    if (!cellsByRow[rowNum]) {
      cellsByRow[rowNum] = {};
    }
    cellsByRow[rowNum][colLabel] = cell;
  }
  
  // Convert to array
  const sortedRows = Object.keys(cellsByRow)
    .map(Number)
    .sort((a, b) => a - b);
  
  for (const rowNum of sortedRows) {
    const rowData: Record<string, { value: string; formula?: string; style?: CellStyle }> = {};
    
    for (const [colLabel, cell] of Object.entries(cellsByRow[rowNum])) {
      rowData[colLabel] = {
        value: cell.value,
        ...(cell.formula && { formula: cell.formula }),
        ...(cell.style && Object.keys(cell.style).length > 0 && { style: cell.style }),
      };
    }
    
    rows.push(rowData);
  }
  
  return {
    rows,
    metadata: {
      rowCount: data.rowCount,
      columnCount: data.columnCount,
      exportedAt: new Date().toISOString(),
    },
  };
}

export function importFromJSON(jsonData: JSONExportData): SpreadsheetData {
  const data: SpreadsheetData = {
    cells: {},
    columnWidths: {},
    rowHeights: {},
    rowCount: jsonData.metadata.rowCount || DEFAULT_ROW_COUNT,
    columnCount: jsonData.metadata.columnCount || DEFAULT_COLUMN_COUNT,
  };
  
  jsonData.rows.forEach((row, rowIndex) => {
    for (const [colLabel, cellData] of Object.entries(row)) {
      const cellId = `${colLabel}${rowIndex + 1}`;
      data.cells[cellId] = {
        value: cellData.value,
        formula: cellData.formula,
        style: cellData.style,
      };
    }
  });
  
  return data;
}

export function downloadJSON(data: SpreadsheetData, filename = 'spreadsheet.json'): void {
  const jsonData = exportToJSON(data);
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  
  // Create download link with proper attributes to avoid browser warnings
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.setAttribute('rel', 'noopener noreferrer');
  a.setAttribute('target', '_blank');
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
