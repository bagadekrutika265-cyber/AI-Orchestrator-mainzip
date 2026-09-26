import { WorkflowInstance, WorkflowTask, AuditLogEntry } from '../types.js';

export interface ReplanResult {
  workflow: WorkflowInstance;
  auditEntry: AuditLogEntry;
  replanMessage: string;
}

export class FailureHandlerEngine {
  public static handleEvent(workflow: WorkflowInstance, eventType: string): ReplanResult {
    workflow.replannedCount += 1;
    const timestamp = new Date().toISOString();

    let replanMessage = '';
    let recoveryAction = '';

    switch (eventType) {
      case 'EMAIL_FAILURE': {
        replanMessage = 'Primary Email Gateway API failed (HTTP 503 Service Unavailable). Dynamic replanning engaged.';
        recoveryAction = 'Switched to Secondary SMS & WhatsApp Gateway for customer communication retry.';
        
        // Update current running/failed task
        const currentTask = workflow.tasks[workflow.currentStepIndex];
        if (currentTask) {
          currentTask.status = 'REPLANNED';
          currentTask.executionType = 'AI_REPLANNED';
        }

        // Insert new fallback task dynamically
        const fallbackTask: WorkflowTask = {
          id: `t-fallback-${Date.now()}`,
          name: 'Fallback Dispatch via Secondary SMS/WhatsApp Channel',
          description: 'Automated fallback outreach deployed following primary email API outage.',
          status: 'COMPLETED',
          dataSource: 'Secondary SMS Gateway',
          responsibleRole: 'AI Recovery Agent',
          approvalRequired: false,
          risk: 'MEDIUM',
          confidence: 94,
          timestamp: timestamp,
          dependencies: [currentTask ? currentTask.id : ''],
          executionType: 'AI_REPLANNED'
        };

        workflow.tasks.splice(workflow.currentStepIndex + 1, 0, fallbackTask);
        workflow.state = 'EXECUTING';
        workflow.lastReplanReason = replanMessage;
        break;
      }

      case 'EQUIPMENT_UNAVAILABLE': {
        replanMessage = 'Requested MacBook Pro M3 is out of stock in IT asset inventory. Dynamic replanning engaged.';
        recoveryAction = 'Created urgent Procurement Purchase Request sub-workflow for temporary lease unit.';
        
        const procurementTask: WorkflowTask = {
          id: `t-procur-${Date.now()}`,
          name: 'Generate Emergency Procurement Requisition',
          description: 'Initiated rapid hardware procurement sub-workflow for temporary workstation lease.',
          status: 'RUNNING',
          dataSource: 'Procurement API',
          responsibleRole: 'AI Replanner',
          approvalRequired: true,
          risk: 'HIGH',
          confidence: 88,
          timestamp: timestamp,
          dependencies: [],
          executionType: 'AI_REPLANNED'
        };

        workflow.tasks.splice(workflow.currentStepIndex, 0, procurementTask);
        workflow.state = 'WAITING_FOR_APPROVAL';
        workflow.lastReplanReason = replanMessage;
        break;
      }

      case 'PAYMENT_RECEIVED': {
        replanMessage = 'Incoming Bank Wire Payment ₹2,40,000 detected for Invoice INV-202601! Workflow dynamically updated.';
        recoveryAction = 'Cancelled pending overdue follow-up tasks, marked invoice PAID, and resolved workflow.';
        
        workflow.tasks.forEach(t => {
          if (t.status === 'PENDING' || t.status === 'WAITING' || t.status === 'RUNNING') {
            t.status = 'COMPLETED';
            t.executionType = 'SYSTEM_EXECUTED';
            t.output = 'Cancelled - Payment already verified in bank ledger.';
          }
        });

        workflow.state = 'RESOLVED';
        workflow.healthScore = 100;
        workflow.lastReplanReason = replanMessage;
        break;
      }

      case 'CUSTOMER_NO_RESPONSE': {
        replanMessage = 'Customer did not respond within 7-day SLA window. Dynamic escalation replan executed.';
        recoveryAction = 'Escalated invoice recovery ticket to Senior Account Executive & Legal Collections Team.';
        
        const legalTask: WorkflowTask = {
          id: `t-legal-${Date.now()}`,
          name: 'Escalate to Legal & Account Executive Team',
          description: 'High-risk overdue account escalated following 7-day communications timeout.',
          status: 'RUNNING',
          dataSource: 'Legal Escalation Gateway',
          responsibleRole: 'Legal Officer',
          approvalRequired: true,
          risk: 'HIGH',
          confidence: 90,
          timestamp: timestamp,
          dependencies: [],
          executionType: 'ESCALATED'
        };

        workflow.tasks.push(legalTask);
        workflow.state = 'ESCALATED';
        workflow.lastReplanReason = replanMessage;
        break;
      }

      case 'DOCUMENT_MISSING': {
        replanMessage = 'Required ISO 27001 compliance certificate missing from vendor application. Workflow paused.';
        recoveryAction = 'Dispatched automated upload request link to vendor representative.';
        
        workflow.state = 'WAITING_FOR_INFORMATION';
        workflow.missingInformation = ['ISO 27001 Security Certificate Document'];
        workflow.lastReplanReason = replanMessage;
        break;
      }

      case 'APPROVAL_REJECTED': {
        replanMessage = 'Manager rejected 20% discount request due to low margin threshold. Replanning alternative path.';
        recoveryAction = 'Adjusted discount proposal to maximum policy allowance (10%) and resubmitted.';
        
        workflow.state = 'REPLANNING';
        workflow.lastReplanReason = replanMessage;
        break;
      }

      default: {
        replanMessage = `Business event '${eventType}' injected into active workflow context.`;
        recoveryAction = 'Recalibrated execution plan and updated state machine.';
        workflow.state = 'EXECUTING';
        workflow.lastReplanReason = replanMessage;
        break;
      }
    }

    const auditEntry: AuditLogEntry = {
      id: `log-replan-${Date.now()}`,
      workflowId: workflow.id,
      timestamp: timestamp,
      actorType: 'AI RE-PLANNED',
      actorName: 'Dynamic Replanning Engine',
      action: `Event Injected: ${eventType}`,
      decision: replanMessage,
      reason: recoveryAction,
      recoveryAction: recoveryAction
    };

    return {
      workflow,
      auditEntry,
      replanMessage
    };
  }
}
