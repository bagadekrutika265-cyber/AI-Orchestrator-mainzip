import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          ORCHESTRATION ANALYTICS DASHBOARD
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Performance metrics, SLA compliance rate, resolution latency, and automation vs human signoff ratio
        </p>
      </div>

      {/* Metrics Header Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Automation Rate</span>
          <p className="text-3xl font-extrabold text-brand-400 font-mono">78.5%</p>
          <span className="text-[10px] text-emerald-400">↑ +5.2% this week</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold">SLA Compliance</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">94.2%</p>
          <span className="text-[10px] text-emerald-400">On Target</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Avg Resolution Time</span>
          <p className="text-3xl font-extrabold text-cyan-400 font-mono">4.8h</p>
          <span className="text-[10px] text-cyan-400">vs 48h manual benchmark</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Failure Recovery Rate</span>
          <p className="text-3xl font-extrabold text-purple-400 font-mono">92.0%</p>
          <span className="text-[10px] text-purple-400">Auto Re-planned</span>
        </div>
      </div>

      {/* Detailed Analytics Visual Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Requests by Category Breakdown</h3>
          <div className="space-y-3 text-xs font-semibold">
            {[
              { category: 'Invoice & Payment Recovery', pct: '35%', count: 12, color: 'bg-brand-500' },
              { category: 'Leave Request', pct: '20%', count: 8, color: 'bg-indigo-500' },
              { category: 'Purchase Request', pct: '15%', count: 5, color: 'bg-cyan-500' },
              { category: 'IT Equipment Request', pct: '12%', count: 4, color: 'bg-purple-500' },
              { category: 'Sales Discount Approval', pct: '10%', count: 3, color: 'bg-amber-500' },
              { category: 'Other Workflows', pct: '8%', count: 2, color: 'bg-gray-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-gray-300">
                  <span>{item.category}</span>
                  <span className="font-mono text-gray-400">{item.pct} ({item.count})</span>
                </div>
                <div className="w-full bg-dark-base h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI vs Human Action Distribution</h3>
          <div className="p-6 rounded-xl bg-dark-base border border-dark-border text-center space-y-4">
            <div className="flex justify-center items-center gap-6">
              <div>
                <span className="text-3xl font-extrabold text-brand-400 font-mono">78%</span>
                <span className="block text-[10px] text-gray-400 font-bold uppercase mt-1">🤖 AI Automated</span>
              </div>
              <div className="h-10 w-px bg-dark-border" />
              <div>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">22%</span>
                <span className="block text-[10px] text-gray-400 font-bold uppercase mt-1">👤 Human Approved</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              AI handles routine data gathering and context extraction while routing high-value actions to human signoff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
