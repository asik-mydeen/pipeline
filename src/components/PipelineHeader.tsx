import type { Project } from "@/data/projects";
import { Activity, CheckCircle2, Cpu, AlertTriangle, XCircle } from "lucide-react";

interface PipelineHeaderProps {
  projects: Project[];
  lastUpdated: Date;
}

export function PipelineHeader({ projects, lastUpdated }: PipelineHeaderProps) {
  const live = projects.filter((p) => p.health === "live").length;
  const running = projects.filter((p) => p.health === "running").length;
  const degraded = projects.filter((p) => p.health === "degraded").length;
  const down = projects.filter((p) => p.health === "down").length;
  const totalDeploys = projects.reduce((sum, p) => sum + p.deployments.length, 0);

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Pipeline Control</h1>
              <p className="text-xs text-muted-foreground font-mono">asikmydeen.com infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-status-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{live} live</span>
            </div>
            <div className="flex items-center gap-1.5 text-status-running">
              <Cpu className="h-3.5 w-3.5" />
              <span>{running} running</span>
            </div>
            {degraded > 0 && (
              <div className="flex items-center gap-1.5 text-accent">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{degraded} degraded</span>
              </div>
            )}
            {down > 0 && (
              <div className="flex items-center gap-1.5 text-status-error">
                <XCircle className="h-3.5 w-3.5" />
                <span>{down} down</span>
              </div>
            )}
            <div className="h-4 w-px bg-border" />
            <span className="text-muted-foreground">{totalDeploys} deploys</span>
            <div className="h-4 w-px bg-border" />
            <span className="text-muted-foreground">{lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
