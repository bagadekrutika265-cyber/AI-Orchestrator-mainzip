import React, { useState } from 'react';
import { HelpCircle, Sparkles, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WhatIfViewProps {
  onRunWhatIf: (question: string) => Promise<any>;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({ onRunWhatIf }) => {
  const [question, setQuestion] = useState("What if the customer doesn't respond for 7 days?");
  const [result, setResult] = useState<any>({
    scenarioName: 'Customer Communication Timeout (7 Days)',
    predictedSteps: [
      { day: 'Day 0', action: 'Initial Payment Demand Notice sent via Email', actor: 'AI Orchestrator', risk: 'LOW' },
      { day: 'Day 3', action: 'Automated Follow-up & SMS Reminder dispatched', actor: 'System', risk: 'MEDIUM' },
      { day: 'Day 7', action: 'Communication SLA Timeout triggered. Workflow State -> ESCALATED', actor: 'AI Engine', risk: 'HIGH' },
      { day: 'Day 8', action: 'Manual Escalation to Senior Legal & Accounts Lead', actor: 'Legal Manager', risk: 'HIGH' }
    ],
    potentialOutcome: 'Manual intervention required. Account escalated to legal recovery.',
    humanInterventionRequired: true,
    estimatedDelayHours: 192
  });

  const sampleQuestions = [
    "What if the customer doesn't respond for 7 days?",
    "What if the manager rejects the request?",
    "What if the equipment is unavailable?",
    "What if the payment is received early?",
    "What if the vendor document is missing?"
  ];

  const handleSimulate = async (qText: string) => {
    setQuestion(qText);
    const res = await onRunWhatIf(qText);
    setResult(res);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-dark-border pb-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>WHAT-IF SCENARIO SIMULATOR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          What-If Workflow Simulator
        </h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
          Predict potential workflow outcomes, bottleneck delays, and escalation paths under changing business conditions.
        </p>
      </div>

      {/* Input */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a what-if question..."
            className="flex-1 bg-dark-base border border-dark-border rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSimulate(question)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 hover:scale-105 transition"
          >
            SIMULATE
          </button>
        </div>

        {/* Sample chips */}
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulate(sq)}
              className="px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border text-xs text-gray-300 hover:text-white hover:border-cyan-500/40 transition"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Simulated Scenario</span>
              <h2 className="text-lg font-bold text-white">{result.scenarioName}</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              result.humanInterventionRequired ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {result.humanInterventionRequired ? 'Human Intervention Expected' : 'Auto Resolved'}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Predicted Timeline Progression:</h3>
            <div className="space-y-2">
              {result.predictedSteps.map((step: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 font-bold w-14 shrink-0">{step.day}</span>
                    <span className="font-semibold text-gray-200">{step.action}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 bg-dark-base px-2 py-0.5 rounded border border-dark-border">
                    {step.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-base border border-dark-border text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Predicted Outcome</span>
            <p className="font-semibold text-cyan-300">{result.potentialOutcome}</p>
          </div>
        </div>
      )}
    </div>
  );
};
