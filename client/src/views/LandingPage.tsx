import React from 'react';
import { Cpu, ArrowRight, Play, Sparkles, CheckCircle2, ShieldCheck, GitMerge, RefreshCw, Zap } from 'lucide-react';
import { useI18n } from '../i18n';

interface LandingPageProps {
  onStartWorkflow: () => void;
  onRunDemo: () => void;
  onExploreWorkflows: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartWorkflow,
  onRunDemo,
  onExploreWorkflows,
  onLogin,
}) => {
  const { t } = useI18n();
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-surface via-dark-card to-dark-base border border-dark-border p-8 md:p-12 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-brand-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>PS ID: R2-P1 &bull; Intelligent Business Workflow Automation</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          AI ORCHESTRATOR
        </h1>

        <p className="mt-3 text-xl font-bold bg-gradient-to-r from-brand-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
          "{t('landing.tagline')}"
        </p>

        <p className="mt-2 text-xs font-mono uppercase tracking-widest text-gray-400">
           {t('landing.secondary')}
        </p>

        <p className="mt-6 text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
           {t('landing.description')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLogin}
            className="flex items-center gap-2 rounded-xl border border-brand-400/50 bg-brand-500/10 px-6 py-3.5 text-sm font-bold text-brand-100 transition-all duration-200 hover:scale-105 hover:bg-brand-500/20"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{t('landing.login')}</span>
          </button>
          <button
            onClick={onStartWorkflow}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:scale-105 transition-all duration-200"
          >
            <Cpu className="w-4 h-4" />
             <span>{t('landing.try')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRunDemo}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all duration-200"
          >
            <Play className="w-4 h-4 fill-current" />
             <span>{t('landing.demo')}</span>
          </button>

          <button
            onClick={onExploreWorkflows}
            className="px-6 py-3.5 rounded-xl bg-dark-card border border-dark-border text-gray-200 hover:text-white font-bold text-sm hover:bg-dark-hover transition-all"
          >
             {t('landing.explore')}
          </button>
        </div>
      </section>

      {/* Animated Orchestration Graph Preview */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-6">
        <div className="text-center space-y-2">
           <h2 className="text-lg font-bold text-white uppercase tracking-wider">{t('landing.pipeline')}</h2>
           <p className="text-xs text-gray-400">{t('landing.pipelineDescription')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2 text-center text-xs">
          {[
            { label: 'Business Request', icon: Cpu, color: 'text-brand-400 border-brand-500/30 bg-brand-500/10' },
            { label: 'AI Understanding', icon: Sparkles, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
            { label: 'Context Gathering', icon: CheckCircle2, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
            { label: 'Multi-step Plan', icon: GitMerge, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
            { label: 'Policy Check', icon: ShieldCheck, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
            { label: 'Human Approval', icon: ShieldCheck, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
            { label: 'Action Execution', icon: Zap, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
            { label: 'Re-planning', icon: RefreshCw, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
            { label: 'Resolution & Audit', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
          ].map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={idx} className={`p-3 rounded-xl border flex flex-col items-center gap-2 ${node.color}`}>
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-semibold leading-tight text-[11px]">{node.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/30 via-dark-card to-purple-950/20 p-6 shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{t('landing.multilingualTitle')}</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">{t('landing.multilingualDescription')}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-200 sm:grid-cols-4">
            {[
              ['🇬🇧', 'Recover overdue invoice.', 'Invoice & Payment Recovery'],
              ['🇮🇳', 'लंबित चालान का भुगतान प्राप्त करें।', 'Invoice & Payment Recovery'],
              ['🇮🇳', 'थकीत चलनाचे पेमेंट वसूल करा.', 'Invoice & Payment Recovery'],
              ['🇪🇸', 'Recuperar el pago atrasado.', 'Invoice & Payment Recovery'],
            ].map(([flag, request, result]) => (
              <div key={request} className="rounded-xl border border-dark-border bg-dark-base/80 p-3">
                <div className="text-lg">{flag}</div>
                <p className="mt-2 line-clamp-2 text-[11px] text-gray-300">{request}</p>
                <p className="mt-2 text-[10px] text-emerald-300">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Differentiator Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <span>Traditional Automation</span>
          </div>
          <div className="font-mono text-sm space-y-2 text-gray-400 bg-dark-base p-4 rounded-xl border border-dark-border">
            <p>Fixed Rule &rarr; Fixed Steps &rarr; Fixed Outcome</p>
            <p className="text-xs text-rose-300 font-sans italic mt-2">
              Fails immediately when missing information, API errors, or unexpected business policy conditions occur.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <span>AI ORCHESTRATOR Engine</span>
          </div>
          <div className="font-mono text-xs space-y-1.5 text-emerald-300 bg-dark-base p-4 rounded-xl border border-emerald-500/20">
            <p>Business Request &rarr; Understand Intent &rarr; Gather Context</p>
            <p>&rarr; Create Dynamic Plan &rarr; Policy Check &rarr; Execute</p>
            <p>&rarr; Observe Results &rarr; Handle Failure &rarr; Re-plan</p>
            <p>&rarr; Human Approval &rarr; Resolution &rarr; Audit</p>
          </div>
        </div>
      </section>
    </div>
  );
};
