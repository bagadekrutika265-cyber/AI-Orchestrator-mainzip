"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationEngine = void 0;
const dataStore_js_1 = require("../db/dataStore.js");
const aiService_js_1 = require("../ai/aiService.js");
const policy_js_1 = require("./policy.js");
const failureHandler_js_1 = require("./failureHandler.js");
const definitions_js_1 = require("../workflows/definitions.js");
class OrchestrationEngine {
    static async createWorkflowFromRequest(requestText, requesterId = 'usr-2') {
        const user = dataStore_js_1.db.users.find(u => u.id === requesterId) || dataStore_js_1.db.users[1];
        // Step 1: Request Understanding
        const understanding = await aiService_js_1.AIService.processRequest(requestText);
        // Step 2: Route to template or generate dynamic plan
        const template = definitions_js_1.WORKFLOW_TEMPLATES.find(t => t.name.toLowerCase() === understanding.suggestedWorkflow.toLowerCase()) || definitions_js_1.WORKFLOW_TEMPLATES[0];
        const now = new Date();
        const slaHours = template.defaultSlaHours || 24;
        const slaDueDate = new Date(now.getTime() + slaHours * 3600 * 1000).toISOString();
        const workflowId = `wf-${Date.now().toString().slice(-6)}`;
        // Build Initial Tasks Graph
        const tasks = template.steps.map((step, idx) => ({
            id: `t-${idx + 1}`,
            name: step.name,
            description: step.description,
            status: idx === 0 ? 'COMPLETED' : 'PENDING',
            dataSource: step.dataSource,
            responsibleRole: step.responsibleRole,
            approvalRequired: step.approvalRequired,
            risk: idx === 0 ? 'LOW' : 'MEDIUM',
            confidence: Math.min(100, understanding.confidenceScore - idx * 2),
            timestamp: idx === 0 ? new Date().toISOString() : undefined,
            dependencies: idx > 0 ? [`t-${idx}`] : [],
            executionType: idx === 0 ? 'AI_AUTOMATED' : undefined
        }));
        // Step 3: Policy Check
        const policyResult = policy_js_1.BusinessPolicyEngine.evaluate(template.name, {
            requestText,
            amount: understanding.entities.targetAmount || understanding.entities.claimAmount || 240000,
            daysOverdue: 67,
            discountPercentage: understanding.entities.discountPercentage || 20,
            days: 3
        });
        const initialState = understanding.missingInformation.length > 0
            ? 'WAITING_FOR_INFORMATION'
            : policyResult.requiresApproval
                ? 'WAITING_FOR_APPROVAL'
                : 'EXECUTING';
        const newWorkflow = {
            id: workflowId,
            title: `${template.name} - ${requestText.slice(0, 40)}...`,
            workflowType: template.name,
            requestText: requestText,
            requesterId: user.id,
            requesterName: user.name,
            department: user.department,
            state: initialState,
            priority: understanding.priority,
            priorityReason: understanding.priorityReason,
            confidenceScore: understanding.confidenceScore,
            confidenceReason: understanding.confidenceReason,
            missingInformation: understanding.missingInformation,
            tasks: tasks,
            currentStepIndex: 1,
            dataSourcesUsed: template.dataSources,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            slaHours: slaHours,
            slaDueDate: slaDueDate,
            slaStatus: 'ON_TRACK',
            healthScore: 95,
            replannedCount: 0,
            approvalDetails: {
                required: policyResult.requiresApproval,
                approverRole: policyResult.approvalRole || 'Manager',
                status: policyResult.requiresApproval ? 'PENDING' : 'APPROVED',
                reason: policyResult.reason
            }
        };
        // Save to DB
        dataStore_js_1.db.workflows.unshift(newWorkflow);
        // Initial Audit Entry
        const auditEntry = {
            id: `log-${Date.now()}`,
            workflowId: newWorkflow.id,
            timestamp: now.toISOString(),
            actorType: 'AI AUTOMATED',
            actorName: 'AI Request Engine',
            action: 'Created & Planned Workflow',
            decision: `Mapped to ${template.name}`,
            reason: understanding.confidenceReason,
            policyUsed: policyResult.policyUsed ? policyResult.policyUsed.name : undefined,
            result: `State set to ${initialState}`
        };
        dataStore_js_1.db.auditLogs.unshift(auditEntry);
        return newWorkflow;
    }
    static approveWorkflow(workflowId, approverName = 'Sarah Jenkins (Manager)', comments = 'Approved following policy check') {
        const wf = dataStore_js_1.db.workflows.find(w => w.id === workflowId);
        if (!wf)
            throw new Error('Workflow not found');
        wf.state = 'EXECUTING';
        wf.updatedAt = new Date().toISOString();
        if (wf.approvalDetails) {
            wf.approvalDetails.status = 'APPROVED';
            wf.approvalDetails.approverName = approverName;
            wf.approvalDetails.approvedAt = new Date().toISOString();
            wf.approvalDetails.comments = comments;
        }
        // Update current task status
        if (wf.tasks[wf.currentStepIndex]) {
            wf.tasks[wf.currentStepIndex].status = 'COMPLETED';
            wf.tasks[wf.currentStepIndex].executionType = 'HUMAN_APPROVED';
            wf.currentStepIndex += 1;
        }
        // Add Audit Log
        dataStore_js_1.db.auditLogs.unshift({
            id: `log-app-${Date.now()}`,
            workflowId: wf.id,
            timestamp: new Date().toISOString(),
            actorType: 'HUMAN APPROVED',
            actorName: approverName,
            action: 'Human-In-The-Loop Approval Granted',
            decision: 'Approved Execution',
            reason: comments,
            result: 'Workflow state resumed to EXECUTING'
        });
        return wf;
    }
    static rejectWorkflow(workflowId, approverName = 'Sarah Jenkins (Manager)', reason = 'Rejected due to budget constraints') {
        const wf = dataStore_js_1.db.workflows.find(w => w.id === workflowId);
        if (!wf)
            throw new Error('Workflow not found');
        wf.state = 'CLOSED';
        wf.updatedAt = new Date().toISOString();
        if (wf.approvalDetails) {
            wf.approvalDetails.status = 'REJECTED';
            wf.approvalDetails.approverName = approverName;
            wf.approvalDetails.approvedAt = new Date().toISOString();
            wf.approvalDetails.comments = reason;
        }
        dataStore_js_1.db.auditLogs.unshift({
            id: `log-rej-${Date.now()}`,
            workflowId: wf.id,
            timestamp: new Date().toISOString(),
            actorType: 'HUMAN APPROVED',
            actorName: approverName,
            action: 'Human-In-The-Loop Approval Rejected',
            decision: 'Rejected Request',
            reason: reason,
            result: 'Workflow state set to CLOSED'
        });
        return wf;
    }
    static injectFailureEvent(workflowId, eventType) {
        const wf = dataStore_js_1.db.workflows.find(w => w.id === workflowId);
        if (!wf)
            throw new Error('Workflow not found');
        const result = failureHandler_js_1.FailureHandlerEngine.handleEvent(wf, eventType);
        dataStore_js_1.db.auditLogs.unshift(result.auditEntry);
        wf.updatedAt = new Date().toISOString();
        return wf;
    }
}
exports.OrchestrationEngine = OrchestrationEngine;
