import React from 'react';
import { WorkflowInstance } from '../types';
import { CheckSquare, ShieldCheck, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';

interface ApprovalCenterViewProps {
  workflows: WorkflowInstance[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalCenterView: React.FC<ApprovalCenterViewProps> = ({
  workflows,
  onApprove,
  onReject,
}) => {
  const pendingApprovals = workflows.filter(w => w.state === 'WAITING_FOR_APPROVAL');

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-amber-400" />
          HUMAN-IN-THE-LOOP APPROVAL CENTER
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          High-value, high-risk, or policy-sensitive execution pauses requiring human signoff
        </p>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="p-12 text-center bg-dark-card border border-dark-border rounded-2xl space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Pending Approvals</h3>
          <p className="text-xs text-gray-400">All automated policy thresholds are satisfied.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.map((wf) => (
            <div key={wf.id} className="p-6 rounded-2xl bg-dark-card border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{wf.id}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {wf.approvalDetails?.approverRole || 'Manager'} Signoff
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{wf.workflowType}</h3>
                <p className="text-xs text-gray-300">"{wf.requestText}"</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-base border border-dark-border space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-gray-400">Policy Context & Rationale</span>
                <p className="text-gray-200">{wf.approvalDetails?.reason}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onApprove(wf.id)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition"
                >
                  APPROVE & RESUME
                </button>
                <button
                  onClick={() => onReject(wf.id)}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition"
                >
                  REJECT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
