import React, { useCallback, useEffect, useState } from 'react';
import { SpreadsheetToolbar } from './SpreadsheetToolbar';
import { FormulaBar } from './FormulaBar';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import {
  SpreadsheetData,
  CellPosition,
  CellStyle,
  Cell,
  getCellId,
  createEmptySpreadsheet,
} from '../../lib/spreadsheet/types';
import { computeAllCells } from '../../lib/spreadsheet/formulas';
import { importExcel, exportToExcel, downloadJSON } from '../../lib/spreadsheet/excelUtils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export interface SpreadsheetEditorProps {
  initialData?: SpreadsheetData;
  onChange?: (data: SpreadsheetData) => void;
  onExport?: (data: SpreadsheetData) => void;
  onImport?: (data: SpreadsheetData) => void;
  className?: string;
}

export function SpreadsheetEditor({
  initialData,
  onChange,
  onExport,
  onImport,
  className,
}: SpreadsheetEditorProps) {
  const [data, setData] = useState<SpreadsheetData>(() => 
    initialData ? computeAllCells(initialData) : createEmptySpreadsheet()
  );
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [history, setHistory] = useState<SpreadsheetData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const selectedCellData = selectedCell
    ? data.cells[getCellId(selectedCell.row, selectedCell.col)]
    : undefined;

  const saveToHistory = useCallback((newData: SpreadsheetData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newData);
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const updateData = useCallback((newData: SpreadsheetData) => {
    const computed = computeAllCells(newData);
    setData(computed);
    saveToHistory(computed);
    onChange?.(computed);
  }, [onChange, saveToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
      onChange?.(history[newIndex]);
    }
  }, [history, historyIndex, onChange]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
      onChange?.(history[newIndex]);
    }
  }, [history, historyIndex, onChange]);

  const handleCellEdit = useCallback((value: string) => {
    if (!selectedCell) return;

    const cellId = getCellId(selectedCell.row, selectedCell.col);
    const existingCell = data.cells[cellId];
    
    const isFormula = value.startsWith('=');
    const newCell: Cell = {
      ...(existingCell || {}),
      value: isFormula ? '' : value,
      formula: isFormula ? value : undefined,
      style: existingCell?.style,
    };

    if (!value && !existingCell?.style) {
      // Remove empty cells
      const newCells = { ...data.cells };
      delete newCells[cellId];
      updateData({ ...data, cells: newCells });
    } else {
      updateData({
        ...data,
        cells: {
          ...data.cells,
          [cellId]: newCell,
        },
      });
    }

    setEditingCell(null);
  }, [data, selectedCell, updateData]);

  const handleFormulaChange = useCallback((value: string) => {
    if (!selectedCell) return;

    const cellId = getCellId(selectedCell.row, selectedCell.col);
    const existingCell = data.cells[cellId] || {};
    
    const isFormula = value.startsWith('=');
    const newCell: Cell = {
      ...existingCell,
      value: isFormula ? '' : value,
      formula: isFormula ? value : undefined,
    };

    setData(prev => ({
      ...prev,
      cells: {
        ...prev.cells,
        [cellId]: newCell,
      },
    }));
  }, [data, selectedCell]);

  const handleFormulaSubmit = useCallback(() => {
    if (!selectedCell) return;
    
    const computed = computeAllCells(data);
    setData(computed);
    saveToHistory(computed);
    onChange?.(computed);
  }, [data, selectedCell, onChange, saveToHistory]);

  const handleStyleChange = useCallback((styleUpdate: Partial<CellStyle>) => {
    if (!selectedCell) return;

    const cellId = getCellId(selectedCell.row, selectedCell.col);
    const existingCell = data.cells[cellId] || { value: '' };

    updateData({
      ...data,
      cells: {
        ...data.cells,
        [cellId]: {
          ...existingCell,
          style: {
            ...existingCell.style,
            ...styleUpdate,
          },
        },
      },
    });
  }, [data, selectedCell, updateData]);

  const handleNavigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCell) {
      setSelectedCell({ row: 0, col: 0 });
      return;
    }

    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, row - 1);
        break;
      case 'down':
        newRow = Math.min(data.rowCount - 1, row + 1);
        break;
      case 'left':
        newCol = Math.max(0, col - 1);
        break;
      case 'right':
        newCol = Math.min(data.columnCount - 1, col + 1);
        break;
    }

    setSelectedCell({ row: newRow, col: newCol });
    setEditingCell(null);
  }, [selectedCell, data.rowCount, data.columnCount]);

  const handleColumnResize = useCallback((col: number, width: number) => {
    updateData({
      ...data,
      columnWidths: {
        ...data.columnWidths,
        [col]: width,
      },
    });
  }, [data, updateData]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const imported = await importExcel(file);
      const computed = computeAllCells(imported);
      setData(computed);
      setHistory([computed]);
      setHistoryIndex(0);
      onChange?.(computed);
      onImport?.(computed);
      console.log('Spreadsheet imported successfully');
    } catch (error) {
      console.error('Import error:', error);
    }
  }, [onChange, onImport]);

  const handleExportExcel = useCallback(() => {
    console.log('Exporting to Excel', data);
    exportToExcel(data);
    onExport?.(data);
    console.log('Exported as Excel');
  }, [data, onExport]);

  const handleExportJSON = useCallback(() => {
    downloadJSON(data);
    onExport?.(data);
    console.log('Exported as JSON');
  }, [data, onExport]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'b':
            e.preventDefault();
            if (selectedCell) {
              handleStyleChange({ bold: !selectedCellData?.style?.bold });
            }
            break;
          case 'i':
            e.preventDefault();
            if (selectedCell) {
              handleStyleChange({ italic: !selectedCellData?.style?.italic });
            }
            break;
          case 'u':
            e.preventDefault();
            if (selectedCell) {
              handleStyleChange({ underline: !selectedCellData?.style?.underline });
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, selectedCellData, handleStyleChange, handleUndo, handleRedo]);

  return (
    <div className={`rse-spreadsheet ${className || ''}`}>
        <SpreadsheetToolbar
          currentStyle={selectedCellData?.style || {}}
          onStyleChange={handleStyleChange}
          onImport={handleImport}
          onExportExcel={handleExportExcel}
          onExportJSON={handleExportJSON}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        <FormulaBar
          selectedCell={selectedCell}
          value={selectedCellData?.value || ''}
          formula={selectedCellData?.formula}
          onChange={handleFormulaChange}
          onSubmit={handleFormulaSubmit}
        />
        <SpreadsheetGrid
          data={data}
          selectedCell={selectedCell}
          editingCell={editingCell}
          onSelectCell={setSelectedCell}
          onStartEdit={setEditingCell}
          onEndEdit={handleCellEdit}
          onNavigate={handleNavigate}
          onColumnResize={handleColumnResize}
        />
    </div>
  );
}
