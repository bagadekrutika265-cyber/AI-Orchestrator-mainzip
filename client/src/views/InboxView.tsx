import React, { useState } from 'react';
import { WorkflowInstance } from '../types';
import { Inbox, Filter, ArrowUpRight, CheckSquare, AlertTriangle, Clock } from 'lucide-react';

interface InboxViewProps {
  workflows: WorkflowInstance[];
  onSelectWorkflow: (id: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  workflows,
  onSelectWorkflow,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const filtered = filterPriority === 'ALL'
    ? workflows
    : workflows.filter(w => w.priority === filterPriority);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-400" />
            INTELLIGENT REQUEST INBOX
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Centralized queue of all active, waiting, and completed business orchestration requests
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-xl p-1 text-xs">
          <Filter className="w-3.5 h-3.5 ml-2 text-gray-400" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                filterPriority === p ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-surface border-b border-dark-border text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                <th className="p-4">Request ID</th>
                <th className="p-4">Type & Objective</th>
                <th className="p-4">Requester</th>
                <th className="p-4">Priority</th>
                <th className="p-4">State</th>
                <th className="p-4">SLA Clock</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-xs">
              {filtered.map((wf) => (
                <tr
                  key={wf.id}
                  onClick={() => onSelectWorkflow(wf.id)}
                  className="hover:bg-dark-hover transition cursor-pointer group"
                >
                  <td className="p-4 font-mono font-bold text-brand-400">{wf.id}</td>
                  <td className="p-4 space-y-0.5">
                    <p className="font-bold text-white group-hover:text-brand-300 transition">{wf.workflowType}</p>
                    <p className="text-[11px] text-gray-400 truncate max-w-xs">{wf.requestText}</p>
                  </td>
                  <td className="p-4 text-gray-300">
                    <p className="font-semibold">{wf.requesterName}</p>
                    <p className="text-[10px] text-gray-400">{wf.department}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      wf.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {wf.priority}
                    </span>
                  </td>
                  <td className="p-4 font-mono">
                    <span className="px-2 py-1 rounded bg-dark-base border border-dark-border text-brand-300 font-bold text-[11px]">
                      {wf.state}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {wf.slaHours}h target
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg bg-dark-base border border-dark-border text-gray-300 group-hover:text-white group-hover:bg-brand-600 transition">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
