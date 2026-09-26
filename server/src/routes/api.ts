import { Router, Request, Response } from 'express';
import { db } from '../db/dataStore.js';
import { OrchestrationEngine } from '../engine/orchestrator.js';
import { AIService } from '../ai/aiService.js';
import { SimulatorEngine } from '../engine/simulators.js';
import { WORKFLOW_TEMPLATES } from '../workflows/definitions.js';
import {
  clearSession,
  consumeResetToken,
  createResetToken,
  createSession,
  getSessionUserId,
  hashPassword,
  isSupportedRole,
  requireAuth,
  roleCanApprove,
  safeUser,
  verifyPassword,
} from '../auth.js';
import { LanguageCode, supportedLanguages } from '../localization.js';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    system: 'AI ORCHESTRATOR Engine v1.0',
    mode: AIService.getMode(),
    activeWorkflows: db.workflows.length,
    usersSeeded: db.users.length,
    timestamp: new Date().toISOString()
  });
});

// Public authentication endpoints
router.get('/auth/me', (req: Request, res: Response) => {
  const userId = getSessionUserId(req);
  const user = userId ? db.users.find((candidate) => candidate.id === userId) : undefined;
  if (!user) {
    res.json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true, user: safeUser(user) });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { username, password, role, rememberMe } = req.body as {
    username?: string;
    password?: string;
    role?: string;
    rememberMe?: boolean;
  };
  const user = db.users.find((candidate) => candidate.email.toLowerCase() === String(username || '').trim().toLowerCase());
  if (!user || !user.passwordHash || !password || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid username or password.', code: 'INVALID_CREDENTIALS' });
    return;
  }
  if (!isSupportedRole(role || '') || user.role !== role) {
    res.status(403).json({ error: `Your account does not have ${String(role || 'selected')} access.`, code: 'ROLE_MISMATCH' });
    return;
  }
  createSession(res, user.id, Boolean(rememberMe));
  res.json({ success: true, user: safeUser(user) });
});

router.post('/auth/google-demo', (req: Request, res: Response) => {
  const user = db.users[2];
  createSession(res, user.id, true);
  res.json({ success: true, demo: true, user: safeUser(user) });
});

router.post('/auth/logout', (req: Request, res: Response) => {
  clearSession(req, res);
  res.json({ success: true });
});

router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const user = db.users.find((candidate) => candidate.email.toLowerCase() === username);
  // Keep the response useful in demo mode without claiming an email was sent.
  if (!user) {
    res.status(404).json({ error: 'User not found. Try again.', code: 'USER_NOT_FOUND' });
    return;
  }
  const token = createResetToken(user.id);
  res.json({
    success: true,
    demo: true,
    message: 'Demo reset link generated.',
    resetToken: process.env.NODE_ENV === 'production' ? undefined : token,
  });
});

router.post('/auth/reset-password', (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body as {
    token?: string;
    password?: string;
    confirmPassword?: string;
  };
  if (!token || !password || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters.' });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }
  const userId = consumeResetToken(token);
  const user = userId ? db.users.find((candidate) => candidate.id === userId) : undefined;
  if (!user) {
    res.status(400).json({ error: 'This reset link is invalid or expired.' });
    return;
  }
  user.passwordHash = hashPassword(password);
  res.json({ success: true, message: 'Password updated. You can now sign in.' });
});

// Everything below this point requires an authenticated session.
router.use(requireAuth);

router.get('/auth/preferences', (req: Request, res: Response) => {
  const userId = getSessionUserId(req);
  const user = db.users.find((candidate) => candidate.id === userId);
  res.json({ language: user?.language || 'en' });
});

router.patch('/auth/preferences', (req: Request, res: Response) => {
  const language = req.body?.language as LanguageCode;
  const userId = getSessionUserId(req);
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user || !supportedLanguages.includes(language)) {
    res.status(400).json({ error: 'Unsupported language preference.' });
    return;
  }
  user.language = language;
  res.json({ success: true, language });
});

// Users / Roles
router.get('/users', (req: Request, res: Response) => {
  res.json(db.users.map(safeUser));
});

// Submit natural language request -> Creates & Starts Workflow
router.post('/requests', async (req: Request, res: Response) => {
  try {
    const { requestText, requesterId, language } = req.body;
    if (!requestText) {
      res.status(400).json({ error: 'requestText is required' });
      return;
    }
    const sessionUserId = getSessionUserId(req);
    const workflow = await OrchestrationEngine.createWorkflowFromRequest(requestText, requesterId || sessionUserId || undefined, language || 'en');
    res.status(201).json({ success: true, workflow });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Workflows
router.get('/workflows', (req: Request, res: Response) => {
  res.json(db.workflows);
});

router.get('/workflows/:id', (req: Request, res: Response) => {
  const wf = db.workflows.find(w => w.id === req.params.id);
  if (!wf) {
    res.status(404).json({ error: 'Workflow not found' });
    return;
  }
  res.json(wf);
});

// Workflow Actions: Approve
router.post('/workflows/:id/approve', (req: Request, res: Response) => {
  try {
    const sessionUserId = getSessionUserId(req);
    const actingUser = db.users.find((candidate) => candidate.id === sessionUserId);
    if (!actingUser || !roleCanApprove(actingUser.role)) {
      res.status(403).json({ error: 'Manager or Admin access is required to approve workflows.', code: 'ROLE_FORBIDDEN' });
      return;
    }
    const { approverName, comments } = req.body;
    const wf = OrchestrationEngine.approveWorkflow(req.params.id, actingUser.name || approverName, comments);
    res.json({ success: true, workflow: wf });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Workflow Actions: Reject
router.post('/workflows/:id/reject', (req: Request, res: Response) => {
  try {
    const sessionUserId = getSessionUserId(req);
    const actingUser = db.users.find((candidate) => candidate.id === sessionUserId);
    if (!actingUser || !roleCanApprove(actingUser.role)) {
      res.status(403).json({ error: 'Manager or Admin access is required to reject workflows.', code: 'ROLE_FORBIDDEN' });
      return;
    }
    const { approverName, reason } = req.body;
    const wf = OrchestrationEngine.rejectWorkflow(req.params.id, actingUser.name || approverName, reason);
    res.json({ success: true, workflow: wf });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Failure Simulation Panel Endpoint
router.post('/simulate/event', (req: Request, res: Response) => {
  try {
    const { workflowId, eventType } = req.body;
    const targetWfId = workflowId || (db.workflows[0] ? db.workflows[0].id : undefined);
    if (!targetWfId) {
      res.status(404).json({ error: 'No active workflow to simulate failure event on' });
      return;
    }
    const wf = OrchestrationEngine.injectFailureEvent(targetWfId, eventType || 'EMAIL_FAILURE');
    res.json({ success: true, workflow: wf, eventApplied: eventType });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Trail Logs
router.get('/audit', (req: Request, res: Response) => {
  const { workflowId } = req.query;
  if (workflowId) {
    res.json(db.auditLogs.filter(a => a.workflowId === workflowId));
  } else {
    res.json(db.auditLogs);
  }
});

// Templates
router.get('/templates', (req: Request, res: Response) => {
  res.json(WORKFLOW_TEMPLATES);
});

// Create Custom Workflow Template
router.post('/templates', (req: Request, res: Response) => {
  const { name, category, description, triggerExample, steps, defaultSlaHours } = req.body;
  const newTmpl = {
    id: `wf-tmpl-custom-${Date.now()}`,
    name,
    category: category || 'Custom Business',
    description: description || 'Custom user created workflow',
    triggerExample: triggerExample || 'Custom trigger',
    dataSources: ['Custom System API', 'Database'],
    policies: ['pol-custom: Standard Approval'],
    defaultSlaHours: defaultSlaHours || 24,
    approvalPolicy: 'Standard Manager Review',
    steps: steps || []
  };
  WORKFLOW_TEMPLATES.push(newTmpl);
  res.json({ success: true, template: newTmpl });
});

// AI NLP Understanding Test
router.post('/ai/understand', async (req: Request, res: Response) => {
  const { requestText, language } = req.body;
  const result = await AIService.processRequest(requestText || 'I need a new laptop', language || 'en');
  res.json(result);
});

// What-If Simulator Endpoint
router.post('/ai/what-if', (req: Request, res: Response) => {
  const { question, language } = req.body;
  const prediction = SimulatorEngine.runWhatIf(question || 'What if customer does not respond?');
  res.json({ ...prediction, language: language || 'en' });
});

// Digital Twin Pre-Execution Simulation Endpoint
router.post('/ai/digital-twin', (req: Request, res: Response) => {
  const { workflowName } = req.body;
  const twin = SimulatorEngine.runDigitalTwin(workflowName || 'Invoice & Payment Recovery');
  res.json(twin);
});

// Data Sources Overview Page Data
router.get('/datasources', (req: Request, res: Response) => {
  res.json([
    { name: 'Employee Database', type: 'JSON DB', records: db.employees.length, status: 'CONNECTED', lastSync: '1 min ago' },
    { name: 'Customer Database', type: 'CRM API', records: db.customers.length, status: 'CONNECTED', lastSync: '3 mins ago' },
    { name: 'Invoice Database', type: 'CSV / Financial Ledger', records: db.invoices.length, status: 'CONNECTED', lastSync: 'Live' },
    { name: 'Asset Inventory', type: 'IT Asset Store', records: db.assets.length, status: 'CONNECTED', lastSync: '5 mins ago' },
    { name: 'Vendor Database', type: 'Procurement File', records: db.vendors.length, status: 'CONNECTED', lastSync: '10 mins ago' },
    { name: 'Company Policy Engine', type: 'Rule Engine', records: db.policies.length, status: 'ACTIVE', lastSync: 'Real-time' },
    { name: 'Email Gateway API', type: 'SMTP Gateway', records: 142, status: 'HEALTHY', lastSync: 'Real-time' }
  ]);
});

// Analytics Dashboard Data
router.get('/analytics', (req: Request, res: Response) => {
  const total = db.workflows.length + 14; // add base stats for hackathon demo visualization
  res.json({
    metrics: {
      totalRequests: total,
      completedToday: 18,
      activeWorkflows: db.workflows.length,
      pendingApprovals: db.workflows.filter(w => w.state === 'WAITING_FOR_APPROVAL').length,
      slaComplianceRate: 94.2, // %
      avgResolutionTimeHours: 4.8,
      automationRate: 78.5, // %
      humanInterventionRate: 21.5,
      failureRecoveryRate: 92.0,
      overallHealthScore: 89
    },
    byCategory: [
      { name: 'Invoice Recovery', value: 35 },
      { name: 'Leave Requests', value: 20 },
      { name: 'Purchase Requests', value: 15 },
      { name: 'IT Equipment', value: 12 },
      { name: 'Sales Discount', value: 10 },
      { name: 'Other', value: 8 }
    ],
    byStatus: [
      { name: 'Completed', value: 68 },
      { name: 'Executing', value: 14 },
      { name: 'Waiting Approval', value: 10 },
      { name: 'Replanned / Escalated', value: 8 }
    ],
    resolutionTrend: [
      { day: 'Mon', hours: 5.2 },
      { day: 'Tue', hours: 4.8 },
      { day: 'Wed', hours: 4.1 },
      { day: 'Thu', hours: 3.9 },
      { day: 'Fri', hours: 3.5 }
    ]
  });
});

export default router;
