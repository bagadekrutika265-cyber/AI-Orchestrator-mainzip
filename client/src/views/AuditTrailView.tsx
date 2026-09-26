import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { History, Search, ShieldCheck, RefreshCw, Cpu, UserCheck, Zap } from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.decision && l.decision.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActorBadge = (type: string) => {
    if (type === 'AI AUTOMATED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">🤖 AI AUTOMATED</span>;
    if (type === 'HUMAN APPROVED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">👤 HUMAN APPROVED</span>;
    if (type === 'SYSTEM EXECUTED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">⚙ SYSTEM EXECUTED</span>;
    if (type === 'AI RE-PLANNED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">🔄 AI RE-PLANNED</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">🚨 ESCALATED</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-brand-400" />
            SYSTEM AUDIT TRAIL & REPLAY LOGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Immutable timeline recording every AI decision, data source query, policy check, human approval, and replan event
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail..."
            className="bg-dark-card border border-dark-border rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-dark-border">
          {filtered.map((log) => (
            <div key={log.id} className="p-4 hover:bg-dark-hover transition space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {getActorBadge(log.actorType)}
                  <span className="font-bold text-white">{log.actorName}</span>
                </div>

                {log.workflowId && (
                  <span className="font-mono text-[10px] text-brand-400 bg-dark-base px-2 py-0.5 rounded border border-dark-border">
                    {log.workflowId}
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-gray-200">{log.action}</p>

              {log.decision && (
                <p className="text-xs font-mono text-emerald-300 bg-dark-base p-2.5 rounded-lg border border-dark-border">
                  Decision: {log.decision}
                </p>
              )}

              {log.policyUsed && (
                <p className="text-[11px] text-amber-300">
                  Policy Enforced: <span className="font-semibold">{log.policyUsed}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
