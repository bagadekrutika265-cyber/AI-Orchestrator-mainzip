import { WorkflowTemplate } from '../types.js';

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'wf-tmpl-1',
    name: 'Invoice & Payment Recovery',
    category: 'Finance',
    description: 'Autonomous identification, risk calculation, communication, and payment tracking for overdue customer invoices.',
    triggerExample: 'Find overdue invoices above ₹50,000 and recover the payments.',
    dataSources: ['Invoice Database (invoices.csv)', 'Customer CRM (customers.json)', 'Payment Gateway API', 'Company Policies (policies.json)'],
    policies: ['pol-1: High-Value Recovery Policy (Approval threshold > ₹50k)'],
    defaultSlaHours: 24,
    approvalPolicy: 'Manager approval required before initiating formal collection notices above ₹50,000.',
    steps: [
      { name: 'Retrieve Overdue Invoice Data', description: 'Query invoice database for balances > ₹50,000 overdue > 30 days', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Invoice Database' },
      { name: 'Analyze Customer Risk & History', description: 'Calculate priority using credit risk score and past payment delays', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Customer CRM' },
      { name: 'Evaluate Policy & Request Approval', description: 'Check policy threshold; trigger Human Manager approval pause', responsibleRole: 'Finance Manager', approvalRequired: true, dataSource: 'Policy Engine' },
      { name: 'Dispatch Payment Recovery Notice', description: 'Send personalized reminder email with payment link', responsibleRole: 'System', approvalRequired: false, dataSource: 'Email Service' },
      { name: 'Monitor & Verify Settlement', description: 'Check payment API for settlement confirmation and update status', responsibleRole: 'System', approvalRequired: false, dataSource: 'Payment Gateway' }
    ]
  },
  {
    id: 'wf-tmpl-2',
    name: 'Leave Request',
    category: 'HR',
    description: 'Employee leave balance verification, team calendar conflict check, and manager sign-off.',
    triggerExample: 'I want leave from 10 October to 13 October.',
    dataSources: ['Employee Database (employees.json)', 'Leave Records', 'Team Calendar API', 'HR Leave Policy'],
    policies: ['pol-4: Leave Balance Verification & Conflict Policy'],
    defaultSlaHours: 16,
    approvalPolicy: 'Manager approval required for requests exceeding 2 days.',
    steps: [
      { name: 'Extract Leave Dates & Employee Info', description: 'Identify employee and parse requested leave range', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'NLP Parser' },
      { name: 'Check Available Leave Balance', description: 'Verify employee has sufficient paid leave accrued', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Employee Database' },
      { name: 'Check Team Calendar & Conflicts', description: 'Ensure minimum team coverage during requested dates', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Team Calendar' },
      { name: 'Request Manager Approval', description: 'Send leave approval request to reporting manager', responsibleRole: 'Reporting Manager', approvalRequired: true, dataSource: 'Approval Engine' },
      { name: 'Update HR Records & Calendar', description: 'Deduct leave balance and block dates on shared calendar', responsibleRole: 'System', approvalRequired: false, dataSource: 'HR System' }
    ]
  },
  {
    id: 'wf-tmpl-3',
    name: 'Purchase Request',
    category: 'Procurement',
    description: 'Inventory lookup, budget check, approved vendor quote comparison, and purchase order creation.',
    triggerExample: 'Purchase 20 office chairs for our new office.',
    dataSources: ['Inventory Database', 'Department Budget API', 'Vendor Database (vendors.json)', 'Procurement Policy'],
    policies: ['pol-3: Purchase Threshold > ₹25,000 Manager Approval'],
    defaultSlaHours: 48,
    approvalPolicy: 'Requires Manager sign-off for > ₹25,000 and Finance sign-off for > ₹100,000.',
    steps: [
      { name: 'Analyze Item & Quantity Requested', description: 'Parse items, quantities, and target specifications', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'NLP Engine' },
      { name: 'Check Current Asset Inventory', description: 'Verify if required items are already available in stock', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Inventory Database' },
      { name: 'Check Department Budget & Vendors', description: 'Retrieve budget balance and compare quotes from approved vendors', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Vendor Database' },
      { name: 'Request Manager & Finance Approval', description: 'Submit purchase requisition for managerial signoff', responsibleRole: 'Manager & Finance', approvalRequired: true, dataSource: 'Approval Engine' },
      { name: 'Generate Purchase Order (PO)', description: 'Issue digital PO to vendor and notify requester', responsibleRole: 'System', approvalRequired: false, dataSource: 'Procurement System' }
    ]
  },
  {
    id: 'wf-tmpl-4',
    name: 'Expense Reimbursement',
    category: 'Finance',
    description: 'Receipt OCR extraction, claim validation, duplicate check, and reimbursement processing.',
    triggerExample: 'I want reimbursement for my ₹8,500 business trip.',
    dataSources: ['Expense Claims CSV', 'Receipt Document Parser', 'Employee Records', 'Travel Expense Policy'],
    policies: ['pol-expense: Duplicate claim check & receipt requirement'],
    defaultSlaHours: 40,
    approvalPolicy: 'Manager signoff required for expenses over ₹5,000.',
    steps: [
      { name: 'Extract Claim Details & Receipt Info', description: 'Parse expense amount, merchant, date, and category', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Receipt Parser' },
      { name: 'Validate Against Expense Policy', description: 'Check spending limits and scan for duplicate claims', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Policy Engine' },
      { name: 'Request Manager Sign-off', description: 'Send receipt summary and AI validation score to manager', responsibleRole: 'Manager', approvalRequired: true, dataSource: 'Approval Engine' },
      { name: 'Process Payment via Payroll API', description: 'Transfer funds to employee bank account', responsibleRole: 'System', approvalRequired: false, dataSource: 'Payroll API' }
    ]
  },
  {
    id: 'wf-tmpl-5',
    name: 'Customer Complaint',
    category: 'Customer Support',
    description: 'Issue severity calculation, order lookup, resolution strategy recommendation, and escalation.',
    triggerExample: 'A customer received a damaged product.',
    dataSources: ['Customer Database', 'Order Management API', 'Delivery Logs', 'Support Knowledge Base'],
    policies: ['pol-complaint: Automatic high priority for order values > ₹20k'],
    defaultSlaHours: 12,
    approvalPolicy: 'Compensation > ₹2,000 requires Support Lead signoff.',
    steps: [
      { name: 'Identify Customer & Retrieve Order', description: 'Lookup customer profile and recent order tracking status', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Order API' },
      { name: 'Classify Severity & Priority', description: 'Score issue severity and calculate SLA deadline', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Priority Engine' },
      { name: 'Draft Resolution & Compensation Plan', description: 'Generate replacement dispatch or refund recommendation', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Decision Engine' },
      { name: 'Request Support Manager Approval', description: 'Submit proposed compensation for approval if > threshold', responsibleRole: 'Support Manager', approvalRequired: true, dataSource: 'Approval Engine' },
      { name: 'Dispatch Resolution Email to Customer', description: 'Send resolution confirmation and tracking link', responsibleRole: 'System', approvalRequired: false, dataSource: 'Email Gateway' }
    ]
  },
  {
    id: 'wf-tmpl-6',
    name: 'IT Equipment Request',
    category: 'IT Support',
    description: 'Device asset check, eligibility verification, inventory lookup, procurement fallback replanning.',
    triggerExample: 'My laptop is damaged and I need a replacement.',
    dataSources: ['Asset Inventory (assets.json)', 'Employee Asset Database', 'IT Hardware Policy'],
    policies: ['pol-it: Equipment replacement eligibility rules'],
    defaultSlaHours: 24,
    approvalPolicy: 'IT Manager approval required for hardware replacement.',
    steps: [
      { name: 'Identify Employee & Active Asset', description: 'Check current assigned laptop model and warranty status', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Asset Inventory' },
      { name: 'Check Spare Equipment Stock', description: 'Locate available pre-configured laptops in IT inventory', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'IT Inventory' },
      { name: 'Request IT Manager Approval', description: 'Submit asset replacement ticket to IT Manager', responsibleRole: 'IT Manager', approvalRequired: true, dataSource: 'Approval Engine' },
      { name: 'Assign Asset & Send Pickup Ticket', description: 'Update asset database status and issue collection QR code', responsibleRole: 'System', approvalRequired: false, dataSource: 'IT System' }
    ]
  },
  {
    id: 'wf-tmpl-7',
    name: 'Employee Onboarding',
    category: 'Cross-Department (HR / IT)',
    description: 'Cross-department orchestration for new hires: document verification, IT provisioning, and access setup.',
    triggerExample: 'New employee joins next Monday.',
    dataSources: ['HR Database', 'IT Asset Store', 'Directory API (Azure AD / Google Workspace)'],
    policies: ['pol-onboard: Pre-joining checklist verification'],
    defaultSlaHours: 72,
    approvalPolicy: 'HR Manager signoff for document checklist verification.',
    steps: [
      { name: 'Create Onboarding File & Checklist', description: 'Initialize employee record, role profile, and start date', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'HR Database' },
      { name: 'Trigger IT Provisioning Sub-workflow', description: 'Trigger hardware allocation and email account creation', responsibleRole: 'System', approvalRequired: false, dataSource: 'IT Gateway' },
      { name: 'Request System Access Permissions', description: 'Configure department Slack, GitHub, and Jira access', responsibleRole: 'IT Admin', approvalRequired: true, dataSource: 'Identity System' },
      { name: 'Send Welcome Packet & Credential Link', description: 'Deliver encrypted credentials and orientation schedule', responsibleRole: 'System', approvalRequired: false, dataSource: 'Email Gateway' }
    ]
  },
  {
    id: 'wf-tmpl-8',
    name: 'Sales Discount Approval',
    category: 'Sales',
    description: 'Tiered policy evaluation for custom customer pricing and financial impact check.',
    triggerExample: 'Give ABC customer a 20% discount.',
    dataSources: ['Customer Account History', 'Current Deal Pipeline', 'Sales Discount Policy'],
    policies: ['pol-2: Sales Discount Approval Tiers (0-5%, 5-15%, 15-25%, >25%)'],
    defaultSlaHours: 12,
    approvalPolicy: '0-5% (Sales), 5-15% (Sales Mgr), 15-25% (Finance Dir), >25% (Executive).',
    steps: [
      { name: 'Retrieve Customer Order & Deal Value', description: 'Calculate financial impact of requested discount percentage', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Sales Pipeline' },
      { name: 'Evaluate Discount Policy Threshold', description: 'Determine required approver role based on policy tiers', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Policy Engine' },
      { name: 'Request Finance Director Approval', description: 'Submit discount justification and margin impact study', responsibleRole: 'Finance Director', approvalRequired: true, dataSource: 'Approval Engine' },
      { name: 'Update Quotation & Notify Sales Agent', description: 'Apply approved discount code to active sales quote', responsibleRole: 'System', approvalRequired: false, dataSource: 'CRM System' }
    ]
  },
  {
    id: 'wf-tmpl-9',
    name: 'Vendor Approval',
    category: 'Procurement',
    description: 'Vendor compliance validation, document verification, risk scoring, and vendor master creation.',
    triggerExample: 'Approve this new software vendor.',
    dataSources: ['Vendor Database (vendors.json)', 'Compliance Document Store', 'Tax API'],
    policies: ['pol-5: Mandatory Compliance Documents Check'],
    defaultSlaHours: 48,
    approvalPolicy: 'Procurement & Compliance signoff required for all new vendors.',
    steps: [
      { name: 'Collect Vendor Information & Tax ID', description: 'Validate company registration and tax compliance history', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Vendor Database' },
      { name: 'Perform Vendor Risk Assessment', description: 'Score operational, security, and financial risk profile', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'Risk Engine' },
      { name: 'Verify Compliance Documents', description: 'Check ISO 27001 certificate and NDA submission', responsibleRole: 'Compliance Officer', approvalRequired: true, dataSource: 'Document Store' },
      { name: 'Activate Vendor Master Record', description: 'Add vendor to approved ERP procurement list', responsibleRole: 'System', approvalRequired: false, dataSource: 'ERP System' }
    ]
  },
  {
    id: 'wf-tmpl-10',
    name: 'Service Request',
    category: 'IT Operations',
    description: 'Incidents classification, SLA tier assignment, automated ticket routing, and resolution tracking.',
    triggerExample: 'The finance department network is not working.',
    dataSources: ['Incident Management Database', 'Network Monitoring API', 'IT SLA Policy'],
    policies: ['pol-service: Critical priority SLA (4 hours) for department-wide outages'],
    defaultSlaHours: 4,
    approvalPolicy: 'Requires IT Operations Lead signoff for emergency infrastructure changes.',
    steps: [
      { name: 'Classify Incident & Impact Scope', description: 'Identify affected department (Finance) and outage severity', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'NLP Parser' },
      { name: 'Assign Priority & SLA Deadline', description: 'Set CRITICAL priority with 4-hour resolution SLA target', responsibleRole: 'AI Engine', approvalRequired: false, dataSource: 'SLA Engine' },
      { name: 'Dispatch On-Call Network Engineer', description: 'Create high-priority PagerDuty incident ticket', responsibleRole: 'System', approvalRequired: false, dataSource: 'Incident Gateway' },
      { name: 'Confirm Network Restoration & Close Ticket', description: 'Verify ping connectivity and send resolution notice', responsibleRole: 'IT Operations Lead', approvalRequired: true, dataSource: 'Monitoring API' }
    ]
  }
];
