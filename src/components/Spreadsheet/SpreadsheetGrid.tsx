import React, { useCallback, useRef, useEffect, useState } from 'react';
import { SpreadsheetCell } from './SpreadsheetCell';
import {
  SpreadsheetData,
  CellPosition,
  getCellId,
  getColumnLabel,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from '../../lib/spreadsheet/types';

interface SpreadsheetGridProps {
  data: SpreadsheetData;
  selectedCell: CellPosition | null;
  editingCell: CellPosition | null;
  onSelectCell: (position: CellPosition) => void;
  onStartEdit: (position: CellPosition) => void;
  onEndEdit: (value: string) => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onColumnResize?: (col: number, width: number) => void;
}

export function SpreadsheetGrid({
  data,
  selectedCell,
  editingCell,
  onSelectCell,
  onStartEdit,
  onEndEdit,
  onNavigate,
  onColumnResize,
}: SpreadsheetGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCellRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState<{ col: number; startX: number; startWidth: number } | null>(null);

  const getColumnWidth = useCallback(
    (col: number) => data.columnWidths[col] || DEFAULT_COLUMN_WIDTH,
    [data.columnWidths]
  );

  const getRowHeight = useCallback(
    (row: number) => data.rowHeights[row] || DEFAULT_ROW_HEIGHT,
    [data.rowHeights]
  );

  // Scroll selected cell into view
  useEffect(() => {
    if (selectedCell && containerRef.current) {
      const container = containerRef.current;
      
      // Calculate position
      let left = 50; // Row header width
      for (let i = 0; i < selectedCell.col; i++) {
        left += getColumnWidth(i);
      }
      
      let top = DEFAULT_ROW_HEIGHT; // Column header height
      for (let i = 0; i < selectedCell.row; i++) {
        top += getRowHeight(i);
      }
      
      const cellWidth = getColumnWidth(selectedCell.col);
      const cellHeight = getRowHeight(selectedCell.row);
      
      // Check if cell is outside visible area
      if (left < container.scrollLeft + 50) {
        container.scrollLeft = left - 50;
      } else if (left + cellWidth > container.scrollLeft + container.clientWidth) {
        container.scrollLeft = left + cellWidth - container.clientWidth + 10;
      }
      
      if (top < container.scrollTop + DEFAULT_ROW_HEIGHT) {
        container.scrollTop = top - DEFAULT_ROW_HEIGHT;
      } else if (top + cellHeight > container.scrollTop + container.clientHeight) {
        container.scrollTop = top + cellHeight - container.clientHeight + 10;
      }
    }
  }, [selectedCell, getColumnWidth, getRowHeight]);

  const handleResizeStart = useCallback((e: React.MouseEvent, col: number) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing({
      col,
      startX: e.clientX,
      startWidth: getColumnWidth(col),
    });
  }, [getColumnWidth]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;
    
    const deltaX = e.clientX - resizing.startX;
    const newWidth = Math.max(50, resizing.startWidth + deltaX);
    
    onColumnResize?.(resizing.col, newWidth);
  }, [resizing, onColumnResize]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  const renderColumnHeaders = () => {
    const headers = [];
    
    // Empty corner cell
    headers.push(
      <div
        key="corner"
        className="rse-grid-header"
        style={{ 
          position: 'sticky', 
          left: 0, 
          top: 0, 
          zIndex: 30, 
          width: 50, 
          height: DEFAULT_ROW_HEIGHT 
        }}
      />
    );
    
    for (let col = 0; col < data.columnCount; col++) {
      const width = getColumnWidth(col);
      const isSelected = selectedCell?.col === col;
      
      headers.push(
        <div
          key={`col-${col}`}
          className={`rse-grid-header ${isSelected ? 'selected' : ''}`}
          style={{ 
            position: 'sticky',
            top: 0,
            zIndex: 20,
            width, 
            minWidth: width, 
            height: DEFAULT_ROW_HEIGHT,
            backgroundColor: isSelected ? 'var(--rse-bg-selected)' : undefined,
            color: isSelected ? 'var(--rse-primary)' : undefined
          }}
        >
          {getColumnLabel(col)}
          <div
            className="rse-column-resizer"
            onMouseDown={(e) => handleResizeStart(e, col)}
          />
        </div>
      );
    }
    
    return headers;
  };

  const renderRows = () => {
    const rows = [];
    
    for (let row = 0; row < data.rowCount; row++) {
      const rowHeight = getRowHeight(row);
      const isRowSelected = selectedCell?.row === row;
      
      const cells = [];
      
      // Row header
      cells.push(
        <div
          key={`row-header-${row}`}
          className={`rse-grid-row-header ${isRowSelected ? 'selected' : ''}`}
          style={{ 
            height: rowHeight,
            backgroundColor: isRowSelected ? 'var(--rse-bg-selected)' : undefined,
            color: isRowSelected ? 'var(--rse-primary)' : undefined
          }}
        >
          {row + 1}
        </div>
      );
      
      // Data cells
      for (let col = 0; col < data.columnCount; col++) {
        const cellId = getCellId(row, col);
        const cell = data.cells[cellId];
        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
        const isEditing = editingCell?.row === row && editingCell?.col === col;
        
        cells.push(
          <div key={cellId} ref={isSelected ? selectedCellRef : undefined}>
            <SpreadsheetCell
              cell={cell}
              isSelected={isSelected}
              isEditing={isEditing}
              width={getColumnWidth(col)}
              height={rowHeight}
              onSelect={() => onSelectCell({ row, col })}
              onStartEdit={() => onStartEdit({ row, col })}
              onEndEdit={onEndEdit}
              onNavigate={onNavigate}
            />
          </div>
        );
      }
      
      rows.push(
        <div key={`row-${row}`} style={{ display: 'flex' }}>
          {cells}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div
      ref={containerRef}
      className="rse-grid"
    >
      <div style={{ display: 'inline-block', minWidth: '100%' }}>
        {/* Header row */}
        <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 20 }}>
          {renderColumnHeaders()}
        </div>
        
        {/* Data rows */}
        {renderRows()}
      </div>
    </div>
  );
}
