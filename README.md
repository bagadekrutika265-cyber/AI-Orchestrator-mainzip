<<<<<<< HEAD
# AI ORCHESTRATOR
## Intelligent Business Workflow Automation Platform

> **Main Tagline:** "From Business Request to Intelligent Action."  
> **Secondary Tagline:** "Understand. Plan. Execute. Adapt."  
> **Problem Statement ID:** R2-P1 — INTELLIGENT BUSINESS WORKFLOW AUTOMATION  

---

## 📌 Executive Summary

Small and medium-sized businesses waste countless hours transferring data manually between emails, spreadsheets, databases, and disconnected SaaS applications. Conventional chatbots merely answer isolated questions without executing multi-step business objectives.

**AI ORCHESTRATOR** is an enterprise-grade workflow orchestration platform powered by a single, reusable AI orchestration engine. It transforms natural language business requests into autonomous, self-adapting, multi-step execution graphs.

---

## 🚀 Key Features

1. **AI Request Understanding & Entity Extraction**:
   - Parses intent, entities, constraints, and priority scores (96%+ confidence).
   - Identifies missing information and prompts only when necessary.
2. **Unified Single Engine Architecture**:
   - One core orchestration engine powers all 10 core business workflows.
3. **Multi-Source Context Gathering**:
   - Integrates context from Employee DB, Customer CRM, Invoice CSV, Expense XLSX, Policy files, Asset inventory, and Email gateways.
4. **Universal Workflow State Machine**:
   - `NEW` → `UNDERSTANDING` → `INFORMATION_REQUIRED` → `PLANNING` → `READY` → `EXECUTING` → `WAITING_FOR_APPROVAL` → `RESOLVED` / `FAILED` → `REPLANNING`.
5. **Configurable Business Policy Engine**:
   - Enforces financial thresholds, discount policy tiers, spending caps, and leave balance checks.
6. **Human-In-The-Loop Approval Center**:
   - Pauses workflows for high-value outreach or high-risk actions, providing policy context, risk rationale, and Approve/Reject controls.
7. **Dynamic Re-planning & Live Failure Simulator**:
   - Instantly handles email gateway timeouts, missing documents, asset stockouts, or customer non-response with `WORKFLOW RE-PLANNED` badges and alternative execution paths.
8. **What-If Simulator & Workflow Digital Twin**:
   - Pre-execution simulation predicting step count, expected approvals, bottleneck latency, and risk forecast.
9. **Interactive Hackathon Judge Demo Mode**:
   - 1-Click "START JUDGE DEMO" 2-minute guided presentation.

---

## 💼 10 Supported Business Workflows

1. **Invoice & Payment Recovery** *(Primary Hackathon Demo Story)*: Finds overdue invoices > ₹50,000, checks credit risk, evaluates manager approval policy, dispatches payment notices, handles email failure fallback to SMS/WhatsApp, and verifies settlement.
2. **Leave Request**: Checks paid leave balances, verifies team calendar coverage, and routes to manager sign-off.
3. **Purchase Request**: Checks inventory stock, budget limits, vendor quotes, and issues purchase orders.
4. **Expense Reimbursement**: Extracts receipt details, checks policy compliance, detects duplicates, and processes payments.
5. **Customer Complaint**: Scores severity, calculates SLA clock, drafts compensation, and dispatches replacements.
6. **IT Equipment Request**: Validates asset eligibility, checks spare laptop inventory, and triggers procurement if stock is zero.
7. **Employee Onboarding**: Cross-department orchestration (HR Checklist → IT Provisioning → Account Creation → Access Setup → Welcome Package).
8. **Sales Discount Approval**: Evaluates tiered discount rules (0-5% Sales, 5-15% Mgr, 15-25% Finance, >25% Exec).
9. **Vendor Approval**: Validates tax registration, performs risk scoring, checks missing ISO certificates, and activates vendor master records.
10. **Service Request**: Classifies outages (e.g. Finance Network Outage), sets 4-hour SLA targets, and dispatches network engineers.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Express.js, TypeScript, REST API, Node.js
- **Database**: Embedded JSON/Relational Persistent Data Store pre-seeded with 100+ realistic enterprise records.
- **AI Service Layer**: Secure backend abstraction supporting **LIVE AI MODE** (Google Gemini API / OpenAI API) and fallback **DEMO MODE**.

---

## 📦 Getting Started & Running Locally

### 1. Install Dependencies
```bash
npm run install:all
```
*(Or install separately inside `/server` and `/client`)*

### 2. Start Local Development Server
```bash
npm run dev
```
- Backend API: `http://localhost:5000/api`
- Frontend UI: `http://localhost:3000`

---

## 🏆 Hackathon Judge Demo Instructions (2-Minute Presentation)

1. Open `http://localhost:3000`.
2. Click the green **"START JUDGE DEMO"** button in the top navbar.
3. Follow the guided interactive steps:
   - **Step 1**: Submits `"Find overdue invoices above ₹50,000 and recover the payments."`
   - **Step 2**: Highlights Human Approval pause for ₹2,40,000 outreach → Click **APPROVE**.
   - **Step 3**: Click **Inject Email Failure** → Watch AI Orchestrator re-plan to SMS/WhatsApp gateway (`WORKFLOW RE-PLANNED`).
   - **Step 4**: Click **Simulate Payment Settlement** → Watch state transition to `RESOLVED` & update audit log.
   - **Step 5**: Runs `"New employee joins next Monday."` to demonstrate cross-department onboarding.
   - **Step 6**: Runs `"Give ABC Corp a 20% discount."` to demonstrate tiered sales discount policies.
=======
# AI-Orchestrator
This is our final round hackathon project
>>>>>>> ac937732f981f83be2d728f0512e6c6f7e10b6bc
