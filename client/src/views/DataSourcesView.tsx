import React from 'react';
import { Database, FileSpreadsheet, FileText, Mail, CheckCircle2, RefreshCw } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const sources = [
    { name: 'Employee Database', type: 'JSON DB / HR API', records: 24, status: 'CONNECTED', icon: Database, color: 'text-brand-400' },
    { name: 'Customer Database', type: 'CRM Ledger', records: 20, status: 'CONNECTED', icon: Database, color: 'text-indigo-400' },
    { name: 'Invoice Records (invoices.csv)', type: 'CSV Ledger', records: 42, status: 'CONNECTED', icon: FileSpreadsheet, color: 'text-emerald-400' },
    { name: 'Expense Claims (expenses.xlsx)', type: 'XLSX Spreadsheet', records: 18, status: 'CONNECTED', icon: FileSpreadsheet, color: 'text-cyan-400' },
    { name: 'Asset Inventory (assets.json)', type: 'IT Asset Store', records: 4, status: 'CONNECTED', icon: Database, color: 'text-purple-400' },
    { name: 'Vendor Database (vendors.json)', type: 'Procurement File', records: 3, status: 'CONNECTED', icon: FileText, color: 'text-amber-400' },
    { name: 'Company Policy Store (policies.json)', type: 'Rule Engine', records: 5, status: 'ACTIVE', icon: ShieldCheckIcon, color: 'text-rose-400' },
    { name: 'Email Gateway API', type: 'SMTP Service', records: 142, status: 'HEALTHY', icon: Mail, color: 'text-blue-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-brand-400" />
          MULTI-SOURCE DATA CONTEXT INTEGRATIONS
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Connected databases, spreadsheets, document stores, and external system APIs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {sources.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl bg-dark-base border border-dark-border ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  ● {s.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{s.type}</p>
              </div>

              <div className="pt-3 border-t border-dark-border flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Records:</span>
                <span className="font-extrabold text-white">{s.records} Loaded</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function ShieldCheckIcon(props: any) {
  return <Database {...props} />;
}
