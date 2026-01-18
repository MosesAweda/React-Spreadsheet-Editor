import React, { useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Undo,
  Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CellStyle } from '@/lib/spreadsheet/types';

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
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${active ? 'bg-accent text-accent-foreground' : ''}`}
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
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-toolbar-border bg-toolbar">
      {/* Undo/Redo */}
      <ToolbarButton
        icon={<Undo className="h-4 w-4" />}
        label="Undo (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
      />
      <ToolbarButton
        icon={<Redo className="h-4 w-4" />}
        label="Redo (Ctrl+Y)"
        onClick={onRedo}
        disabled={!canRedo}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <ToolbarButton
        icon={<Bold className="h-4 w-4" />}
        label="Bold (Ctrl+B)"
        active={currentStyle.bold}
        onClick={() => onStyleChange({ bold: !currentStyle.bold })}
      />
      <ToolbarButton
        icon={<Italic className="h-4 w-4" />}
        label="Italic (Ctrl+I)"
        active={currentStyle.italic}
        onClick={() => onStyleChange({ italic: !currentStyle.italic })}
      />
      <ToolbarButton
        icon={<Underline className="h-4 w-4" />}
        label="Underline (Ctrl+U)"
        active={currentStyle.underline}
        onClick={() => onStyleChange({ underline: !currentStyle.underline })}
      />
      <ToolbarButton
        icon={<Strikethrough className="h-4 w-4" />}
        label="Strikethrough"
        active={currentStyle.strikethrough}
        onClick={() => onStyleChange({ strikethrough: !currentStyle.strikethrough })}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <ToolbarButton
        icon={<AlignLeft className="h-4 w-4" />}
        label="Align Left"
        active={currentStyle.textAlign === 'left'}
        onClick={() => onStyleChange({ textAlign: 'left' })}
      />
      <ToolbarButton
        icon={<AlignCenter className="h-4 w-4" />}
        label="Align Center"
        active={currentStyle.textAlign === 'center'}
        onClick={() => onStyleChange({ textAlign: 'center' })}
      />
      <ToolbarButton
        icon={<AlignRight className="h-4 w-4" />}
        label="Align Right"
        active={currentStyle.textAlign === 'right'}
        onClick={() => onStyleChange({ textAlign: 'right' })}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            <span className="text-xs">Import</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Import Excel file</TooltipContent>
      </Tooltip>

      {/* Export */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
                <Download className="h-4 w-4" />
                <span className="text-xs">Export</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Export spreadsheet</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
