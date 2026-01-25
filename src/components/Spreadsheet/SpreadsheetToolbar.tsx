import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { CellStyle } from '../../lib/spreadsheet/types';
import { AlignCenter, AlignLeft, AlignRight, ArrowUp, Download, Upload } from 'lucide-react';

interface SpreadsheetToolbarProps {
  currentStyle: CellStyle;
  onStyleChange: (style: Partial<CellStyle>) => void;
  onImport: (file: File) => void;
  onExportExcel: () => void;
  onExportJSON: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ToolbarButton({ icon, label, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          active={active}
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SpreadsheetToolbar({
  currentStyle,
  onStyleChange,
  onImport,
  onExportExcel,
  onExportJSON,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: SpreadsheetToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="rse-toolbar">
      {/* Undo/Redo */}
      <ToolbarButton
        icon={<span>↶</span>}
        label="Undo (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
      />
      <ToolbarButton
        icon={<span>↷</span>}
        label="Redo (Ctrl+Y)"
        onClick={onRedo}
        disabled={!canRedo}
      />

      <Separator orientation="vertical" />

      {/* Text Formatting */}
      <ToolbarButton
        icon={<span style={{ fontWeight: 'bold' }}>B</span>}
        label="Bold (Ctrl+B)"
        active={currentStyle.bold}
        onClick={() => onStyleChange({ bold: !currentStyle.bold })}
      />
      <ToolbarButton
        icon={<span style={{ fontStyle: 'italic' }}>I</span>}
        label="Italic (Ctrl+I)"
        active={currentStyle.italic}
        onClick={() => onStyleChange({ italic: !currentStyle.italic })}
      />
      <ToolbarButton
        icon={<span style={{ textDecoration: 'underline' }}>U</span>}
        label="Underline (Ctrl+U)"
        active={currentStyle.underline}
        onClick={() => onStyleChange({ underline: !currentStyle.underline })}
      />
      <ToolbarButton
        icon={<span style={{ textDecoration: 'line-through' }}>S</span>}
        label="Strikethrough"
        active={currentStyle.strikethrough}
        onClick={() => onStyleChange({ strikethrough: !currentStyle.strikethrough })}
      />

      <Separator orientation="vertical" />

      {/* Alignment */}
      <ToolbarButton
        icon={<><AlignLeft /></>}
        label="Align Left"
        active={currentStyle.textAlign === 'left'}
        onClick={() => onStyleChange({ textAlign: 'left' })}
      />
      <ToolbarButton
        icon={<><AlignCenter /></>}
        label="Align Center"
        active={currentStyle.textAlign === 'center'}
        onClick={() => onStyleChange({ textAlign: 'center' })}
      />
    
      <ToolbarButton
        icon={<><AlignRight /></>}
        label="Align Right"
        active={currentStyle.textAlign === 'right'}
        onClick={() => onStyleChange({ textAlign: 'right' })}
      />

      <Separator orientation="vertical" />

      {/* Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="rse-hidden"
      />
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            size="sm"
            className="rse-import-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span><Download className='w-4 h-4' /></span>
            <span>Import</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Import Excel file</TooltipContent>
      </Tooltip>

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm" className="rse-export-btn">
            <span><Upload className='w-4 h-4' /></span>
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onExportExcel}>
            <span style={{ marginRight: '8px' }}>📈</span>
            Export as Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportJSON}>
            <span style={{ marginRight: '8px' }}>📄</span>
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
