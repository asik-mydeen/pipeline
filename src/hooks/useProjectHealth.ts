import { useState, useEffect, useCallback } from "react";
import type { HealthStatus } from "@/data/projects";

const HEALTH_API = "https://pipeline-api.asikmydeen.com/api/health";
const POLL_INTERVAL = 30_000; // 30 seconds

interface HealthResult {
  name: string;
  domain: string;
  serviceType: string;
  health: HealthStatus;
  httpCode?: number;
}

interface HealthResponse {
  timestamp: string;
  projects: HealthResult[];
}

export function useProjectHealth() {
  const [healthMap, setHealthMap] = useState<Record<string, HealthResult>>({});
  const [lastPolled, setLastPolled] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setIsPolling(true);
    try {
      const res = await fetch(HEALTH_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthResponse = await res.json();
      const map: Record<string, HealthResult> = {};
      for (const p of data.projects) {
        map[p.name] = p;
      }
      setHealthMap(map);
      setLastPolled(new Date(data.timestamp));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch health");
    } finally {
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return { healthMap, lastPolled, isPolling, error, refetch: fetchHealth };
}
