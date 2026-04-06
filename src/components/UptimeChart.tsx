import { useState, useEffect } from "react";
import { fetchUptime } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface UptimeChartProps {
  projectName?: string;
}

interface UptimeEntry {
  timestamp: string;
  projects: Array<{ name: string; health: string; responseTime?: number }>;
}

const healthColor: Record<string, string> = {
  live: "bg-status-success",
  running: "bg-status-running",
  degraded: "bg-accent",
  down: "bg-status-error",
  unknown: "bg-muted",
};

export function UptimeChart({ projectName }: UptimeChartProps) {
  const [entries, setEntries] = useState<UptimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUptime(1)
      .then((data) => setEntries(data.entries))
      .catch(() => {})
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetchUptime(1)
        .then((data) => setEntries(data.entries))
        .catch(() => {});
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading uptime...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-mono py-2">
        Uptime data will appear as the API collects health probes (every 30s)
      </p>
    );
  }

  // Get unique project names
  const projectNames = projectName
    ? [projectName]
    : [...new Set(entries.flatMap((e) => e.projects.map((p) => p.name)))];

  // Show last 60 entries (30min)
  const recentEntries = entries.slice(-60);

  return (
    <div className="space-y-2">
      {projectNames.map((name) => {
        const dots = recentEntries.map((e) => {
          const p = e.projects.find((p) => p.name === name);
          return p?.health || "unknown";
        });

        return (
          <div key={name} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground w-28 truncate shrink-0">
              {name}
            </span>
            <div className="flex gap-px flex-1">
              {dots.map((health, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-[1px] ${healthColor[health] || "bg-muted"}`}
                  title={`${recentEntries[i]?.timestamp}: ${health}`}
                />
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-muted-foreground font-mono">
        Last {recentEntries.length} probes ({Math.round(recentEntries.length * 0.5)}min)
      </p>
    </div>
  );
}
