import React, { useEffect, useState } from 'react';
import { User, UserRole, WorkflowInstance, AuditLogEntry, WorkflowTemplate } from './types';
import { ApiClient } from './api/apiClient';
import { Navbar } from './components/Navbar';
import { Sidebar, ViewId } from './components/Sidebar';
import { JudgeDemoModeModal } from './components/JudgeDemoModeModal';
import { LanguageSelector } from './components/LanguageSelector';
import { useI18n } from './i18n';

import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { ForgotPasswordPage } from './views/ForgotPasswordPage';
import { ResetPasswordPage } from './views/ResetPasswordPage';
import { CommandCenter } from './views/CommandCenter';
import { DashboardView } from './views/DashboardView';
import { InboxView } from './views/InboxView';
import { ExecutionView } from './views/ExecutionView';
import { ApprovalCenterView } from './views/ApprovalCenterView';
import { TemplatesView } from './views/TemplatesView';
import { CustomWorkflowView } from './views/CustomWorkflowView';
import { DataSourcesView } from './views/DataSourcesView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuditTrailView } from './views/AuditTrailView';
import { WhatIfView } from './views/WhatIfView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { FailureSimulatorPanel } from './components/FailureSimulatorPanel';
import { SettingsView } from './views/SettingsView';

const isPublicPath = (path: string) => ['/', '/login', '/forgot-password', '/reset-password'].includes(path);

export const App: React.FC = () => {
  const { language } = useI18n();
  const [path, setPath] = useState(window.location.pathname);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [currentView, setCurrentView] = useState<ViewId>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('EMPLOYEE');
  const [aiMode, setAiMode] = useState<string>('DEMO_MODE');
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);

  const navigate = (nextPath: string) => {
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  };

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    ApiClient.getCurrentUser()
      .then((user) => {
        if (user) {
          setAuthUser(user);
          setCurrentRole(user.role);
        } else if (!isPublicPath(window.location.pathname)) {
          navigate('/');
        }
      })
      .finally(() => setAuthLoading(false));
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (authUser) ApiClient.updateLanguage(language).catch(() => undefined);
  }, [language, authUser]);

  const loadData = async () => {
    if (!authUser) return;
    try {
      const health = await ApiClient.getHealth();
      setAiMode(health.mode || 'DEMO_MODE');
      const [wfs, tmpls, logs] = await Promise.all([ApiClient.getWorkflows(), ApiClient.getTemplates(), ApiClient.getAuditLogs()]);
      setWorkflows(wfs || []);
      if (wfs?.length && !selectedWorkflowId) setSelectedWorkflowId(wfs[0].id);
      setTemplates(tmpls || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    if (authUser) loadData();
  }, [authUser]);

  const goToView = (view: ViewId) => {
    setCurrentView(view);
    navigate(view === 'landing' ? '/dashboard' : `/${view}`);
  };

  const handleLogin = async (username: string, password: string, role: UserRole, rememberMe: boolean) => {
    try {
      const result = await ApiClient.login(username, password, role, rememberMe);
      setAuthUser(result.user);
      setCurrentRole(result.user.role);
      setAuthError('');
      setCurrentView('dashboard');
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in.');
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    const result = await ApiClient.googleDemoLogin();
    if (result.user) {
      setAuthUser(result.user);
      setCurrentRole(result.user.role);
      setAuthError('');
      setCurrentView('dashboard');
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await ApiClient.logout();
    setAuthUser(null);
    setWorkflows([]);
    setSelectedWorkflowId(null);
    setCurrentView('landing');
    navigate('/');
  };

  const handleStartWorkflow = async (requestText: string) => {
    try {
      const res = await ApiClient.submitRequest(requestText, authUser?.id, language);
      if (res.success && res.workflow) {
        setWorkflows((prev) => [res.workflow, ...prev]);
        setSelectedWorkflowId(res.workflow.id);
        goToView('execution');
      }
    } catch (err) {
      console.error('Error starting workflow:', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await ApiClient.approveWorkflow(id, authUser?.name);
      if (res.success && res.workflow) setWorkflows((prev) => prev.map((w) => w.id === id ? res.workflow : w));
    } catch (err) {
      console.error('Error approving workflow:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await ApiClient.rejectWorkflow(id, authUser?.name);
      if (res.success && res.workflow) setWorkflows((prev) => prev.map((w) => w.id === id ? res.workflow : w));
    } catch (err) {
      console.error('Error rejecting workflow:', err);
    }
  };

  const handleSimulateEvent = async (eventType: string) => {
    try {
      const targetId = selectedWorkflowId || workflows[0]?.id;
      const res = await ApiClient.simulateEvent(targetId, eventType);
      if (res.success && res.workflow) {
        setWorkflows((prev) => prev.map((w) => w.id === res.workflow.id ? res.workflow : w));
        setAuditLogs(await ApiClient.getAuditLogs());
      }
    } catch (err) {
      console.error('Error simulating event:', err);
    }
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-dark-base text-sm text-gray-400">Loading AI ORCHESTRATOR...</div>;
  }

  if (path === '/login') {
    return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onForgotPassword={() => { setAuthError(''); navigate('/forgot-password'); }} onBackHome={() => { setAuthError(''); navigate('/'); }} error={authError} />;
  }

  if (path === '/forgot-password') {
    return <ForgotPasswordPage onSubmit={ApiClient.forgotPassword} onBack={() => { setAuthError(''); navigate('/login'); }} error={authError} />;
  }

  if (path === '/reset-password') {
    return <ResetPasswordPage onSubmit={async (token, password, confirmPassword) => { await ApiClient.resetPassword(token, password, confirmPassword); }} onBack={() => { setAuthError(''); navigate('/login'); }} error={authError} />;
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-dark-base text-gray-100">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/20">✦</div>
            <div><p className="font-extrabold tracking-tight text-white">AI ORCHESTRATOR</p><p className="text-[10px] uppercase tracking-wider text-gray-500">Intelligent workflow automation</p></div>
          </div>
          <div className="flex items-center gap-3"><LanguageSelector /><button onClick={() => navigate('/login')} className="rounded-xl border border-brand-400/50 bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-100 hover:bg-brand-500/20">LOGIN</button></div>
        </header>
        <main className="mx-auto max-w-7xl px-6">
          <LandingPage onStartWorkflow={() => navigate('/login')} onLogin={() => navigate('/login')} onRunDemo={() => navigate('/login')} onExploreWorkflows={() => navigate('/login')} />
        </main>
      </div>
    );
  }

  const activeWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
  const pendingApprovalsCount = workflows.filter((w) => w.state === 'WAITING_FOR_APPROVAL').length;

  return (
    <div className="flex min-h-screen flex-col bg-dark-base font-sans text-gray-100 selection:bg-brand-500 selection:text-white">
      <Navbar
        currentRole={currentRole}
        onRoleChange={() => undefined}
        aiMode={aiMode}
        onStartJudgeDemo={() => setIsJudgeDemoOpen(true)}
        onOpenNotifications={() => goToView('approvals')}
        unreadCount={pendingApprovalsCount}
        onLogout={handleLogout}
        userName={authUser.name}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onSelectView={goToView} pendingApprovalsCount={pendingApprovalsCount} />
        <main className="h-[calc(100vh-61px)] flex-1 overflow-y-auto p-6">
          {currentView === 'landing' && <LandingPage onStartWorkflow={() => goToView('command-center')} onLogin={() => goToView('command-center')} onRunDemo={() => setIsJudgeDemoOpen(true)} onExploreWorkflows={() => goToView('templates')} />}
          {currentView === 'command-center' && <CommandCenter onSubmitRequest={handleStartWorkflow} onUnderstandText={(text) => ApiClient.understandRequest(text, language)} />}
          {currentView === 'dashboard' && <DashboardView workflows={workflows} onSelectWorkflow={(id) => { setSelectedWorkflowId(id); goToView('execution'); }} onNavigateToApprovals={() => goToView('approvals')} onNavigateToInbox={() => goToView('inbox')} />}
          {currentView === 'inbox' && <InboxView workflows={workflows} onSelectWorkflow={(id) => { setSelectedWorkflowId(id); goToView('execution'); }} />}
          {currentView === 'execution' && activeWorkflow && <ExecutionView workflow={activeWorkflow} onApprove={handleApprove} onReject={handleReject} onInjectEvent={handleSimulateEvent} />}
          {currentView === 'approvals' && <ApprovalCenterView workflows={workflows} onApprove={handleApprove} onReject={handleReject} />}
          {currentView === 'templates' && <TemplatesView templates={templates} onSelectTemplate={handleStartWorkflow} />}
          {currentView === 'custom-generator' && <CustomWorkflowView onRunCustom={handleStartWorkflow} />}
          {currentView === 'datasources' && <DataSourcesView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'audit' && <AuditTrailView logs={auditLogs} />}
          {currentView === 'what-if' && <WhatIfView onRunWhatIf={(q) => ApiClient.runWhatIf(q, language)} />}
          {currentView === 'digital-twin' && <DigitalTwinView onRunDigitalTwin={(name) => ApiClient.runDigitalTwin(name)} onRunActualWorkflow={handleStartWorkflow} />}
          {currentView === 'failure-simulator' && <div className="mx-auto max-w-4xl space-y-6"><FailureSimulatorPanel onInjectEvent={handleSimulateEvent} activeWorkflowId={selectedWorkflowId || undefined} />{activeWorkflow && <ExecutionView workflow={activeWorkflow} onApprove={handleApprove} onReject={handleReject} onInjectEvent={handleSimulateEvent} />}</div>}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
      <JudgeDemoModeModal isOpen={isJudgeDemoOpen} onClose={() => setIsJudgeDemoOpen(false)} onRunWorkflow={(prompt) => { handleStartWorkflow(prompt); setCurrentView('execution'); }} onSimulateEvent={handleSimulateEvent} onApproveCurrent={() => { if (activeWorkflow) handleApprove(activeWorkflow.id); }} />
    </div>
  );
};