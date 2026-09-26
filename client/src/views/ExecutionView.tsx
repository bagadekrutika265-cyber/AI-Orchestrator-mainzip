import React, { useState } from 'react';
import { WorkflowInstance, WorkflowTask } from '../types';
import { GitMerge, CheckCircle2, Clock, AlertTriangle, ShieldCheck, UserCheck, RefreshCw, Zap, ArrowRight, Play, Database, FileText } from 'lucide-react';
import { FailureSimulatorPanel } from '../components/FailureSimulatorPanel';

interface ExecutionViewProps {
  workflow: WorkflowInstance;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onInjectEvent: (eventType: string) => void;
}

export const ExecutionView: React.FC<ExecutionViewProps> = ({
  workflow,
  onApprove,
  onReject,
  onInjectEvent,
}) => {
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(workflow.tasks[0] || null);

  const getTaskBadge = (task: WorkflowTask) => {
    if (task.status === 'COMPLETED') return <span className="text-emerald-400 flex items-center gap-1 font-bold">✓ Completed</span>;
    if (task.status === 'RUNNING') return <span className="text-amber-400 flex items-center gap-1 font-bold">⟳ Running</span>;
    if (task.status === 'WAITING') return <span className="text-cyan-400 flex items-center gap-1 font-bold">⏸ Waiting</span>;
    if (task.status === 'FAILED') return <span className="text-rose-400 flex items-center gap-1 font-bold">⚠ Failed</span>;
    if (task.status === 'REPLANNED') return <span className="text-orange-400 flex items-center gap-1 font-bold">🔄 Re-planned</span>;
    return <span className="text-gray-400 font-bold">Pending</span>;
  };

  const getExecutionTypeBadge = (type?: string) => {
    if (type === 'AI_AUTOMATED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">🤖 AI AUTOMATED</span>;
    if (type === 'HUMAN_APPROVED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">👤 HUMAN APPROVED</span>;
    if (type === 'SYSTEM_EXECUTED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">⚙ SYSTEM EXECUTED</span>;
    if (type === 'AI_REPLANNED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">🔄 AI RE-PLANNED</span>;
    if (type === 'ESCALATED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">🚨 ESCALATED</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400">PENDING</span>;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-brand-400 font-bold">{workflow.id}</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
              workflow.state === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {workflow.state}
            </span>
            {workflow.replannedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px] font-bold border border-orange-500/30 animate-pulse">
                WORKFLOW RE-PLANNED ({workflow.replannedCount})
              </span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-white">{workflow.title}</h1>
          <p className="text-xs text-gray-400 font-mono">
            Objective: "{workflow.requestText}"
          </p>
        </div>

        {/* Health score & confidence */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">AI Confidence</span>
            <span className="text-sm font-extrabold text-brand-300 font-mono">{workflow.confidenceScore}%</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Health Score</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">{workflow.healthScore}/100</span>
          </div>
        </div>
      </div>

      {/* Human Approval Required Notice Banner */}
      {workflow.state === 'WAITING_FOR_APPROVAL' && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>HUMAN APPROVAL REQUIRED</span>
            </div>
            <span className="text-xs text-amber-400 font-mono">Role: {workflow.approvalDetails?.approverRole}</span>
          </div>

          <p className="text-xs text-gray-200">
            {workflow.approvalDetails?.reason}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onApprove(workflow.id)}
              className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
            >
              APPROVE & RESUME WORKFLOW
            </button>

            <button
              onClick={() => onReject(workflow.id)}
              className="px-5 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition"
            >
              REJECT
            </button>
          </div>
        </div>
      )}

      {/* Re-planned Alert Banner */}
      {workflow.lastReplanReason && (
        <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/40 text-orange-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin-slow shrink-0" />
            <div>
              <span className="font-bold">WORKFLOW RE-PLANNED: </span>
              <span>{workflow.lastReplanReason}</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Execution Graph & Pipeline */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-brand-400" />
          Interactive Multi-Step Execution Task Graph
        </h2>

        {/* Task Steps Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {workflow.tasks.map((task, idx) => {
            const isSelected = selectedTask?.id === task.id;
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 space-y-3 relative ${
                  isSelected
                    ? 'bg-brand-950/30 border-brand-500 shadow-lg shadow-brand-500/10'
                    : 'bg-dark-surface border-dark-border hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span>STEP {idx + 1}</span>
                  {getTaskBadge(task)}
                </div>

                <p className="font-bold text-xs text-white leading-snug">{task.name}</p>

                <div className="pt-2 border-t border-dark-border flex items-center justify-between">
                  {getExecutionTypeBadge(task.executionType)}
                  <span className="text-[10px] font-mono text-gray-400">{task.risk} RISK</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Detail Inspector */}
        {selectedTask && (
          <div className="p-5 rounded-xl bg-dark-base border border-dark-border space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Task Inspector: {selectedTask.name}</span>
              </h3>
              {getTaskBadge(selectedTask)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Description</span>
                <p className="text-gray-200 mt-0.5">{selectedTask.description}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Data Source</span>
                <p className="text-brand-300 font-semibold mt-0.5">{selectedTask.dataSource || 'Internal Engine'}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Responsible Role</span>
                <p className="text-amber-300 font-semibold mt-0.5">{selectedTask.responsibleRole}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Source Data Context Tracker */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-400" />
          MULTI-SOURCE DATA CONTEXT USED FOR THIS WORKFLOW
        </h3>
        <div className="flex flex-wrap gap-2">
          {workflow.dataSourcesUsed.map((ds, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-dark-base border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {ds}
            </span>
          ))}
        </div>
      </div>

      {/* Live Failure Simulator Trigger Panel */}
      <FailureSimulatorPanel
        onInjectEvent={(eventType) => onInjectEvent(eventType)}
        activeWorkflowId={workflow.id}
      />
    </div>
  );
};
