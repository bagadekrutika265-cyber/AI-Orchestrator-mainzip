import React from 'react';
import { WorkflowTemplate } from '../types';
import { FileText, Play, Database, Shield, Clock } from 'lucide-react';

interface TemplatesViewProps {
  templates: WorkflowTemplate[];
  onSelectTemplate: (triggerExample: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-400" />
          SUPPORTED WORKFLOW TEMPLATES (10 CORE MODULES)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Pre-configured business workflow blueprints powered by the single unified orchestration engine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[10px] font-bold uppercase">
                  {tmpl.category}
                </span>
                <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  SLA: {tmpl.defaultSlaHours}h
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{tmpl.name}</h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-base border border-dark-border text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Trigger Example</span>
                <p className="font-mono text-emerald-300">"{tmpl.triggerExample}"</p>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-border flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-mono">
                {tmpl.steps.length} Steps &bull; {tmpl.dataSources.length} Data Sources
              </span>

              <button
                onClick={() => onSelectTemplate(tmpl.triggerExample)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-500 transition shadow-lg shadow-brand-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Workflow</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
