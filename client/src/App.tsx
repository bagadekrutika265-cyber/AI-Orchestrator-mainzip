import React, { useState, useEffect } from 'react';
import { UserRole, WorkflowInstance, AuditLogEntry, WorkflowTemplate } from './types';
import { ApiClient } from './api/apiClient';
import { Navbar } from './components/Navbar';
import { Sidebar, ViewId } from './components/Sidebar';
import { JudgeDemoModeModal } from './components/JudgeDemoModeModal';

// Views
import { LandingPage } from './views/LandingPage';
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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewId>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [aiMode, setAiMode] = useState<string>('DEMO_MODE');
  
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);

  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);

  // Load initial data from backend API
  const loadData = async () => {
    try {
      const health = await ApiClient.getHealth();
      setAiMode(health.mode || 'DEMO_MODE');

      const wfs = await ApiClient.getWorkflows();
      setWorkflows(wfs || []);
      if (wfs && wfs.length > 0 && !selectedWorkflowId) {
        setSelectedWorkflowId(wfs[0].id);
      }

      const tmpls = await ApiClient.getTemplates();
      setTemplates(tmpls || []);

      const logs = await ApiClient.getAuditLogs();
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartWorkflow = async (requestText: string) => {
    try {
      const res = await ApiClient.submitRequest(requestText);
      if (res.success && res.workflow) {
        setWorkflows(prev => [res.workflow, ...prev]);
        setSelectedWorkflowId(res.workflow.id);
        setCurrentView('execution');
      }
    } catch (err) {
      console.error('Error starting workflow:', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await ApiClient.approveWorkflow(id, `${currentRole} User`);
      if (res.success && res.workflow) {
        setWorkflows(prev => prev.map(w => w.id === id ? res.workflow : w));
      }
    } catch (err) {
      console.error('Error approving workflow:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await ApiClient.rejectWorkflow(id, `${currentRole} User`);
      if (res.success && res.workflow) {
        setWorkflows(prev => prev.map(w => w.id === id ? res.workflow : w));
      }
    } catch (err) {
      console.error('Error rejecting workflow:', err);
    }
  };

  const handleSimulateEvent = async (eventType: string) => {
    try {
      const targetId = selectedWorkflowId || (workflows[0] ? workflows[0].id : undefined);
      const res = await ApiClient.simulateEvent(targetId, eventType);
      if (res.success && res.workflow) {
        setWorkflows(prev => prev.map(w => w.id === res.workflow.id ? res.workflow : w));
        const updatedLogs = await ApiClient.getAuditLogs();
        setAuditLogs(updatedLogs);
      }
    } catch (err) {
      console.error('Error simulating event:', err);
    }
  };

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];
  const pendingApprovalsCount = workflows.filter(w => w.state === 'WAITING_FOR_APPROVAL').length;

  return (
    <div className="min-h-screen bg-dark-base text-gray-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(r) => setCurrentRole(r)}
        aiMode={aiMode}
        onStartJudgeDemo={() => setIsJudgeDemoOpen(true)}
        onOpenNotifications={() => setCurrentView('approvals')}
        unreadCount={pendingApprovalsCount}
      />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-61px)]">
          {currentView === 'landing' && (
            <LandingPage
              onStartWorkflow={() => setCurrentView('command-center')}
              onRunDemo={() => setIsJudgeDemoOpen(true)}
              onExploreWorkflows={() => setCurrentView('templates')}
            />
          )}

          {currentView === 'command-center' && (
            <CommandCenter
              onSubmitRequest={handleStartWorkflow}
              onUnderstandText={(txt) => ApiClient.understandRequest(txt)}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              workflows={workflows}
              onSelectWorkflow={(id) => {
                setSelectedWorkflowId(id);
                setCurrentView('execution');
              }}
              onNavigateToApprovals={() => setCurrentView('approvals')}
              onNavigateToInbox={() => setCurrentView('inbox')}
            />
          )}

          {currentView === 'inbox' && (
            <InboxView
              workflows={workflows}
              onSelectWorkflow={(id) => {
                setSelectedWorkflowId(id);
                setCurrentView('execution');
              }}
            />
          )}

          {currentView === 'execution' && activeWorkflow && (
            <ExecutionView
              workflow={activeWorkflow}
              onApprove={handleApprove}
              onReject={handleReject}
              onInjectEvent={handleSimulateEvent}
            />
          )}

          {currentView === 'approvals' && (
            <ApprovalCenterView
              workflows={workflows}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {currentView === 'templates' && (
            <TemplatesView
              templates={templates}
              onSelectTemplate={handleStartWorkflow}
            />
          )}

          {currentView === 'custom-generator' && (
            <CustomWorkflowView
              onRunCustom={handleStartWorkflow}
            />
          )}

          {currentView === 'datasources' && <DataSourcesView />}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'audit' && <AuditTrailView logs={auditLogs} />}

          {currentView === 'what-if' && (
            <WhatIfView
              onRunWhatIf={(q) => ApiClient.runWhatIf(q)}
            />
          )}

          {currentView === 'digital-twin' && (
            <DigitalTwinView
              onRunDigitalTwin={(name) => ApiClient.runDigitalTwin(name)}
              onRunActualWorkflow={handleStartWorkflow}
            />
          )}

          {currentView === 'failure-simulator' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <FailureSimulatorPanel
                onInjectEvent={handleSimulateEvent}
                activeWorkflowId={selectedWorkflowId || undefined}
              />
              {activeWorkflow && (
                <ExecutionView
                  workflow={activeWorkflow}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onInjectEvent={handleSimulateEvent}
                />
              )}
            </div>
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Judge Demo Modal */}
      <JudgeDemoModeModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onRunWorkflow={(prompt) => {
          handleStartWorkflow(prompt);
          setCurrentView('execution');
        }}
        onSimulateEvent={(evt) => handleSimulateEvent(evt)}
        onApproveCurrent={() => {
          if (activeWorkflow) handleApprove(activeWorkflow.id);
        }}
      />
    </div>
  );
};
