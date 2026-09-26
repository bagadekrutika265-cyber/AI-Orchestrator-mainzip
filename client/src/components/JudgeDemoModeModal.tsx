import React, { useState } from 'react';
import { X, Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

interface JudgeDemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunWorkflow: (promptText: string) => void;
  onSimulateEvent: (eventType: string) => void;
  onApproveCurrent: () => void;
}

export const JudgeDemoModeModal: React.FC<JudgeDemoModeModalProps> = ({
  isOpen,
  onClose,
  onRunWorkflow,
  onSimulateEvent,
  onApproveCurrent,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'Demo Step 1: Invoice & Payment Recovery (Primary Demo Workflow)',
      prompt: 'Recover overdue invoices above ₹50,000 from high-risk customers.',
      desc: 'Demonstrates NLP understanding, multi-source context gathering (Invoice DB + Customer CRM), risk scoring, policy check, and human approval pause.',
      actionText: 'Execute Workflow Request',
      onExecute: () => {
        onRunWorkflow('Recover overdue invoices above ₹50,000 from high-risk customers.');
        setCurrentStep(1);
      }
    },
    {
      title: 'Demo Step 2: Human-In-The-Loop Approval Signoff',
      prompt: 'High-Value Outreach (₹2,40,000) exceeds automatic policy threshold.',
      desc: 'Policy pol-1 triggered: Requests above ₹50,000 require Manager signoff before dispatching external legal recovery communications.',
      actionText: 'Approve Outbound Recovery Notice',
      onExecute: () => {
        onApproveCurrent();
        setCurrentStep(2);
      }
    },
    {
      title: 'Demo Step 3: Failure Injection & Dynamic Re-planning',
      prompt: 'Primary Email API Service Failure (HTTP 503 Outage).',
      desc: 'Simulate runtime failure. AI Orchestrator detects error, analyzes impact, and dynamically re-plans to alternate SMS/WhatsApp fallback gateway.',
      actionText: 'Inject Email Failure & Re-plan',
      onExecute: () => {
        onSimulateEvent('EMAIL_FAILURE');
        setCurrentStep(3);
      }
    },
    {
      title: 'Demo Step 4: Instant Settlement & Final Resolution',
      prompt: 'Bank Gateway detects incoming payment settlement of ₹2,40,000!',
      desc: 'Payment received condition changes state to RESOLVED, updates invoice ledger, cancels pending follow-ups, and logs complete audit trail.',
      actionText: 'Simulate Payment Settlement & Complete',
      onExecute: () => {
        onSimulateEvent('PAYMENT_RECEIVED');
        setCurrentStep(4);
      }
    },
    {
      title: 'Demo Step 5: Cross-Workflow Orchestration (Employee Onboarding)',
      prompt: 'New employee joins next Monday.',
      desc: 'Proves the same engine powers cross-department workflows (HR -> IT Hardware -> Email Account -> Directory Access -> Manager Setup).',
      actionText: 'Run Employee Onboarding Workflow',
      onExecute: () => {
        onRunWorkflow('New employee joins next Monday.');
        setCurrentStep(5);
      }
    },
    {
      title: 'Demo Step 6: Configurable Policy Tiers (Sales Discount)',
      prompt: 'Give ABC Corp a 20% discount.',
      desc: 'Demonstrates multi-tier sales discount policy evaluation (15-25% tier routes to Finance Director signoff).',
      actionText: 'Run Sales Discount Workflow',
      onExecute: () => {
        onRunWorkflow('Give ABC Corp a 20% discount.');
        onClose();
      }
    }
  ];

  const activeDemo = demoSteps[Math.min(currentStep, demoSteps.length - 1)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-dark-surface to-dark-card border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                HACKATHON JUDGE DEMO MODE
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Step {currentStep + 1} of {demoSteps.length}
                </span>
              </h2>
              <p className="text-xs text-gray-400">Guided 2-Minute Tour of AI Orchestrator Core Capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-hover transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-surface h-1.5 flex">
          {demoSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx < currentStep ? 'bg-emerald-500' : idx === currentStep ? 'bg-emerald-400 animate-pulse' : 'bg-gray-800'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-dark-surface border border-dark-border space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span>Current Interactive Objective</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-white font-mono bg-dark-base/60 p-3 rounded-lg border border-dark-border">
              "{activeDemo.prompt}"
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              {activeDemo.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Multi-Source Context Verified</span>
            </div>
            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex items-center gap-2 text-indigo-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>Policy Threshold Evaluation</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center gap-2 text-amber-300">
              <UserCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Human-In-The-Loop Control</span>
            </div>
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-center gap-2 text-rose-300">
              <RefreshCw className="w-4 h-4 shrink-0 text-rose-400 animate-spin-slow" />
              <span>Dynamic Re-planning Ready</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-dark-surface border-t border-dark-border flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30"
          >
            Previous Step
          </button>

          <button
            onClick={activeDemo.onExecute}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <span>{activeDemo.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
