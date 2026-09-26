import React, { useState } from 'react';
import { Activity, Play, AlertTriangle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface DigitalTwinViewProps {
  onRunDigitalTwin: (name: string) => Promise<any>;
  onRunActualWorkflow: (promptText: string) => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  onRunDigitalTwin,
  onRunActualWorkflow,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState('Invoice & Payment Recovery');
  const [twinData, setTwinData] = useState<any>({
    workflowName: 'Invoice & Payment Recovery',
    predictedStepsCount: 12,
    expectedApprovalsCount: 2,
    potentialFailuresCount: 1,
    potentialBottlenecks: [
      { stepName: 'Finance Manager Signoff', reason: 'High-value approval queue backlogs during end-of-month', avgDelayHours: 18 }
    ],
    estimatedResolutionDays: 2.4,
    riskLevel: 'MEDIUM',
    healthForecastScore: 92
  });

  const workflowsList = [
    'Invoice & Payment Recovery',
    'Employee Onboarding',
    'Purchase Request',
    'Sales Discount Approval',
    'IT Equipment Request'
  ];

  const handleSelectWorkflow = async (name: string) => {
    setSelectedWorkflow(name);
    const data = await onRunDigitalTwin(name);
    setTwinData(data);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-dark-border pb-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>WORKFLOW DIGITAL TWIN</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Pre-Execution Workflow Twin Simulation
        </h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
          Simulate performance, bottleneck latency, and risk profile before launching actual live execution.
        </p>
      </div>

      {/* Select Workflow */}
      <div className="flex flex-wrap gap-2 justify-center">
        {workflowsList.map((wfName) => (
          <button
            key={wfName}
            onClick={() => handleSelectWorkflow(wfName)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              selectedWorkflow === wfName
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-dark-card text-gray-300 border-dark-border hover:bg-dark-hover'
            }`}
          >
            {wfName}
          </button>
        ))}
      </div>

      {/* Twin KPI Grid */}
      {twinData && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">{twinData.workflowName} Twin</h2>
              <span className="text-xs text-indigo-400 font-mono">Digital Twin Forecast Model v1.0</span>
            </div>

            <button
              onClick={() => onRunActualWorkflow(`Find overdue invoices above ₹50,000 and recover the payments.`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN ACTUAL WORKFLOW</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-dark-base border border-dark-border">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Predicted Steps</span>
              <span className="text-2xl font-extrabold text-white font-mono">{twinData.predictedStepsCount}</span>
            </div>

            <div className="p-4 rounded-xl bg-dark-base border border-dark-border">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Expected Approvals</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">{twinData.expectedApprovalsCount}</span>
            </div>

            <div className="p-4 rounded-xl bg-dark-base border border-dark-border">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Potential Failures</span>
              <span className="text-2xl font-extrabold text-rose-400 font-mono">{twinData.potentialFailuresCount}</span>
            </div>

            <div className="p-4 rounded-xl bg-dark-base border border-dark-border">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Est. Resolution Time</span>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">{twinData.estimatedResolutionDays} days</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-surface border border-dark-border space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">Predicted Bottlenecks:</h3>
            {twinData.potentialBottlenecks.map((b: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-dark-base border border-amber-500/30 text-xs flex items-center justify-between text-amber-300">
                <span className="font-bold">{b.stepName}</span>
                <span className="font-mono text-[11px] text-gray-300">{b.reason} (~{b.avgDelayHours}h delay)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
