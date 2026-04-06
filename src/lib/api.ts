const API_BASE = "https://pipeline-api.asikmydeen.com";

async function api<T = any>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API ${res.status}`);
  }
  return res.json();
}

// Health
export const fetchHealth = () => api<{
  timestamp: string;
  projects: Array<{
    name: string;
    domain: string;
    serviceType: string;
    health: string;
    httpCode?: number;
    responseTime?: number;
  }>;
}>("/api/health");

// Uptime
export const fetchUptime = (hours = 1) =>
  api<{ entries: Array<{ timestamp: string; projects: Array<{ name: string; health: string; responseTime?: number }> }>; count: number }>(
    `/api/uptime?hours=${hours}`
  );

export const fetchUptimeForProject = (name: string, hours = 24) =>
  api<{ name: string; entries: Array<{ timestamp: string; health: string; responseTime?: number }>; count: number }>(
    `/api/uptime/${encodeURIComponent(name)}?hours=${hours}`
  );

// Dokploy projects
export const fetchDokployProjects = () => api("/api/projects");

// Redeploy
export const triggerRedeploy = (applicationId: string) =>
  api("/api/redeploy", {
    method: "POST",
    body: JSON.stringify({ applicationId }),
  });

// Deployments
export const fetchDeployments = (appId: string) => api(`/api/deployments/${appId}`);

// Env vars
export const fetchEnvVars = (appId: string) => api<{ env: string }>(`/api/env/${appId}`);
export const saveEnvVars = (appId: string, env: string) =>
  api(`/api/env/${appId}`, { method: "POST", body: JSON.stringify({ env }) });

// Create project
export const createProject = (name: string, description?: string) =>
  api("/api/project/create", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

// Delete project
export const deleteProject = (appId: string) =>
  api(`/api/project/${appId}`, { method: "DELETE" });

// Add domain
export const addDomain = (appId: string, host: string, port = 3000) =>
  api(`/api/domains/${appId}`, {
    method: "POST",
    body: JSON.stringify({ host, port }),
  });

// Notifications
export const sendNotification = (title: string, message: string, priority = 3) =>
  api("/api/notify", {
    method: "POST",
    body: JSON.stringify({ title, message, priority }),
  });

// GitHub repos
export const fetchGitHubRepos = () => api("/api/github/repos");
