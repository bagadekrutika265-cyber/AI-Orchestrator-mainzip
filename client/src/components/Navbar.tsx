import React from 'react';
import { UserRole } from '../types';
import { Cpu, Play, Shield, Bell, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  aiMode: string;
  onStartJudgeDemo: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  aiMode,
  onStartJudgeDemo,
  onOpenNotifications,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-dark-surface/90 backdrop-blur-md border-b border-dark-border px-6 py-3 flex items-center justify-between shadow-xl">
      {/* Brand Logo & Taglines */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
          <Cpu className="w-6 h-6 text-white animate-pulse-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">AI ORCHESTRATOR</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
              Enterprise v1.0
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium hidden md:block">
            From Business Request to Intelligent Action &bull; <span className="text-gray-500">Understand. Plan. Execute. Adapt.</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Judge Demo Button */}
        <button
          onClick={onStartJudgeDemo}
          className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200"
        >
          <Play className="w-4 h-4 fill-current group-hover:animate-bounce" />
          <span>START JUDGE DEMO</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
          </span>
        </button>

        {/* AI Mode Indicator */}
        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 shadow-sm ${
          aiMode === 'LIVE_AI_MODE' 
            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40' 
            : 'bg-amber-950/40 text-amber-400 border-amber-500/40'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiMode === 'LIVE_AI_MODE' ? 'LIVE AI MODE' : 'DEMO MODE'}</span>
        </div>

        {/* Role Switcher Selector */}
        <div className="relative flex items-center bg-dark-card border border-dark-border rounded-lg p-1 text-xs font-medium">
          <UserCheck className="w-3.5 h-3.5 ml-2 text-gray-400" />
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-gray-200 px-2 py-1 focus:outline-none cursor-pointer font-semibold"
          >
            <option value="ADMIN" className="bg-dark-card text-white">Role: ADMIN</option>
            <option value="MANAGER" className="bg-dark-card text-white">Role: MANAGER</option>
            <option value="EMPLOYEE" className="bg-dark-card text-white">Role: EMPLOYEE</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:bg-dark-hover transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
