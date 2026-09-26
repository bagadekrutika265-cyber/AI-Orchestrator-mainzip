import React, { useState } from 'react';
import { Terminal, Send, Sparkles, ArrowRight, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { UnderstandingResult } from '../types';

interface CommandCenterProps {
  onSubmitRequest: (text: string) => void;
  onUnderstandText: (text: string) => Promise<UnderstandingResult>;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onSubmitRequest,
  onUnderstandText,
}) => {
  const [requestText, setRequestText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [understanding, setUnderstanding] = useState<UnderstandingResult | null>(null);

  const samplePrompts = [
    "Find overdue invoices above ₹50,000 and recover the payments.",
    "I want leave from 10 October to 13 October.",
    "Purchase 20 office chairs for our new office.",
    "I want reimbursement for my ₹8,500 business trip.",
    "A customer received a damaged product.",
    "My laptop is damaged and I need a replacement.",
    "New employee joins next Monday.",
    "Give ABC customer a 20% discount.",
    "Approve this new software vendor.",
    "The finance department network is not working."
  ];

  const handleSelectSample = async (prompt: string) => {
    setRequestText(prompt);
    setIsAnalyzing(true);
    try {
      const res = await onUnderstandText(prompt);
      setUnderstanding(res);
    } catch {
      // fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRequestText(val);
    if (val.trim().length > 10) {
      setIsAnalyzing(true);
      try {
        const res = await onUnderstandText(val);
        setUnderstanding(res);
      } catch {
        // fallback
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setUnderstanding(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    onSubmitRequest(requestText);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-bold">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          <span>CENTRAL AI COMMAND CENTER</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          What would you like to accomplish?
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          State your business request in natural language. AI Orchestrator will automatically classify the workflow, gather context, evaluate policies, generate a multi-step plan, and manage execution.
        </p>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="relative">
          <textarea
            value={requestText}
            onChange={handleTextChange}
            placeholder="Describe your business request (e.g., 'Find overdue invoices above ₹50,000 and recover the payments.')..."
            rows={4}
            className="w-full bg-dark-base border border-dark-border rounded-xl p-4 text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition resize-none font-sans"
          />
          {isAnalyzing && (
            <div className="absolute top-3 right-3 flex items-center gap-2 text-xs text-brand-400 font-semibold bg-dark-card px-2.5 py-1 rounded-md border border-dark-border">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Analyzing Request...</span>
            </div>
          )}
        </div>

        {/* Live NLP Preview Card */}
        {understanding && (
          <div className="p-4 rounded-xl bg-dark-surface border border-brand-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                AI Understanding & Entity Extraction
              </span>
              <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">
                {understanding.confidenceScore}% Confidence
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-dark-base p-2.5 rounded-lg border border-dark-border">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Detected Workflow</span>
                <span className="font-bold text-white">{understanding.suggestedWorkflow}</span>
              </div>
              <div className="bg-dark-base p-2.5 rounded-lg border border-dark-border">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Priority</span>
                <span className={`font-bold ${understanding.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {understanding.priority}
                </span>
              </div>
              <div className="bg-dark-base p-2.5 rounded-lg border border-dark-border">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Intent</span>
                <span className="font-semibold text-gray-200 truncate block">{understanding.intent}</span>
              </div>
              <div className="bg-dark-base p-2.5 rounded-lg border border-dark-border">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Missing Info</span>
                <span className="font-semibold text-emerald-400">
                  {understanding.missingInformation.length > 0 ? understanding.missingInformation.join(', ') : 'None (Complete)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400 hidden sm:inline">
            No manual workflow configuration required &bull; Auto Router Enabled
          </span>
          <button
            type="submit"
            disabled={!requestText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all ml-auto"
          >
            <span>START WORKFLOW</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Sample Request Prompts Chips */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Example Business Requests (Click to Test):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(prompt)}
              className="p-3.5 rounded-xl bg-dark-card border border-dark-border hover:border-brand-500/50 hover:bg-dark-hover text-left text-xs font-semibold text-gray-200 flex items-center justify-between group transition-all"
            >
              <span className="truncate pr-2">"{prompt}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
