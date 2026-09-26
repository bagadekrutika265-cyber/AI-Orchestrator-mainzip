export interface WhatIfPrediction {
  question: string;
  scenarioName: string;
  predictedSteps: Array<{ day: string; action: string; actor: string; risk: string }>;
  potentialOutcome: string;
  humanInterventionRequired: boolean;
  estimatedDelayHours: number;
}

export interface DigitalTwinResult {
  workflowName: string;
  predictedStepsCount: number;
  expectedApprovalsCount: number;
  potentialFailuresCount: number;
  potentialBottlenecks: Array<{ stepName: string; reason: string; avgDelayHours: number }>;
  estimatedResolutionDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  healthForecastScore: number;
}

export class SimulatorEngine {
  public static runWhatIf(question: string): WhatIfPrediction {
    const qLower = question.toLowerCase();

    if (qLower.includes('doesn\'t respond') || qLower.includes('no response') || qLower.includes('not respond')) {
      return {
        question,
        scenarioName: 'Customer Communication Timeout (7 Days)',
        predictedSteps: [
          { day: 'Day 0', action: 'Initial Payment Demand Notice sent via Email', actor: 'AI Orchestrator', risk: 'LOW' },
          { day: 'Day 3', action: 'Automated Follow-up & SMS Reminder dispatched', actor: 'System', risk: 'MEDIUM' },
          { day: 'Day 7', action: 'Communication SLA Timeout triggered. Workflow State -> ESCALATED', actor: 'AI Engine', risk: 'HIGH' },
          { day: 'Day 8', action: 'Manual Escalation to Senior Legal & Accounts Lead', actor: 'Legal Manager', risk: 'HIGH' }
        ],
        potentialOutcome: 'Manual intervention required. Account escalated to legal recovery.',
        humanInterventionRequired: true,
        estimatedDelayHours: 192
      };
    } else if (qLower.includes('reject') || qLower.includes('manager rejects')) {
      return {
        question,
        scenarioName: 'Manager Approval Rejection',
        predictedSteps: [
          { day: 'Day 0', action: 'Request submitted for Manager signoff', actor: 'Employee', risk: 'LOW' },
          { day: 'Day 1', action: 'Manager rejects request citing policy limit or budget gap', actor: 'Manager', risk: 'HIGH' },
          { day: 'Day 1', action: 'AI Replanner recalculates request parameters to compliant tier', actor: 'AI Replanner', risk: 'MEDIUM' },
          { day: 'Day 2', action: 'Resubmitted for secondary signoff or closed with notification', actor: 'System', risk: 'LOW' }
        ],
        potentialOutcome: 'Workflow re-plans to adjusted budget tier or escalates to HR.',
        humanInterventionRequired: true,
        estimatedDelayHours: 24
      };
    } else if (qLower.includes('equipment') || qLower.includes('unavailable') || qLower.includes('laptop')) {
      return {
        question,
        scenarioName: 'Asset Inventory Depletion',
        predictedSteps: [
          { day: 'Day 0', action: 'IT inventory lookup returns 0 matching laptops in stock', actor: 'System', risk: 'MEDIUM' },
          { day: 'Day 0', action: 'AI Orchestrator triggers dynamic Procurement Sub-workflow', actor: 'AI Orchestrator', risk: 'HIGH' },
          { day: 'Day 2', action: 'Purchase Order created and dispatched to approved vendor', actor: 'Procurement Lead', risk: 'MEDIUM' },
          { day: 'Day 4', action: 'Device delivered, imaged, and assigned to employee', actor: 'IT Support', risk: 'LOW' }
        ],
        potentialOutcome: 'Workflow smoothly switches from internal allocation to expedited procurement.',
        humanInterventionRequired: true,
        estimatedDelayHours: 96
      };
    }

    return {
      question,
      scenarioName: 'Standard Dynamic Re-planning Simulation',
      predictedSteps: [
        { day: 'Day 0', action: 'AI Request Understanding & Policy Evaluation', actor: 'AI Engine', risk: 'LOW' },
        { day: 'Day 1', action: 'Execution & Monitoring phase', actor: 'System', risk: 'LOW' },
        { day: 'Day 2', action: 'Final Verification & Audit Log Resolution', actor: 'AI Engine', risk: 'LOW' }
      ],
      potentialOutcome: 'High likelihood of automated resolution within SLA target.',
      humanInterventionRequired: false,
      estimatedDelayHours: 12
    };
  }

  public static runDigitalTwin(workflowName: string): DigitalTwinResult {
    switch (workflowName) {
      case 'Invoice & Payment Recovery':
        return {
          workflowName,
          predictedStepsCount: 12,
          expectedApprovalsCount: 2,
          potentialFailuresCount: 1,
          potentialBottlenecks: [
            { stepName: 'Finance Manager Signoff', reason: 'High-value approval queue backlogs during end-of-month', avgDelayHours: 18 }
          ],
          estimatedResolutionDays: 2.4,
          riskLevel: 'MEDIUM',
          healthForecastScore: 92
        };

      case 'Employee Onboarding':
        return {
          workflowName,
          predictedStepsCount: 15,
          expectedApprovalsCount: 3,
          potentialFailuresCount: 1,
          potentialBottlenecks: [
            { stepName: 'System Access Provisioning', reason: 'Security admin manual review required for production db access', avgDelayHours: 24 }
          ],
          estimatedResolutionDays: 3.5,
          riskLevel: 'HIGH',
          healthForecastScore: 85
        };

      default:
        return {
          workflowName,
          predictedStepsCount: 8,
          expectedApprovalsCount: 1,
          potentialFailuresCount: 0,
          potentialBottlenecks: [
            { stepName: 'Manager Signoff', reason: 'Standard review latency', avgDelayHours: 6 }
          ],
          estimatedResolutionDays: 1.2,
          riskLevel: 'LOW',
          healthForecastScore: 96
        };
    }
  }
}
