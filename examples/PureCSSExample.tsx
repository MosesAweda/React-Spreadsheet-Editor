import React from 'react';
import { SpreadsheetEditor } from '../src/components/Spreadsheet';
import '../src/spreadsheet.css';

function PureCSSExample() {
  const handleChange = (data: any) => {
    console.log('Spreadsheet data changed:', data);
  };

  const handleExport = (data: any) => {
    console.log('Exported data:', data);
  };

  const handleImport = (data: any) => {
    console.log('Imported data:', data);
  };

  return (
    <div style={{ height: '600px', padding: '20px' }}>
      <h1>Pure CSS React Spreadsheet Editor</h1>
      <SpreadsheetEditor
        onChange={handleChange}
        onExport={handleExport}
        onImport={handleImport}
      />
    </div>
  );
}

export default PureCSSExample;