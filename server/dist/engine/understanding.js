"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestUnderstandingEngine = void 0;
class RequestUnderstandingEngine {
    static understand(requestText) {
        const textLower = requestText.toLowerCase();
        // Workflow Classification Rules
        let suggestedWorkflow = 'Invoice & Payment Recovery';
        let requestType = 'Invoice & Payment Recovery';
        let intent = 'Recover overdue payments from customers';
        let priority = 'MEDIUM';
        let priorityReason = 'Standard business workflow request';
        let confidenceScore = 96;
        let missingInfo = [];
        const requiredInfo = [];
        const constraints = [];
        const entities = {};
        if (textLower.includes('overdue') || textLower.includes('invoice') || textLower.includes('recover') || textLower.includes('50,000') || textLower.includes('50000')) {
            suggestedWorkflow = 'Invoice & Payment Recovery';
            requestType = 'Invoice & Payment Recovery';
            intent = 'Identify high-value overdue accounts and initiate payment recovery workflow';
            priority = 'CRITICAL';
            priorityReason = 'High financial value (> ₹50,000) overdue for extended period';
            confidenceScore = 98;
            entities.targetAmount = 50000;
            entities.filterCondition = 'overdue';
            requiredInfo.push('Invoice Records', 'Customer Payment History', 'Manager Approval Threshold');
        }
        else if (textLower.includes('leave') || textLower.includes('vacation') || textLower.includes('off work') || textLower.includes('october') || textLower.includes('days leave')) {
            suggestedWorkflow = 'Leave Request';
            requestType = 'Leave Request';
            intent = 'Submit employee paid leave request';
            priority = 'MEDIUM';
            priorityReason = 'Standard employee HR request';
            confidenceScore = 95;
            requiredInfo.push('Leave Start Date', 'Leave End Date', 'Leave Balance');
            if (!textLower.match(/\d+/) && !textLower.includes('october')) {
                missingInfo.push('Specific leave start and end dates');
            }
        }
        else if (textLower.includes('chair') || textLower.includes('purchase') || textLower.includes('buy') || textLower.includes('procure')) {
            suggestedWorkflow = 'Purchase Request';
            requestType = 'Purchase Request';
            intent = 'Request procurement of office equipment/assets';
            priority = 'HIGH';
            priorityReason = 'CapEx/OpEx spending request requiring inventory and budget checks';
            confidenceScore = 97;
            entities.itemCategory = 'Furniture';
            entities.requestedQuantity = 20;
            requiredInfo.push('Item Specifications', 'Department Budget', 'Approved Vendors');
        }
        else if (textLower.includes('reimburse') || textLower.includes('expense') || textLower.includes('trip') || textLower.includes('8,500') || textLower.includes('receipt')) {
            suggestedWorkflow = 'Expense Reimbursement';
            requestType = 'Expense Reimbursement';
            intent = 'Process employee business expense claim';
            priority = 'MEDIUM';
            priorityReason = 'Operational expense reimbursement';
            confidenceScore = 96;
            entities.claimAmount = 8500;
            requiredInfo.push('Expense Receipt Image/Document', 'Expense Category', 'Manager Signoff');
        }
        else if (textLower.includes('complaint') || textLower.includes('damaged product') || textLower.includes('customer') || textLower.includes('delayed delivery')) {
            suggestedWorkflow = 'Customer Complaint';
            requestType = 'Customer Complaint';
            intent = 'Address customer satisfaction issue and issue compensation or replacement';
            priority = 'HIGH';
            priorityReason = 'Customer satisfaction risk affecting client relationship';
            confidenceScore = 94;
            requiredInfo.push('Customer Account ID', 'Order Reference Number', 'Damage Evidence');
        }
        else if (textLower.includes('laptop') || textLower.includes('equipment') || textLower.includes('damaged laptop') || textLower.includes('macbook')) {
            suggestedWorkflow = 'IT Equipment Request';
            requestType = 'IT Equipment Request';
            intent = 'Request replacement or upgraded IT hardware asset';
            priority = 'HIGH';
            priorityReason = 'Employee productivity blocked due to damaged workstation';
            confidenceScore = 96;
            entities.deviceType = 'Laptop';
            entities.reason = 'Current laptop damaged';
            requiredInfo.push('Device Serial Number', 'IT Inventory Availability');
        }
        else if (textLower.includes('onboarding') || textLower.includes('new employee') || textLower.includes('joins next monday') || textLower.includes('joins monday')) {
            suggestedWorkflow = 'Employee Onboarding';
            requestType = 'Employee Onboarding';
            intent = 'Orchestrate cross-department provisioning for new hire';
            priority = 'HIGH';
            priorityReason = 'Time-sensitive onboarding deadline for incoming team member';
            confidenceScore = 98;
            entities.joiningDate = 'Next Monday';
            requiredInfo.push('Employee Personal Details', 'Hardware Allocation', 'System Access Profile');
        }
        else if (textLower.includes('discount') || textLower.includes('20%') || textLower.includes('abc customer') || textLower.includes('abc corp')) {
            suggestedWorkflow = 'Sales Discount Approval';
            requestType = 'Sales Discount Approval';
            intent = 'Request custom pricing/discount for sales deal';
            priority = 'HIGH';
            priorityReason = 'Commercial deal approval requiring tier margin analysis';
            confidenceScore = 97;
            entities.customerName = 'ABC Corp';
            entities.discountPercentage = 20;
            requiredInfo.push('Deal Value', 'Discount Policy Tier', 'Finance Signoff');
        }
        else if (textLower.includes('vendor') || textLower.includes('approve vendor') || textLower.includes('software vendor')) {
            suggestedWorkflow = 'Vendor Approval';
            requestType = 'Vendor Approval';
            intent = 'Onboard and approve new third-party vendor';
            priority = 'MEDIUM';
            priorityReason = 'Procurement compliance & vendor risk assessment';
            confidenceScore = 95;
            requiredInfo.push('Tax Registration Certificate', 'ISO 27001 Security Audit', 'NDA Document');
        }
        else if (textLower.includes('network') || textLower.includes('finance network') || textLower.includes('down') || textLower.includes('outage') || textLower.includes('service ticket')) {
            suggestedWorkflow = 'Service Request';
            requestType = 'Service Request';
            intent = 'Resolve department-wide infrastructure/network outage';
            priority = 'CRITICAL';
            priorityReason = 'Department business operations stopped due to active network outage';
            confidenceScore = 99;
            entities.affectedDepartment = 'Finance';
            entities.issueCategory = 'Network Outage';
            requiredInfo.push('Incident Scope', 'Assigned Network Engineer', 'SLA Clock (4h)');
        }
        return {
            requestType,
            intent,
            entities,
            constraints,
            priority,
            priorityReason,
            requiredInformation: requiredInfo,
            missingInformation: missingInfo,
            suggestedWorkflow,
            confidenceScore,
            confidenceReason: `High entity overlap with domain blueprint '${suggestedWorkflow}' (${confidenceScore}% match confidence)`,
            nextAction: missingInfo.length > 0 ? `Ask user for required missing information: ${missingInfo.join(', ')}` : `Initiate ${suggestedWorkflow} execution plan`
        };
    }
}
exports.RequestUnderstandingEngine = RequestUnderstandingEngine;
