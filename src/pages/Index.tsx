import { SpreadsheetEditor } from '../components/Spreadsheet';
import { SpreadsheetData, exportToJSON } from '../components/Spreadsheet';

const Index = () => {
  const handleImport = (data: SpreadsheetData) => {
    console.log('Spreadsheet data imported:', data);
  };

  const handleChange = (data: SpreadsheetData) => {
    console.log('Spreadsheet data changed:', data);
  };

  const handleExport = (data: SpreadsheetData) => {
    const json = exportToJSON(data);
    console.log('Exported JSON:', json);
  };

  const showJSONPreview = () => {
    alert('Try the Export button → Export as JSON to see the data structure');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--rse-bg)', fontFamily: 'var(--rse-font)' }}>
      {/* Hero Section */}
      <header style={{ borderBottom: '1px solid var(--rse-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--rse-bg-selected)', borderRadius: '8px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--rse-text)', margin: 0 }}>React Spreadsheet</h1>
                <p style={{ fontSize: '14px', color: 'var(--rse-text-muted)', margin: 0 }}>Developer-friendly, npm-installable component</p>
              </div>
            </div>
            <a 
              href="#" 
              onClick={showJSONPreview}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--rse-primary)', textDecoration: 'none' }}
            >
              <span>💻</span>
              View JSON Output
            </a>
          </div>
        </div>
      </header>

      {/* Features Bar */}
      <div style={{ borderBottom: '1px solid var(--rse-border)', background: 'var(--rse-bg-hover)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rse-text-muted)' }}>
              <span>⬆️</span>
              <span>Excel Import</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rse-text-muted)' }}>
              <span>⬇️</span>
              <span>Excel/JSON Export</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rse-text-muted)' }}>
              <span>🧮</span>
              <span>Formulas (SUM, AVERAGE, etc.)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rse-text-muted)' }}>
              <span>✏️</span>
              <span>Text Styling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <SpreadsheetEditor
          onChange={handleChange}
          onExport={handleExport}
          onImport={handleImport}
          className="shadow-sm"
        />
      </main>

      {/* Usage Code Section */}
      <section style={{ borderTop: '1px solid var(--rse-border)', background: 'var(--rse-bg-hover)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span>📦</span>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Developer Usage</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--rse-bg)', border: '1px solid var(--rse-border)', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--rse-text-muted)', marginBottom: '12px' }}>Basic Usage</h3>
              <pre style={{ fontSize: '12px', fontFamily: 'monospace', background: 'var(--rse-bg-hover)', padding: '12px', borderRadius: '4px', overflowX: 'auto', margin: 0 }}>
{`import { SpreadsheetEditor } from './components/Spreadsheet';

function App() {
  return (
    <SpreadsheetEditor
      onChange={(data) => console.log(data)}
      onExport={(data) => saveToDatabase(data)}
    />
  );
}`}
              </pre>
            </div>
            
            <div style={{ background: 'var(--rse-bg)', border: '1px solid var(--rse-border)', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--rse-text-muted)', marginBottom: '12px' }}>Export as JSON</h3>
              <pre style={{ fontSize: '12px', fontFamily: 'monospace', background: 'var(--rse-bg-hover)', padding: '12px', borderRadius: '4px', overflowX: 'auto', margin: 0 }}>
{`import { exportToJSON } from './components/Spreadsheet';

// Get JSON for database storage
const jsonData = exportToJSON(spreadsheetData);
// {
//   rows: [{ A: { value: "100" }, B: { value: "200" } }],
//   metadata: { rowCount: 100, ... }
// }`}
              </pre>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--rse-text-muted)', margin: 0 }}>
              Supports formulas: <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px' }}>SUM</code>, 
              <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>AVERAGE</code>, 
              <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>MIN</code>, 
              <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>MAX</code>, 
              <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>COUNT</code>, 
              <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>IF</code>, 
              <code style={{ background: 'var(--rse-bg-hover)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>CONCAT</code> and more
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
