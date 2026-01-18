import { SpreadsheetEditor } from '@/components/Spreadsheet';
import { SpreadsheetData, exportToJSON } from '@/components/Spreadsheet';
import { toast } from 'sonner';
import { FileSpreadsheet, Code, Package, ArrowRight, Download, Upload, Calculator, Type } from 'lucide-react';

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
    toast.info('Try the Export button → Export as JSON to see the data structure');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">React Spreadsheet</h1>
                <p className="text-sm text-muted-foreground">Developer-friendly, npm-installable component</p>
              </div>
            </div>
            <a 
              href="#" 
              onClick={showJSONPreview}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Code className="h-4 w-4" />
              View JSON Output
            </a>
          </div>
        </div>
      </header>

      {/* Features Bar */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Upload className="h-4 w-4 text-primary" />
              <span>Excel Import</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="h-4 w-4 text-primary" />
              <span>Excel/JSON Export</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calculator className="h-4 w-4 text-primary" />
              <span>Formulas (SUM, AVERAGE, etc.)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Type className="h-4 w-4 text-primary" />
              <span>Text Styling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <main className="container mx-auto px-4 py-6">
        <SpreadsheetEditor
          onChange={handleChange}
          onExport={handleExport}
          onImport={handleImport}
          className="h-[calc(100vh-220px)] min-h-[500px] shadow-sm"
        />
      </main>

      {/* Usage Code Section */}
      <section className="border-t border-border bg-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Developer Usage</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Basic Usage</h3>
              <pre className="text-sm font-mono bg-secondary/50 p-3 rounded overflow-x-auto">
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
            
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Export as JSON</h3>
              <pre className="text-sm font-mono bg-secondary/50 p-3 rounded overflow-x-auto">
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

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Supports formulas: <code className="bg-secondary px-1.5 py-0.5 rounded">SUM</code>, 
              <code className="bg-secondary px-1.5 py-0.5 rounded ml-1">AVERAGE</code>, 
              <code className="bg-secondary px-1.5 py-0.5 rounded ml-1">MIN</code>, 
              <code className="bg-secondary px-1.5 py-0.5 rounded ml-1">MAX</code>, 
              <code className="bg-secondary px-1.5 py-0.5 rounded ml-1">COUNT</code>, 
              <code className="bg-secondary px-1.5 py-0.5 rounded ml-1">IF</code>, 
              <code className="bg-secondary px-1.5 py-0.5 rounded ml-1">CONCAT</code> and more
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
