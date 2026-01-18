import React, { useEffect, useRef, useState } from 'react';
import { Cell, CellStyle, DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT } from '@/lib/spreadsheet/types';
import { cn } from '@/lib/utils';

interface SpreadsheetCellProps {
  cell: Cell | undefined;
  isSelected: boolean;
  isEditing: boolean;
  width: number;
  height: number;
  onSelect: () => void;
  onStartEdit: () => void;
  onEndEdit: (value: string) => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export function SpreadsheetCell({
  cell,
  isSelected,
  isEditing,
  width = DEFAULT_COLUMN_WIDTH,
  height = DEFAULT_ROW_HEIGHT,
  onSelect,
  onStartEdit,
  onEndEdit,
  onNavigate,
}: SpreadsheetCellProps) {
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditValue(cell?.formula || cell?.value || '');
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, cell]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onEndEdit(editValue);
        onNavigate('down');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onEndEdit(editValue);
        onNavigate(e.shiftKey ? 'left' : 'right');
      } else if (e.key === 'Escape') {
        onEndEdit(cell?.formula || cell?.value || '');
      }
    } else {
      if (e.key === 'Enter' || e.key === 'F2') {
        e.preventDefault();
        onStartEdit();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        onEndEdit('');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigate('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigate('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate('left');
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault();
        onNavigate(e.shiftKey ? 'left' : 'right');
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setEditValue(e.key);
        onStartEdit();
      }
    }
  };

  const style = cell?.style || {};
  const displayValue = cell?.computedValue ?? cell?.value ?? '';

  const getCellStyles = (cellStyle: CellStyle): React.CSSProperties => ({
    fontWeight: cellStyle.bold ? 'bold' : undefined,
    fontStyle: cellStyle.italic ? 'italic' : undefined,
    textDecoration: [
      cellStyle.underline ? 'underline' : '',
      cellStyle.strikethrough ? 'line-through' : '',
    ].filter(Boolean).join(' ') || undefined,
    textAlign: cellStyle.textAlign || 'left',
    backgroundColor: cellStyle.backgroundColor,
    color: cellStyle.textColor,
  });

  return (
    <div
      className={cn(
        'relative border-r border-b border-cell-border overflow-hidden',
        'focus:outline-none cursor-cell',
        isSelected && 'ring-2 ring-cell-border-selected ring-inset z-10 bg-cell-selected'
      )}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
      }}
      onClick={onSelect}
      onDoubleClick={onStartEdit}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onEndEdit(editValue)}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full px-2 bg-cell text-sm outline-none border-2 border-primary font-mono"
          style={getCellStyles(style)}
        />
      ) : (
        <div
          className="absolute inset-0 px-2 flex items-center text-sm truncate font-mono"
          style={getCellStyles(style)}
        >
          {String(displayValue)}
        </div>
      )}
    </div>
  );
}
