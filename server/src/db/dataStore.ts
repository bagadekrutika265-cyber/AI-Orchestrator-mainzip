import { User, WorkflowInstance, AuditLogEntry, PolicyRule, WorkflowTemplate } from '../types.js';

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalOutstanding: number;
  paymentScore: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  status: 'PENDING' | 'OVERDUE' | 'PARTIAL' | 'PAID' | 'DISPUTED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastReminderDate?: string;
  missedPaymentCount: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  leaveBalanceDays: number;
  assignedAssetId?: string;
  managerId: string;
  managerName: string;
}

export interface Asset {
  id: string;
  assetTag: string;
  category: 'Laptop' | 'Desktop' | 'Furniture' | 'Monitor' | 'Accessory';
  model: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'DAMAGED';
  assignedTo?: string;
  department: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  complianceDocsStatus: 'COMPLETE' | 'MISSING_CERTIFICATE' | 'PENDING_REVIEW';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  contactEmail: string;
}

class DataStore {
  public users: User[] = [];
  public employees: Employee[] = [];
  public customers: Customer[] = [];
  public invoices: Invoice[] = [];
  public assets: Asset[] = [];
  public vendors: Vendor[] = [];
  public policies: PolicyRule[] = [];
  public workflows: WorkflowInstance[] = [];
  public auditLogs: AuditLogEntry[] = [];
  public templates: WorkflowTemplate[] = [];

  constructor() {
    this.seedAllData();
  }

  private seedAllData() {
    // Seed Users
    this.users = [
      { id: 'usr-1', name: 'Alexander Vance', email: 'alexander@acme.com', role: 'ADMIN', department: 'Executive', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'usr-2', name: 'Sarah Jenkins', email: 'sarah.j@acme.com', role: 'MANAGER', department: 'Finance', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { id: 'usr-3', name: 'David Miller', email: 'david.m@acme.com', role: 'EMPLOYEE', department: 'Engineering', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { id: 'usr-4', name: 'Elena Rostova', email: 'elena.r@acme.com', role: 'MANAGER', department: 'HR', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
      { id: 'usr-5', name: 'Marcus Sterling', email: 'marcus.s@acme.com', role: 'MANAGER', department: 'Procurement', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
    ];

    // Seed 20+ Employees
    const depts = ['Engineering', 'Finance', 'HR', 'Sales', 'Procurement', 'IT', 'Customer Support'];
    for (let i = 1; i <= 24; i++) {
      this.employees.push({
        id: `emp-${i}`,
        name: `Employee ${i} (${['Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Sneha Gupta', 'Vikram Singh', 'Ananya Roy', 'Rohan Mehta', 'Kavita Nair'][i % 8]})`,
        email: `employee${i}@acme.com`,
        department: depts[i % depts.length],
        role: i % 5 === 0 ? 'Lead / Manager' : 'Specialist',
        leaveBalanceDays: 12 + (i % 8),
        managerId: i % 2 === 0 ? 'usr-2' : 'usr-4',
        managerName: i % 2 === 0 ? 'Sarah Jenkins' : 'Elena Rostova',
      });
    }

    // Seed 20+ Customers
    const customerNames = [
      'ABC Corp', 'Zenith Logistics', 'Apex Retail Solutions', 'Starlight Tech',
      'Global Dynamics', 'Nexus Enterprises', 'Horizon Healthcare', 'Vanguard Media',
      'CyberPulse Inc', 'Omni Systems', 'Trident Capital', 'Solaris Energy',
      'Krypton Software', 'Elysium Retail', 'Orion Infrastructure', 'Titanium Global',
      'Hyperion Labs', 'Velocis Tech', 'Quantum Analytics', 'BlueSky Networks'
    ];

    customerNames.forEach((cName, idx) => {
      const risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = idx % 4 === 0 ? 'CRITICAL' : idx % 3 === 0 ? 'HIGH' : 'LOW';
      this.customers.push({
        id: `cust-${idx + 1}`,
        name: cName,
        contactPerson: `Contact Person ${idx + 1}`,
        email: `accounts@${cName.toLowerCase().replace(/ /g, '')}.com`,
        phone: `+91 98765 43${idx.toString().padStart(2, '0')}`,
        riskCategory: risk,
        totalOutstanding: 45000 + (idx * 22000),
        paymentScore: Math.max(30, 95 - idx * 3),
      });
    });

    // Seed 40+ Invoices (Overdue > ₹50,000 prioritized for Demo Workflow)
    for (let i = 1; i <= 42; i++) {
      const cust = this.customers[i % this.customers.length];
      const isOverdue = i % 2 === 1;
      const daysOverdue = isOverdue ? 25 + (i * 3) : 0;
      const amount = isOverdue ? 52000 + (i * 12500) : 15000 + (i * 2000);

      this.invoices.push({
        id: `inv-${1000 + i}`,
        invoiceNumber: `INV-${202600 + i}`,
        customerId: cust.id,
        customerName: cust.name,
        amount: amount,
        currency: 'INR (₹)',
        dueDate: isOverdue ? '2026-08-10' : '2026-10-15',
        daysOverdue: daysOverdue,
        status: isOverdue ? 'OVERDUE' : 'PENDING',
        riskLevel: isOverdue && amount > 100000 ? 'CRITICAL' : isOverdue ? 'HIGH' : 'LOW',
        missedPaymentCount: isOverdue ? Math.min(4, Math.floor(daysOverdue / 20)) : 0,
        lastReminderDate: isOverdue ? '2026-09-01' : undefined
      });
    }

    // Seed Assets
    this.assets = [
      { id: 'ast-1', assetTag: 'LAP-2024-089', category: 'Laptop', model: 'MacBook Pro M3 16"', status: 'ASSIGNED', assignedTo: 'David Miller', department: 'Engineering' },
      { id: 'ast-2', assetTag: 'LAP-2025-012', category: 'Laptop', model: 'Dell XPS 15', status: 'AVAILABLE', department: 'IT' },
      { id: 'ast-3', assetTag: 'LAP-2025-015', category: 'Laptop', model: 'ThinkPad X1 Carbon', status: 'AVAILABLE', department: 'IT' },
      { id: 'ast-4', assetTag: 'FUR-2026-001', category: 'Furniture', model: 'Ergonomic Office Chair Pro', status: 'AVAILABLE', department: 'Procurement' },
    ];

    // Seed Vendors
    this.vendors = [
      { id: 'ven-101', name: 'CloudScale Technologies', category: 'SaaS Software', status: 'APPROVED', complianceDocsStatus: 'COMPLETE', riskScore: 'LOW', contactEmail: 'legal@cloudscale.io' },
      { id: 'ven-102', name: 'ErgoComfort Office Supplies', category: 'Office Furniture', status: 'APPROVED', complianceDocsStatus: 'COMPLETE', riskScore: 'LOW', contactEmail: 'sales@ergocomfort.com' },
      { id: 'ven-103', name: 'CyberShield Security Solutions', category: 'IT Security Vendor', status: 'PENDING', complianceDocsStatus: 'MISSING_CERTIFICATE', riskScore: 'HIGH', contactEmail: 'compliance@cybershield.net' },
    ];

    // Seed Policies
    this.policies = [
      { id: 'pol-1', category: 'Finance', name: 'High-Value Invoice Recovery Policy', condition: 'amount > 50000 AND daysOverdue > 30', action: 'REQUIRE_APPROVAL', approvalLevel: 'MANAGER', description: 'Invoices above ₹50,000 overdue by >30 days require manager approval before external recovery outreach.' },
      { id: 'pol-2', category: 'Sales', name: 'Sales Discount Approval Thresholds', condition: 'discountPercentage > 15', action: 'REQUIRE_APPROVAL', approvalLevel: 'FINANCE', description: 'Discounts 0-5% (Sales), 5-15% (Sales Manager), 15-25% (Finance Director), >25% (Executive approval).' },
      { id: 'pol-3', category: 'Procurement', name: 'Purchase Request Approval Threshold', condition: 'totalCost > 25000', action: 'REQUIRE_APPROVAL', approvalLevel: 'MANAGER', description: 'Purchases exceeding ₹25,000 require Manager & Finance sign-off.' },
      { id: 'pol-4', category: 'HR', name: 'Leave Policy Balance Verification', condition: 'requestedDays <= leaveBalance', action: 'AUTO_APPROVE', approvalLevel: 'HR', description: 'Leave requests within available balance and without calendar conflicts proceed to manager signoff.' },
      { id: 'pol-5', category: 'Vendor', name: 'Vendor Compliance Requirement', condition: 'complianceDocsStatus != COMPLETE', action: 'REJECT', description: 'Vendors missing mandatory ISO/tax certificates cannot be approved until uploaded.' }
    ];

    // Seed Sample Active Workflows
    const now = new Date().toISOString();
    this.workflows = [
      {
        id: 'wf-demo-101',
        title: 'Invoice & Payment Recovery - High Value Overdue',
        workflowType: 'Invoice & Payment Recovery',
        requestText: 'Find overdue invoices above ₹50,000 and recover the payments.',
        requesterId: 'usr-2',
        requesterName: 'Sarah Jenkins',
        department: 'Finance',
        state: 'WAITING_FOR_APPROVAL',
        priority: 'CRITICAL',
        priorityReason: '₹2,40,000 outstanding across 3 overdue accounts >60 days overdue.',
        confidenceScore: 98,
        confidenceReason: 'Matches finance policy pol-1 and validated invoice records.',
        missingInformation: [],
        tasks: [
          { id: 't1', name: 'Query Database for Overdue Invoices', description: 'Filter invoices > ₹50,000 and status = OVERDUE', status: 'COMPLETED', dataSource: 'Invoice Database (invoices.csv)', responsibleRole: 'AI Engine', approvalRequired: false, risk: 'LOW', confidence: 100, dependencies: [], executionType: 'AI_AUTOMATED' },
          { id: 't2', name: 'Analyze Customer Payment Risk & Priority', description: 'Calculated high risk due to 67 days overdue and missed payments', status: 'COMPLETED', dataSource: 'Customer CRM (customers.json)', responsibleRole: 'AI Engine', approvalRequired: false, risk: 'HIGH', confidence: 95, dependencies: ['t1'], executionType: 'SYSTEM_EXECUTED' },
          { id: 't3', name: 'Generate Personalized Demand Notice & Approval', description: 'Drafted payment recovery notice and requested Manager approval', status: 'WAITING', dataSource: 'Policy Engine (company_policies.json)', responsibleRole: 'Finance Manager', approvalRequired: true, risk: 'HIGH', confidence: 92, dependencies: ['t2'], executionType: 'HUMAN_APPROVED' },
          { id: 't4', name: 'Dispatch Payment Reminder Email', description: 'Send automated email notification to customer accounts team', status: 'PENDING', dataSource: 'Email Gateway', responsibleRole: 'System', approvalRequired: false, risk: 'LOW', confidence: 90, dependencies: ['t3'] },
          { id: 't5', name: 'Verify Payment Settlement', description: 'Monitor bank gateway for incoming payment confirmation', status: 'PENDING', dataSource: 'Payment Gateway API', responsibleRole: 'System', approvalRequired: false, risk: 'LOW', confidence: 98, dependencies: ['t4'] }
        ],
        currentStepIndex: 2,
        dataSourcesUsed: ['Invoice Database', 'Customer CRM', 'Policy Engine'],
        createdAt: now,
        updatedAt: now,
        slaHours: 24,
        slaDueDate: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
        slaStatus: 'ON_TRACK',
        healthScore: 94,
        replannedCount: 0,
        approvalDetails: {
          required: true,
          approverRole: 'Finance Manager',
          status: 'PENDING',
          reason: 'High-value recovery outreach (₹2,40,000) exceeds automatic communication threshold.'
        }
      }
    ];

    // Seed Audit Logs
    this.auditLogs = [
      { id: 'log-1', workflowId: 'wf-demo-101', timestamp: new Date(Date.now() - 20 * 60000).toISOString(), actorType: 'AI AUTOMATED', actorName: 'AI Orchestrator Engine', action: 'Initiated Workflow & Intent Extraction', dataSource: 'NLP Request Parser', result: 'Mapped request to Invoice & Payment Recovery workflow' },
      { id: 'log-2', workflowId: 'wf-demo-101', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), actorType: 'SYSTEM EXECUTED', actorName: 'Database Connector', action: 'Queried Overdue Invoices > ₹50,000', dataSource: 'Invoice Database', result: 'Found 4 overdue invoices totaling ₹5,80,000' },
      { id: 'log-3', workflowId: 'wf-demo-101', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), actorType: 'AI AUTOMATED', actorName: 'Policy Engine', action: 'Evaluated Policy pol-1', policyUsed: 'High-Value Invoice Recovery Policy', result: 'Approval required from Sarah Jenkins (Finance Manager)' }
    ];
  }
}

export const db = new DataStore();
