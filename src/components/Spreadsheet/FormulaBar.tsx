import React, { useEffect, useState } from 'react';
import { getCellId, CellPosition } from '@/lib/spreadsheet/types';

interface FormulaBarProps {
  selectedCell: CellPosition | null;
  value: string;
  formula?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function FormulaBar({
  selectedCell,
  value,
  formula,
  onChange,
  onSubmit,
}: FormulaBarProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(formula || value);
  }, [formula, value, selectedCell]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(inputValue);
      onSubmit();
    }
    if (e.key === 'Escape') {
      setInputValue(formula || value);
    }
  };

  const cellLabel = selectedCell ? getCellId(selectedCell.row, selectedCell.col) : '';

  return (
    <div className="flex items-center border-b border-toolbar-border bg-formula">
      <div className="flex items-center justify-center w-16 h-8 border-r border-toolbar-border font-mono text-xs text-muted-foreground font-medium">
        {cellLabel || '—'}
      </div>
      <div className="flex items-center px-2 text-muted-foreground text-sm font-mono">
        <span className="text-primary">ƒx</span>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          onChange(inputValue);
          onSubmit();
        }}
        onKeyDown={handleKeyDown}
        className="flex-1 h-8 px-2 bg-transparent border-none outline-none text-sm font-mono focus:ring-0"
        placeholder={selectedCell ? 'Enter value or formula (e.g., =SUM(A1:A10))' : 'Select a cell'}
        disabled={!selectedCell}
      />
    </div>
  );
}
