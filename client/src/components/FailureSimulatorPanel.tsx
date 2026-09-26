import React from 'react';
import { AlertTriangle, Zap, CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';

interface FailureSimulatorPanelProps {
  onInjectEvent: (eventType: string) => void;
  activeWorkflowId?: string;
}

export const FailureSimulatorPanel: React.FC<FailureSimulatorPanelProps> = ({
  onInjectEvent,
  activeWorkflowId,
}) => {
  const events = [
    { type: 'EMAIL_FAILURE', label: 'Email Failure (503)', icon: Zap, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { type: 'PAYMENT_RECEIVED', label: 'Payment Received', icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { type: 'EQUIPMENT_UNAVAILABLE', label: 'Equipment Unavailable', icon: AlertTriangle, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
    { type: 'CUSTOMER_NO_RESPONSE', label: "Customer Doesn't Respond", icon: Clock, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
    { type: 'DOCUMENT_MISSING', label: 'Document Missing', icon: RefreshCw, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { type: 'APPROVAL_REJECTED', label: 'Approval Rejected', icon: XCircle, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  ];

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-dark-border pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">SIMULATE BUSINESS EVENT</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Hackathon Demo Panel
        </span>
      </div>

      <p className="text-xs text-gray-400">
        Inject dynamic runtime disruptions to test AI Orchestrator's automatic failure handling, state machine recovery, and re-planning engine.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {events.map((e) => {
          const Icon = e.icon;
          return (
            <button
              key={e.type}
              onClick={() => onInjectEvent(e.type)}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-start gap-1.5 transition-all duration-150 hover:scale-[1.02] active:scale-95 text-left ${e.color}`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-wider font-mono opacity-60">TEST</span>
              </div>
              <span className="font-semibold text-gray-100">{e.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
