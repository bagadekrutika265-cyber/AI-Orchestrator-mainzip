export type WorkflowState =
  | 'NEW'
  | 'UNDERSTANDING'
  | 'INFORMATION_REQUIRED'
  | 'PLANNING'
  | 'READY'
  | 'EXECUTING'
  | 'WAITING_FOR_APPROVAL'
  | 'WAITING_FOR_INFORMATION'
  | 'WAITING_FOR_EXTERNAL_SYSTEM'
  | 'FAILED'
  | 'REPLANNING'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'WAITING' | 'FAILED' | 'REPLANNED';
  input?: any;
  output?: any;
  dataSource?: string;
  responsibleRole: string;
  approvalRequired: boolean;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number; // 0 - 100
  timestamp?: string;
  dependencies: string[]; // task IDs
  executionType?: 'AI_AUTOMATED' | 'HUMAN_APPROVED' | 'SYSTEM_EXECUTED' | 'AI_REPLANNED' | 'ESCALATED';
}

export interface PolicyRule {
  id: string;
  category: string;
  name: string;
  condition: string;
  action: 'AUTO_APPROVE' | 'REQUIRE_APPROVAL' | 'REJECT' | 'ESCALATE';
  approvalLevel?: 'MANAGER' | 'FINANCE' | 'HR' | 'DIRECTOR' | 'EXECUTIVE';
  thresholdValue?: number;
  description: string;
}

export interface WorkflowInstance {
  id: string;
  title: string;
  workflowType: string;
  requestText: string;
  requesterId: string;
  requesterName: string;
  department: string;
  state: WorkflowState;
  priority: PriorityLevel;
  priorityReason?: string;
  confidenceScore: number;
  confidenceReason?: string;
  missingInformation: string[];
  tasks: WorkflowTask[];
  currentStepIndex: number;
  dataSourcesUsed: string[];
  createdAt: string;
  updatedAt: string;
  slaHours: number;
  slaDueDate: string;
  slaStatus: 'ON_TRACK' | 'SLA_WARNING' | 'SLA_BREACHED';
  healthScore: number; // 0 - 100
  replannedCount: number;
  lastReplanReason?: string;
  approvalDetails?: {
    required: boolean;
    approverRole: string;
    approverName?: string;
    reason?: string;
    approvedAt?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comments?: string;
  };
  metadata?: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  workflowId: string;
  timestamp: string;
  actorType: 'AI AUTOMATED' | 'HUMAN APPROVED' | 'SYSTEM EXECUTED' | 'AI RE-PLANNED' | 'ESCALATED';
  actorName: string;
  action: string;
  dataSource?: string;
  decision?: string;
  reason?: string;
  policyUsed?: string;
  result?: string;
  error?: string;
  recoveryAction?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  triggerExample: string;
  dataSources: string[];
  policies: string[];
  defaultSlaHours: number;
  approvalPolicy: string;
  steps: Array<{
    name: string;
    description: string;
    responsibleRole: string;
    approvalRequired: boolean;
    dataSource?: string;
  }>;
}

export interface UnderstandingResult {
  requestType: string;
  intent: string;
  entities: Record<string, any>;
  constraints: string[];
  priority: PriorityLevel;
  priorityReason: string;
  requiredInformation: string[];
  missingInformation: string[];
  suggestedWorkflow: string;
  confidenceScore: number;
  confidenceReason: string;
  nextAction: string;
}
