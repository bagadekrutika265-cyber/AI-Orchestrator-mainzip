import { WorkflowInstance, AuditLogEntry, WorkflowTemplate, UnderstandingResult } from '../types';

const API_BASE = '/api';

export class ApiClient {
  public static async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'HEALTHY', mode: 'DEMO_MODE' };
    }
  }

  public static async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`);
      return await res.json();
    } catch {
      return [];
    }
  }

  public static async submitRequest(requestText: string, requesterId?: string): Promise<{ success: boolean; workflow: WorkflowInstance }> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestText, requesterId })
    });
    return await res.json();
  }

  public static async getWorkflows(): Promise<WorkflowInstance[]> {
    const res = await fetch(`${API_BASE}/workflows`);
    return await res.json();
  }

  public static async getWorkflow(id: string): Promise<WorkflowInstance> {
    const res = await fetch(`${API_BASE}/workflows/${id}`);
    return await res.json();
  }

  public static async approveWorkflow(id: string, approverName?: string, comments?: string) {
    const res = await fetch(`${API_BASE}/workflows/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverName, comments })
    });
    return await res.json();
  }

  public static async rejectWorkflow(id: string, approverName?: string, reason?: string) {
    const res = await fetch(`${API_BASE}/workflows/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverName, reason })
    });
    return await res.json();
  }

  public static async simulateEvent(workflowId?: string, eventType?: string) {
    const res = await fetch(`${API_BASE}/simulate/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId, eventType })
    });
    return await res.json();
  }

  public static async getAuditLogs(workflowId?: string): Promise<AuditLogEntry[]> {
    const url = workflowId ? `${API_BASE}/audit?workflowId=${workflowId}` : `${API_BASE}/audit`;
    const res = await fetch(url);
    return await res.json();
  }

  public static async getTemplates(): Promise<WorkflowTemplate[]> {
    const res = await fetch(`${API_BASE}/templates`);
    return await res.json();
  }

  public static async understandRequest(requestText: string): Promise<UnderstandingResult> {
    const res = await fetch(`${API_BASE}/ai/understand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestText })
    });
    return await res.json();
  }

  public static async runWhatIf(question: string) {
    const res = await fetch(`${API_BASE}/ai/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    return await res.json();
  }

  public static async runDigitalTwin(workflowName: string) {
    const res = await fetch(`${API_BASE}/ai/digital-twin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowName })
    });
    return await res.json();
  }

  public static async getDataSources() {
    const res = await fetch(`${API_BASE}/datasources`);
    return await res.json();
  }

  public static async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return await res.json();
  }
}
