import { SpreadsheetData, parseCellId, getCellId } from './types';

type FormulaFunction = (args: (string | number)[], data: SpreadsheetData) => string | number;

const FORMULA_FUNCTIONS: Record<string, FormulaFunction> = {
  SUM: (args, data) => {
    const values = expandRanges(args, data);
    return values.reduce((sum: number, val) => {
      const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
      return sum + num;
    }, 0);
  },
  
  AVERAGE: (args, data) => {
    const values = expandRanges(args, data);
    const numericValues = values.map(v => typeof v === 'number' ? v : parseFloat(String(v))).filter(v => !isNaN(v));
    if (numericValues.length === 0) return 0;
    const sum = numericValues.reduce((s: number, val) => s + val, 0);
    return sum / numericValues.length;
  },
  
  MIN: (args, data) => {
    const values = expandRanges(args, data);
    const numericValues = values.map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v));
    return numericValues.length > 0 ? Math.min(...numericValues) : 0;
  },
  
  MAX: (args, data) => {
    const values = expandRanges(args, data);
    const numericValues = values.map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v));
    return numericValues.length > 0 ? Math.max(...numericValues) : 0;
  },
  
  COUNT: (args, data) => {
    const values = expandRanges(args, data);
    return values.filter(v => !isNaN(typeof v === 'number' ? v : parseFloat(v))).length;
  },
  
  COUNTA: (args, data) => {
    const values = expandRanges(args, data);
    return values.filter(v => v !== '' && v !== null && v !== undefined).length;
  },
  
  IF: (args) => {
    const [condition, trueValue, falseValue] = args;
    return condition ? (trueValue ?? '') : (falseValue ?? '');
  },
  
  CONCAT: (args, data) => {
    const values = expandRanges(args, data);
    return values.join('');
  },
  
  UPPER: (args) => {
    return String(args[0] || '').toUpperCase();
  },
  
  LOWER: (args) => {
    return String(args[0] || '').toLowerCase();
  },
  
  ROUND: (args) => {
    const value = typeof args[0] === 'number' ? args[0] : parseFloat(args[0]) || 0;
    const decimals = typeof args[1] === 'number' ? args[1] : parseInt(args[1]) || 0;
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
  
  ABS: (args) => {
    const value = typeof args[0] === 'number' ? args[0] : parseFloat(args[0]) || 0;
    return Math.abs(value);
  },
  
  SQRT: (args) => {
    const value = typeof args[0] === 'number' ? args[0] : parseFloat(args[0]) || 0;
    return Math.sqrt(value);
  },
  
  POWER: (args) => {
    const base = typeof args[0] === 'number' ? args[0] : parseFloat(args[0]) || 0;
    const exp = typeof args[1] === 'number' ? args[1] : parseFloat(args[1]) || 1;
    return Math.pow(base, exp);
  },
};

function expandRanges(args: (string | number)[], data: SpreadsheetData): (string | number)[] {
  const result: (string | number)[] = [];
  
  for (const arg of args) {
    if (typeof arg === 'string' && arg.includes(':')) {
      // It's a range like A1:B3
      const [startRef, endRef] = arg.split(':');
      const start = parseCellId(startRef);
      const end = parseCellId(endRef);
      
      if (start && end) {
        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        const minCol = Math.min(start.col, end.col);
        const maxCol = Math.max(start.col, end.col);
        
        for (let row = minRow; row <= maxRow; row++) {
          for (let col = minCol; col <= maxCol; col++) {
            const cellId = getCellId(row, col);
            const cell = data.cells[cellId];
            if (cell) {
              const value = cell.computedValue ?? cell.value;
              result.push(typeof value === 'number' ? value : value || '');
            }
          }
        }
      }
    } else {
      result.push(arg);
    }
  }
  
  return result;
}

function getCellValue(cellRef: string, data: SpreadsheetData): string | number {
  const cell = data.cells[cellRef];
  if (!cell) return '';
  return cell.computedValue ?? cell.value ?? '';
}

function parseArguments(argsString: string, data: SpreadsheetData): (string | number)[] {
  const args: (string | number)[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  
  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];
    
    if (char === '"' && argsString[i - 1] !== '\\') {
      inString = !inString;
      current += char;
    } else if (!inString && char === '(') {
      depth++;
      current += char;
    } else if (!inString && char === ')') {
      depth--;
      current += char;
    } else if (!inString && char === ',' && depth === 0) {
      args.push(evaluateExpression(current.trim(), data));
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    args.push(evaluateExpression(current.trim(), data));
  }
  
  return args;
}

function evaluateExpression(expr: string, data: SpreadsheetData): string | number {
  expr = expr.trim();
  
  // String literal
  if (expr.startsWith('"') && expr.endsWith('"')) {
    return expr.slice(1, -1);
  }
  
  // Number
  if (!isNaN(parseFloat(expr)) && /^-?\d*\.?\d+$/.test(expr)) {
    return parseFloat(expr);
  }
  
  // Cell reference (like A1, BC23)
  if (/^[A-Z]+\d+$/.test(expr)) {
    return getCellValue(expr, data);
  }
  
  // Range reference (like A1:B3)
  if (/^[A-Z]+\d+:[A-Z]+\d+$/.test(expr)) {
    return expr; // Return as-is, will be expanded by the function
  }
  
  // Function call
  const funcMatch = expr.match(/^([A-Z]+)\((.*)\)$/s);
  if (funcMatch) {
    const funcName = funcMatch[1];
    const argsString = funcMatch[2];
    const func = FORMULA_FUNCTIONS[funcName];
    
    if (func) {
      const args = parseArguments(argsString, data);
      return func(args, data);
    }
    return `#NAME?`;
  }
  
  // Basic arithmetic
  try {
    // Replace cell references with their values
    const evaluated = expr.replace(/[A-Z]+\d+/g, (match) => {
      const value = getCellValue(match, data);
      return typeof value === 'number' ? value.toString() : `"${value}"`;
    });
    
    // Simple evaluation for basic math (+-*/)
    const sanitized = evaluated.replace(/[^0-9+\-*/().]/g, '');
    if (sanitized && /^[0-9+\-*/().]+$/.test(sanitized)) {
      const result = Function(`"use strict"; return (${sanitized})`)();
      return typeof result === 'number' && !isNaN(result) ? result : '#ERROR!';
    }
  } catch {
    return '#ERROR!';
  }
  
  return expr;
}

export function evaluateFormula(formula: string, data: SpreadsheetData): string | number {
  if (!formula.startsWith('=')) {
    return formula;
  }
  
  try {
    const expression = formula.slice(1).trim();
    return evaluateExpression(expression, data);
  } catch (error) {
    return '#ERROR!';
  }
}

export function computeAllCells(data: SpreadsheetData): SpreadsheetData {
  const newData = { ...data, cells: { ...data.cells } };
  
  // First pass: identify cells with formulas and their dependencies
  const formulaCells: string[] = [];
  
  for (const cellId of Object.keys(newData.cells)) {
    const cell = newData.cells[cellId];
    if (cell.formula) {
      formulaCells.push(cellId);
    } else {
      // Set computed value for non-formula cells
      const numValue = parseFloat(cell.value);
      newData.cells[cellId] = {
        ...cell,
        computedValue: !isNaN(numValue) && /^-?\d*\.?\d+$/.test(cell.value.trim()) ? numValue : cell.value,
      };
    }
  }
  
  // Evaluate formulas (simple approach - may need dependency ordering for complex sheets)
  for (const cellId of formulaCells) {
    const cell = newData.cells[cellId];
    if (cell.formula) {
      newData.cells[cellId] = {
        ...cell,
        computedValue: evaluateFormula(cell.formula, newData),
      };
    }
  }
  
  return newData;
}
