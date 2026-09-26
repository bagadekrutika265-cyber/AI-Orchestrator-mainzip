import React from 'react';
import { WorkflowInstance } from '../types';
import { LayoutDashboard, CheckSquare, Clock, AlertTriangle, ShieldCheck, Activity, ArrowUpRight, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  workflows: WorkflowInstance[];
  onSelectWorkflow: (id: string) => void;
  onNavigateToApprovals: () => void;
  onNavigateToInbox: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  workflows,
  onSelectWorkflow,
  onNavigateToApprovals,
  onNavigateToInbox,
}) => {
  const activeCount = workflows.filter(w => w.state !== 'RESOLVED' && w.state !== 'CLOSED').length;
  const pendingApprovals = workflows.filter(w => w.state === 'WAITING_FOR_APPROVAL').length;
  const waitingInfo = workflows.filter(w => w.state === 'WAITING_FOR_INFORMATION').length;
  const escalations = workflows.filter(w => w.state === 'ESCALATED').length;
  const slaBreaches = workflows.filter(w => w.slaStatus === 'SLA_BREACHED').length;
  const completedToday = 18 + workflows.filter(w => w.state === 'RESOLVED').length;

  const kpis = [
    { label: 'TOTAL REQUESTS', value: workflows.length + 14, color: 'text-white border-dark-border', icon: LayoutDashboard },
    { label: 'ACTIVE WORKFLOWS', value: activeCount, color: 'text-brand-400 border-brand-500/30 bg-brand-500/10', icon: Activity },
    { label: 'PENDING APPROVALS', value: pendingApprovals, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', icon: CheckSquare, onClick: onNavigateToApprovals },
    { label: 'WAITING FOR INFO', value: waitingInfo, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', icon: Clock },
    { label: 'ESCALATIONS', value: escalations, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', icon: AlertTriangle },
    { label: 'SLA BREACHES', value: slaBreaches, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', icon: AlertTriangle },
    { label: 'COMPLETED TODAY', value: completedToday, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', icon: ShieldCheck },
  ];

  const categories = [
    'Leave Request', 'Purchase Request', 'Expense Reimbursement', 'Customer Complaint',
    'IT Equipment Request', 'Employee Onboarding', 'Sales Discount Approval', 'Vendor Approval',
    'Service Request', 'Invoice & Payment Recovery'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-brand-400" />
            BUSINESS OPERATIONS COMMAND CENTER
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time unified orchestration health, active workflows, and bottleneck monitor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
              89/100
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Overall Health Score</span>
              <span className="text-xs font-semibold text-emerald-400">Excellent Operational Flow</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.onClick}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${kpi.color} ${kpi.onClick ? 'cursor-pointer hover:scale-[1.03]' : ''}`}
            >
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] uppercase font-bold tracking-wider">{kpi.label}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-2xl font-extrabold mt-2 font-mono">{kpi.value}</span>
            </div>
          );
        })}
      </div>

      {/* Categories Bar */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Supported Business Workflow Categories (10 Core Engine Modules)
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border text-xs font-semibold text-gray-300 hover:text-white hover:border-brand-500/40 transition cursor-default flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Active Workflows Section */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-400" />
            Active Workflow Instances
          </h2>
          <button
            onClick={onNavigateToInbox}
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View Full Request Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => onSelectWorkflow(wf.id)}
              className="p-4 rounded-xl bg-dark-surface border border-dark-border hover:border-brand-500/50 hover:bg-dark-hover transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-brand-400 font-bold">{wf.id}</span>
                  <span className="font-bold text-sm text-white">{wf.title}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    wf.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {wf.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Requester: <span className="text-gray-200">{wf.requesterName}</span> ({wf.department}) &bull; State: <span className="text-brand-300 font-semibold">{wf.state}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {wf.approvalDetails?.required && wf.approvalDetails.status === 'PENDING' && (
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" />
                    Approval Required
                  </span>
                )}
                {wf.replannedCount > 0 && (
                  <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
                    🔄 RE-PLANNED ({wf.replannedCount})
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
