import React, { useState } from 'react';
import { Wand2, Sparkles, Play, Save, CheckCircle2, Plus } from 'lucide-react';

interface CustomWorkflowViewProps {
  onRunCustom: (triggerExample: string) => void;
}

export const CustomWorkflowView: React.FC<CustomWorkflowViewProps> = ({
  onRunCustom,
}) => {
  const [prompt, setPrompt] = useState('Create a workflow for approving employee travel.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<{
    name: string;
    trigger: string;
    steps: Array<{ name: string; role: string; dataSource: string }>;
  } | null>({
    name: 'Employee Travel Approval Workflow',
    trigger: 'Employee submits travel reimbursement request',
    steps: [
      { name: 'Validate Travel Dates & Itinerary', role: 'AI Engine', dataSource: 'Employee Records' },
      { name: 'Check Company Travel & Spending Policy', role: 'AI Engine', dataSource: 'Policy Engine' },
      { name: 'Calculate Estimated Flight & Hotel Cost', role: 'AI Engine', dataSource: 'Travel API' },
      { name: 'Request Manager Approval', role: 'Reporting Manager', dataSource: 'Approval Engine' },
      { name: 'Request Finance Director Approval (> ₹50k)', role: 'Finance Director', dataSource: 'Approval Engine' },
      { name: 'Issue Corporate Flight & Hotel Booking', role: 'System', dataSource: 'Booking Gateway' },
      { name: 'Send Itinerary Confirmation to Employee', role: 'System', dataSource: 'Email Gateway' },
      { name: 'Log Complete Audit Trail', role: 'AI Engine', dataSource: 'Audit Log' }
    ]
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedWorkflow({
        name: `${prompt.replace(/create a workflow for/i, '').trim().toUpperCase()} Workflow`,
        trigger: `User submits ${prompt}`,
        steps: [
          { name: 'Analyze Request Intent & Constraints', role: 'AI Engine', dataSource: 'NLP Parser' },
          { name: 'Validate Business Policy & Thresholds', role: 'AI Engine', dataSource: 'Policy Engine' },
          { name: 'Gather Context from Systems', role: 'AI Engine', dataSource: 'Database' },
          { name: 'Request Manager Sign-off', role: 'Manager', dataSource: 'Approval Engine' },
          { name: 'Execute Final System Action', role: 'System', dataSource: 'System API' },
          { name: 'Record Immutable Audit Log', role: 'AI Engine', dataSource: 'Audit Service' }
        ]
      });
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-dark-border pb-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold mb-3">
          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          <span>AI CUSTOM WORKFLOW GENERATOR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Create Custom Workflow with AI
        </h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
          Describe any business process and AI Orchestrator will synthesize a full workflow definition.
        </p>
      </div>

      {/* Generator Prompt Form */}
      <form onSubmit={handleGenerate} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Create a workflow for approving employee travel.'"
            className="w-full bg-dark-base border border-dark-border rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:scale-[1.01] transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Workflow Blueprint...' : 'GENERATE WORKFLOW WITH AI'}</span>
        </button>
      </form>

      {/* Generated Result Preview */}
      {generatedWorkflow && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">{generatedWorkflow.name}</h2>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">Trigger: "{generatedWorkflow.trigger}"</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Valid AI Blueprint
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Generated Execution Steps ({generatedWorkflow.steps.length}):</h3>
            <div className="space-y-2">
              {generatedWorkflow.steps.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <span className="text-amber-300">{s.role}</span>
                    &bull;
                    <span className="text-brand-300">{s.dataSource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-dark-border flex flex-wrap gap-3">
            <button
              onClick={() => onRunCustom(prompt)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN WORKFLOW NOW</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
