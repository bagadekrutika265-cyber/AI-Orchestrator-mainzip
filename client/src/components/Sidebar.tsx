import React from 'react';
import {
  Home,
  Terminal,
  LayoutDashboard,
  Inbox,
  GitMerge,
  CheckSquare,
  FileText,
  Wand2,
  Database,
  BarChart3,
  History,
  HelpCircle,
  Activity,
  AlertTriangle,
  Settings,
  Bell
} from 'lucide-react';

export type ViewId =
  | 'landing'
  | 'command-center'
  | 'dashboard'
  | 'inbox'
  | 'execution'
  | 'approvals'
  | 'templates'
  | 'custom-generator'
  | 'datasources'
  | 'analytics'
  | 'audit'
  | 'what-if'
  | 'digital-twin'
  | 'failure-simulator'
  | 'notifications'
  | 'settings';

interface SidebarProps {
  currentView: ViewId;
  onSelectView: (view: ViewId) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  pendingApprovalsCount,
}) => {
  const menuItems = [
    { id: 'landing', label: 'Landing Page', icon: Home, category: 'Main' },
    { id: 'command-center', label: 'AI Command Center', icon: Terminal, category: 'Main', badge: 'Core' },
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard, category: 'Main' },
    { id: 'inbox', label: 'Request Inbox', icon: Inbox, category: 'Main' },
    { id: 'execution', label: 'Workflow Visualizer', icon: GitMerge, category: 'Main' },
    { id: 'approvals', label: 'Approval Center', icon: CheckSquare, category: 'Main', badgeCount: pendingApprovalsCount },
    
    { id: 'templates', label: 'Workflow Templates (10)', icon: FileText, category: 'Orchestration' },
    { id: 'custom-generator', label: 'AI Workflow Builder', icon: Wand2, category: 'Orchestration' },
    { id: 'datasources', label: 'Data Sources (Multi-source)', icon: Database, category: 'Orchestration' },
    
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, category: 'Insights' },
    { id: 'audit', label: 'Audit Trail & Logs', icon: History, category: 'Insights' },
    { id: 'what-if', label: 'What-If Simulator', icon: HelpCircle, category: 'Simulation' },
    { id: 'digital-twin', label: 'Workflow Digital Twin', icon: Activity, category: 'Simulation' },
    { id: 'failure-simulator', label: 'Failure Simulator', icon: AlertTriangle, category: 'Simulation', badge: 'Live Demo' },
    
    { id: 'settings', label: 'Policies & Settings', icon: Settings, category: 'System' },
  ];

  return (
    <aside className="w-64 bg-dark-surface border-r border-dark-border flex flex-col h-[calc(100vh-61px)] shrink-0 overflow-y-auto">
      <div className="p-4 space-y-6">
        {['Main', 'Orchestration', 'Insights', 'Simulation', 'System'].map((cat) => {
          const items = menuItems.filter((i) => i.category === cat);
          return (
            <div key={cat} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {cat}
              </h3>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id as ViewId)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                        : 'text-gray-400 hover:text-gray-100 hover:bg-dark-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badgeCount && item.badgeCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        {item.badgeCount}
                      </span>
                    ) : null}

                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.badge === 'Live Demo'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-brand-500/20 text-brand-300'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-dark-border bg-dark-card/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
            AO
          </div>
          <div>
            <p className="text-xs font-bold text-white">Hackathon Engine</p>
            <p className="text-[10px] text-emerald-400 font-mono">● Engine Operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
