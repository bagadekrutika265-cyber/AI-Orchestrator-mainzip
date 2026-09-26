import { db } from '../db/dataStore.js';
import { AIService } from '../ai/aiService.js';
import { BusinessPolicyEngine } from './policy.js';
import { FailureHandlerEngine } from './failureHandler.js';
import { WorkflowInstance, WorkflowTask, AuditLogEntry, WorkflowState } from '../types.js';
import { WORKFLOW_TEMPLATES } from '../workflows/definitions.js';

export class OrchestrationEngine {
  public static async createWorkflowFromRequest(requestText: string, requesterId: string = 'usr-2'): Promise<WorkflowInstance> {
    const user = db.users.find(u => u.id === requesterId) || db.users[1];
    
    // Step 1: Request Understanding
    const understanding = await AIService.processRequest(requestText);
    
    // Step 2: Route to template or generate dynamic plan
    const template = WORKFLOW_TEMPLATES.find(t => t.name.toLowerCase() === understanding.suggestedWorkflow.toLowerCase()) || WORKFLOW_TEMPLATES[0];

    const now = new Date();
    const slaHours = template.defaultSlaHours || 24;
    const slaDueDate = new Date(now.getTime() + slaHours * 3600 * 1000).toISOString();

    const workflowId = `wf-${Date.now().toString().slice(-6)}`;
    
    // Build Initial Tasks Graph
    const tasks: WorkflowTask[] = template.steps.map((step, idx) => ({
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
    const policyResult = BusinessPolicyEngine.evaluate(template.name, {
      requestText,
      amount: understanding.entities.targetAmount || understanding.entities.claimAmount || 240000,
      daysOverdue: 67,
      discountPercentage: understanding.entities.discountPercentage || 20,
      days: 3
    });

    const initialState: WorkflowState = understanding.missingInformation.length > 0 
      ? 'WAITING_FOR_INFORMATION' 
      : policyResult.requiresApproval 
      ? 'WAITING_FOR_APPROVAL' 
      : 'EXECUTING';

    const newWorkflow: WorkflowInstance = {
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
    db.workflows.unshift(newWorkflow);

    // Initial Audit Entry
    const auditEntry: AuditLogEntry = {
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
    db.auditLogs.unshift(auditEntry);

    return newWorkflow;
  }

  public static approveWorkflow(workflowId: string, approverName: string = 'Sarah Jenkins (Manager)', comments: string = 'Approved following policy check'): WorkflowInstance {
    const wf = db.workflows.find(w => w.id === workflowId);
    if (!wf) throw new Error('Workflow not found');

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
    db.auditLogs.unshift({
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

  public static rejectWorkflow(workflowId: string, approverName: string = 'Sarah Jenkins (Manager)', reason: string = 'Rejected due to budget constraints'): WorkflowInstance {
    const wf = db.workflows.find(w => w.id === workflowId);
    if (!wf) throw new Error('Workflow not found');

    wf.state = 'CLOSED';
    wf.updatedAt = new Date().toISOString();
    if (wf.approvalDetails) {
      wf.approvalDetails.status = 'REJECTED';
      wf.approvalDetails.approverName = approverName;
      wf.approvalDetails.approvedAt = new Date().toISOString();
      wf.approvalDetails.comments = reason;
    }

    db.auditLogs.unshift({
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

  public static injectFailureEvent(workflowId: string, eventType: string): WorkflowInstance {
    const wf = db.workflows.find(w => w.id === workflowId);
    if (!wf) throw new Error('Workflow not found');

    const result = FailureHandlerEngine.handleEvent(wf, eventType);
    db.auditLogs.unshift(result.auditEntry);
    wf.updatedAt = new Date().toISOString();

    return wf;
  }
}
