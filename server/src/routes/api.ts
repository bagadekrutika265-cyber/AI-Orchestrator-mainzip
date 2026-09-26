import { Router, Request, Response } from 'express';
import { db } from '../db/dataStore.js';
import { OrchestrationEngine } from '../engine/orchestrator.js';
import { AIService } from '../ai/aiService.js';
import { SimulatorEngine } from '../engine/simulators.js';
import { WORKFLOW_TEMPLATES } from '../workflows/definitions.js';

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

// Users / Roles
router.get('/users', (req: Request, res: Response) => {
  res.json(db.users);
});

// Submit natural language request -> Creates & Starts Workflow
router.post('/requests', async (req: Request, res: Response) => {
  try {
    const { requestText, requesterId } = req.body;
    if (!requestText) {
      res.status(400).json({ error: 'requestText is required' });
      return;
    }
    const workflow = await OrchestrationEngine.createWorkflowFromRequest(requestText, requesterId);
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
    const { approverName, comments } = req.body;
    const wf = OrchestrationEngine.approveWorkflow(req.params.id, approverName, comments);
    res.json({ success: true, workflow: wf });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Workflow Actions: Reject
router.post('/workflows/:id/reject', (req: Request, res: Response) => {
  try {
    const { approverName, reason } = req.body;
    const wf = OrchestrationEngine.rejectWorkflow(req.params.id, approverName, reason);
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
  const { requestText } = req.body;
  const result = await AIService.processRequest(requestText || 'I need a new laptop');
  res.json(result);
});

// What-If Simulator Endpoint
router.post('/ai/what-if', (req: Request, res: Response) => {
  const { question } = req.body;
  const prediction = SimulatorEngine.runWhatIf(question || 'What if customer does not respond?');
  res.json(prediction);
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
