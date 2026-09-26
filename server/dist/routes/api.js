"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataStore_js_1 = require("../db/dataStore.js");
const orchestrator_js_1 = require("../engine/orchestrator.js");
const aiService_js_1 = require("../ai/aiService.js");
const simulators_js_1 = require("../engine/simulators.js");
const definitions_js_1 = require("../workflows/definitions.js");
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'HEALTHY',
        system: 'AI ORCHESTRATOR Engine v1.0',
        mode: aiService_js_1.AIService.getMode(),
        activeWorkflows: dataStore_js_1.db.workflows.length,
        usersSeeded: dataStore_js_1.db.users.length,
        timestamp: new Date().toISOString()
    });
});
// Users / Roles
router.get('/users', (req, res) => {
    res.json(dataStore_js_1.db.users);
});
// Submit natural language request -> Creates & Starts Workflow
router.post('/requests', async (req, res) => {
    try {
        const { requestText, requesterId } = req.body;
        if (!requestText) {
            res.status(400).json({ error: 'requestText is required' });
            return;
        }
        const workflow = await orchestrator_js_1.OrchestrationEngine.createWorkflowFromRequest(requestText, requesterId);
        res.status(201).json({ success: true, workflow });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get Workflows
router.get('/workflows', (req, res) => {
    res.json(dataStore_js_1.db.workflows);
});
router.get('/workflows/:id', (req, res) => {
    const wf = dataStore_js_1.db.workflows.find(w => w.id === req.params.id);
    if (!wf) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
    }
    res.json(wf);
});
// Workflow Actions: Approve
router.post('/workflows/:id/approve', (req, res) => {
    try {
        const { approverName, comments } = req.body;
        const wf = orchestrator_js_1.OrchestrationEngine.approveWorkflow(req.params.id, approverName, comments);
        res.json({ success: true, workflow: wf });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Workflow Actions: Reject
router.post('/workflows/:id/reject', (req, res) => {
    try {
        const { approverName, reason } = req.body;
        const wf = orchestrator_js_1.OrchestrationEngine.rejectWorkflow(req.params.id, approverName, reason);
        res.json({ success: true, workflow: wf });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Failure Simulation Panel Endpoint
router.post('/simulate/event', (req, res) => {
    try {
        const { workflowId, eventType } = req.body;
        const targetWfId = workflowId || (dataStore_js_1.db.workflows[0] ? dataStore_js_1.db.workflows[0].id : undefined);
        if (!targetWfId) {
            res.status(404).json({ error: 'No active workflow to simulate failure event on' });
            return;
        }
        const wf = orchestrator_js_1.OrchestrationEngine.injectFailureEvent(targetWfId, eventType || 'EMAIL_FAILURE');
        res.json({ success: true, workflow: wf, eventApplied: eventType });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Audit Trail Logs
router.get('/audit', (req, res) => {
    const { workflowId } = req.query;
    if (workflowId) {
        res.json(dataStore_js_1.db.auditLogs.filter(a => a.workflowId === workflowId));
    }
    else {
        res.json(dataStore_js_1.db.auditLogs);
    }
});
// Templates
router.get('/templates', (req, res) => {
    res.json(definitions_js_1.WORKFLOW_TEMPLATES);
});
// Create Custom Workflow Template
router.post('/templates', (req, res) => {
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
    definitions_js_1.WORKFLOW_TEMPLATES.push(newTmpl);
    res.json({ success: true, template: newTmpl });
});
// AI NLP Understanding Test
router.post('/ai/understand', async (req, res) => {
    const { requestText } = req.body;
    const result = await aiService_js_1.AIService.processRequest(requestText || 'I need a new laptop');
    res.json(result);
});
// What-If Simulator Endpoint
router.post('/ai/what-if', (req, res) => {
    const { question } = req.body;
    const prediction = simulators_js_1.SimulatorEngine.runWhatIf(question || 'What if customer does not respond?');
    res.json(prediction);
});
// Digital Twin Pre-Execution Simulation Endpoint
router.post('/ai/digital-twin', (req, res) => {
    const { workflowName } = req.body;
    const twin = simulators_js_1.SimulatorEngine.runDigitalTwin(workflowName || 'Invoice & Payment Recovery');
    res.json(twin);
});
// Data Sources Overview Page Data
router.get('/datasources', (req, res) => {
    res.json([
        { name: 'Employee Database', type: 'JSON DB', records: dataStore_js_1.db.employees.length, status: 'CONNECTED', lastSync: '1 min ago' },
        { name: 'Customer Database', type: 'CRM API', records: dataStore_js_1.db.customers.length, status: 'CONNECTED', lastSync: '3 mins ago' },
        { name: 'Invoice Database', type: 'CSV / Financial Ledger', records: dataStore_js_1.db.invoices.length, status: 'CONNECTED', lastSync: 'Live' },
        { name: 'Asset Inventory', type: 'IT Asset Store', records: dataStore_js_1.db.assets.length, status: 'CONNECTED', lastSync: '5 mins ago' },
        { name: 'Vendor Database', type: 'Procurement File', records: dataStore_js_1.db.vendors.length, status: 'CONNECTED', lastSync: '10 mins ago' },
        { name: 'Company Policy Engine', type: 'Rule Engine', records: dataStore_js_1.db.policies.length, status: 'ACTIVE', lastSync: 'Real-time' },
        { name: 'Email Gateway API', type: 'SMTP Gateway', records: 142, status: 'HEALTHY', lastSync: 'Real-time' }
    ]);
});
// Analytics Dashboard Data
router.get('/analytics', (req, res) => {
    const total = dataStore_js_1.db.workflows.length + 14; // add base stats for hackathon demo visualization
    res.json({
        metrics: {
            totalRequests: total,
            completedToday: 18,
            activeWorkflows: dataStore_js_1.db.workflows.length,
            pendingApprovals: dataStore_js_1.db.workflows.filter(w => w.state === 'WAITING_FOR_APPROVAL').length,
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
exports.default = router;
