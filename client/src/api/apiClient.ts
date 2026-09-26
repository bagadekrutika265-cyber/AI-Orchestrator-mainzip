import { WorkflowInstance, AuditLogEntry, WorkflowTemplate, UnderstandingResult } from '../types';

const API_BASE = '/api';

export class ApiClient {
  public static async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { credentials: 'include' });
      return await res.json();
    } catch {
      return { status: 'HEALTHY', mode: 'DEMO_MODE' };
    }
  }

  public static async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`, { credentials: 'include' });
      return await res.json();
    } catch {
      return [];
    }
  }

  public static async submitRequest(requestText: string, requesterId?: string, language = 'en'): Promise<{ success: boolean; workflow: WorkflowInstance }> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ requestText, requesterId, language })
    });
    return await res.json();
  }

  public static async getWorkflows(): Promise<WorkflowInstance[]> {
    const res = await fetch(`${API_BASE}/workflows`, { credentials: 'include' });
    return await res.json();
  }

  public static async getWorkflow(id: string): Promise<WorkflowInstance> {
    const res = await fetch(`${API_BASE}/workflows/${id}`, { credentials: 'include' });
    return await res.json();
  }

  public static async approveWorkflow(id: string, approverName?: string, comments?: string) {
    const res = await fetch(`${API_BASE}/workflows/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ approverName, comments })
    });
    return await res.json();
  }

  public static async rejectWorkflow(id: string, approverName?: string, reason?: string) {
    const res = await fetch(`${API_BASE}/workflows/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ approverName, reason })
    });
    return await res.json();
  }

  public static async simulateEvent(workflowId?: string, eventType?: string) {
    const res = await fetch(`${API_BASE}/simulate/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workflowId, eventType })
    });
    return await res.json();
  }

  public static async getAuditLogs(workflowId?: string): Promise<AuditLogEntry[]> {
    const url = workflowId ? `${API_BASE}/audit?workflowId=${workflowId}` : `${API_BASE}/audit`;
    const res = await fetch(url, { credentials: 'include' });
    return await res.json();
  }

  public static async getTemplates(): Promise<WorkflowTemplate[]> {
    const res = await fetch(`${API_BASE}/templates`);
    return await res.json();
  }

  public static async understandRequest(requestText: string, language = 'en'): Promise<UnderstandingResult> {
    const res = await fetch(`${API_BASE}/ai/understand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ requestText, language })
    });
    return await res.json();
  }

  public static async runWhatIf(question: string, language = 'en') {
    const res = await fetch(`${API_BASE}/ai/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ question, language })
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
    const res = await fetch(`${API_BASE}/datasources`, { credentials: 'include' });
    return await res.json();
  }

  public static async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`, { credentials: 'include' });
    return await res.json();
  }

  public static async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    return (await res.json()).user;
  }

  public static async login(username: string, password: string, role: string, rememberMe: boolean) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password, role, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unable to sign in.');
    return data;
  }

  public static async googleDemoLogin() {
    const res = await fetch(`${API_BASE}/auth/google-demo`, { method: 'POST', credentials: 'include' });
    return await res.json();
  }

  public static async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    return await res.json();
  }

  public static async forgotPassword(username: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unable to generate a reset link.');
    return data;
  }

  public static async resetPassword(token: string, password: string, confirmPassword: string) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unable to reset password.');
    return data;
  }

  public static async updateLanguage(language: string) {
    const res = await fetch(`${API_BASE}/auth/preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ language }),
    });
    return await res.json();
  }
}
