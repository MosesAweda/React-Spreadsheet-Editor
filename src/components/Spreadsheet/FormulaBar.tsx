import React, { useEffect, useState } from 'react';
import { getCellId, CellPosition } from '../../lib/spreadsheet/types';

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
    <div className="rse-formula-bar">
      <div className="rse-cell-ref">
        {cellLabel || '—'}
      </div>
      <div style={{ color: 'var(--rse-primary)', fontFamily: 'monospace', fontSize: '14px' }}>
        ƒx
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
        className="rse-formula-input"
        placeholder={selectedCell ? 'Enter value or formula (e.g., =SUM(A1:A10))' : 'Select a cell'}
        disabled={!selectedCell}
      />
    </div>
  );
}
