"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPolicyEngine = void 0;
const dataStore_js_1 = require("../db/dataStore.js");
class BusinessPolicyEngine {
    static evaluate(workflowType, metadata) {
        switch (workflowType) {
            case 'Invoice & Payment Recovery': {
                const amount = metadata.amount || 240000;
                const daysOverdue = metadata.daysOverdue || 67;
                const pol = dataStore_js_1.db.policies.find(p => p.id === 'pol-1');
                if (amount > 50000 && daysOverdue > 30) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Finance Manager',
                        policyUsed: pol,
                        reason: `High-value overdue invoice (₹${amount.toLocaleString()}) exceeds the ₹50,000 threshold for automated communication. Manager approval required.`,
                        autoApproved: false,
                    };
                }
                break;
            }
            case 'Sales Discount Approval': {
                const discountPct = metadata.discountPercentage || 20;
                const pol = dataStore_js_1.db.policies.find(p => p.id === 'pol-2');
                if (discountPct > 25) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Executive Director',
                        policyUsed: pol,
                        reason: `Discount of ${discountPct}% exceeds 25% ceiling. Requires Executive signoff.`,
                        autoApproved: false
                    };
                }
                else if (discountPct > 15) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Finance Director',
                        policyUsed: pol,
                        reason: `Discount of ${discountPct}% falls in 15-25% tier. Requires Finance Director signoff.`,
                        autoApproved: false
                    };
                }
                else if (discountPct > 5) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Sales Manager',
                        policyUsed: pol,
                        reason: `Discount of ${discountPct}% falls in 5-15% tier. Requires Sales Manager signoff.`,
                        autoApproved: false
                    };
                }
                break;
            }
            case 'Purchase Request': {
                const totalCost = metadata.totalCost || 45000;
                const pol = dataStore_js_1.db.policies.find(p => p.id === 'pol-3');
                if (totalCost > 25000) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Procurement Manager',
                        policyUsed: pol,
                        reason: `Total procurement cost (₹${totalCost.toLocaleString()}) exceeds ₹25,000 policy threshold. Manager approval required.`,
                        autoApproved: false
                    };
                }
                break;
            }
            case 'Expense Reimbursement': {
                const amount = metadata.amount || 8500;
                if (amount > 5000) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Reporting Manager',
                        reason: `Expense claim of ₹${amount.toLocaleString()} exceeds automatic ₹5,000 reimbursement threshold. Manager signoff required.`,
                        autoApproved: false
                    };
                }
                break;
            }
            case 'IT Equipment Request': {
                return {
                    requiresApproval: true,
                    approvalRole: 'IT Manager',
                    reason: 'Hardware replacement request requires IT Manager signoff to verify asset lifecycle.',
                    autoApproved: false
                };
            }
            case 'Vendor Approval': {
                const hasMissingDocs = metadata.complianceDocsStatus === 'MISSING_CERTIFICATE';
                if (hasMissingDocs) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Compliance Officer',
                        reason: 'Vendor document check identified missing ISO security compliance certificate.',
                        autoApproved: false
                    };
                }
                break;
            }
            case 'Leave Request': {
                const days = metadata.days || 3;
                if (days > 2) {
                    return {
                        requiresApproval: true,
                        approvalRole: 'Reporting Manager',
                        reason: `Leave duration of ${days} days exceeds automatic 2-day approval threshold. Manager signoff required.`,
                        autoApproved: false
                    };
                }
                break;
            }
        }
        return {
            requiresApproval: false,
            reason: 'Request satisfies all automated policy conditions and guidelines.',
            autoApproved: true
        };
    }
}
exports.BusinessPolicyEngine = BusinessPolicyEngine;
