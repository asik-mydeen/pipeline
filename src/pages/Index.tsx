import { useState, useMemo, useEffect } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { PipelineHeader } from "@/components/PipelineHeader";
import { UptimeChart } from "@/components/UptimeChart";
import { ResponseTimeChart } from "@/components/ResponseTimeChart";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { useProjectHealth } from "@/hooks/useProjectHealth";
import { fetchDokployProjects } from "@/lib/api";
import type { HealthStatus, Project } from "@/data/projects";

type Filter = "all" | "live" | "running" | "degraded" | "down";

export default function Index() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showUptime, setShowUptime] = useState(false);
  const { healthMap, lastPolled, isPolling, error } = useProjectHealth();
  const [appIdMap, setAppIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDokployProjects()
      .then((data: any) => {
        const map: Record<string, string> = {};
        if (Array.isArray(data)) {
          for (const project of data) {
            const envs = project.environments || [];
            for (const env of envs) {
              const apps = env.applications || [];
              for (const app of apps) {
                map[app.name || project.name] = app.applicationId;
                map[project.name] = app.applicationId;
              }
            }
            if (project.applications) {
              for (const app of project.applications) {
                map[app.name || project.name] = app.applicationId;
                map[project.name] = app.applicationId;
              }
            }
          }
        }
        setAppIdMap(map);
      })
      .catch(() => {});
  }, []);

  const liveProjects: Project[] = useMemo(() => {
    return projects.map((p) => {
      const live = healthMap[p.name];
      if (!live) return p;
      return {
        ...p,
        health: live.health as HealthStatus,
        httpCode: live.httpCode ?? p.httpCode,
      };
    });
  }, [healthMap]);

  const lastUpdated = lastPolled ?? new Date();

  const filtered = useMemo(() => {
    let list = liveProjects;
    if (filter !== "all") list = list.filter((p) => p.health === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.appName.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.serviceType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search, liveProjects]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "live", label: "Live" },
    { key: "running", label: "Running" },
    { key: "degraded", label: "Degraded" },
    { key: "down", label: "Down" },
  ];

  const getAppId = (project: Project) => {
    return appIdMap[project.appName] || appIdMap[project.name];
  };

  return (
    <div className="min-h-screen grid-bg">
      <PipelineHeader projects={liveProjects} lastUpdated={lastUpdated} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  filter === f.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search projects or type (web, mcp, service)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary/50 border rounded-lg px-3 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-full sm:w-80"
          />
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowUptime(!showUptime)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                showUptime
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Uptime
            </button>
            <CreateProjectDialog />
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              {isPolling && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                </span>
              )}
              {error && (
                <span className="text-status-error text-[10px]">\u26A0</span>
              )}
            </div>
          </div>
        </div>

        {showUptime && (
          <div className="mb-6 p-4 rounded-lg border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Uptime Monitor
            </h3>
            <UptimeChart />
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-foreground mb-2 font-mono">
                Response Time (ms)
              </h4>
              <ResponseTimeChart />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              applicationId={getAppId(project)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-mono text-sm">
              No projects match your filter
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
