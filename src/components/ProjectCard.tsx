import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Project, ServiceType } from "@/data/projects";
import { StatusDot } from "./StatusDot";
import { DeploymentTimeline } from "./DeploymentTimeline";
import { ProjectActions } from "./ProjectActions";
import { DeploymentLogs } from "./DeploymentLogs";
import { EnvVarEditor } from "./EnvVarEditor";
import {
  ChevronDown,
  ExternalLink,
  GitBranch,
  Globe,
  Server,
  Cpu,
  Radio,
  Monitor,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
  applicationId?: string;
}

const healthLabel: Record<string, string> = {
  live: "LIVE",
  running: "RUNNING",
  degraded: "DEGRADED",
  down: "DOWN",
  unknown: "UNKNOWN",
};

const healthColor: Record<string, string> = {
  live: "bg-status-success/15 text-status-success",
  running: "bg-status-running/15 text-status-running",
  degraded: "bg-status-error/15 text-status-error",
  down: "bg-status-error/10 text-status-error",
  unknown: "bg-muted text-muted-foreground",
};

const typeIcon: Record<ServiceType, typeof Monitor> = {
  web: Monitor,
  mcp: Cpu,
  service: Server,
  iot: Radio,
};

const typeLabel: Record<ServiceType, string> = {
  web: "Web",
  mcp: "MCP",
  service: "Service",
  iot: "IoT",
};

type Tab = "deploys" | "logs" | "env";

export function ProjectCard({ project, index, applicationId }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("deploys");
  const errorCount = project.deployments.filter((d) => d.status === "error").length;
  const TypeIcon = typeIcon[project.serviceType];

  const tabs: { key: Tab; label: string }[] = [
    { key: "deploys", label: "Deployments" },
    { key: "logs", label: "Live Logs" },
    { key: "env", label: "Environment" },
  ];

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-all duration-300",
        "animate-fade-in-up hover:border-muted-foreground/30",
        project.health === "live" && "border-status-success/20",
        project.health === "running" && "border-status-running/20",
        project.health === "degraded" && "border-status-error/20"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusDot status={project.health} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {project.name}
              </h3>
              {project.appName !== project.name && (
                <span className="text-xs text-muted-foreground font-mono">
                  ({project.appName})
                </span>
              )}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-secondary">
                <TypeIcon className="h-2.5 w-2.5" />
                {typeLabel[project.serviceType]}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {project.domain}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full font-semibold",
                healthColor[project.health]
              )}
            >
              {healthLabel[project.health]}
            </span>
            {errorCount > 0 && (
              <span className="text-status-error">{errorCount} err</span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              <Server className="h-3 w-3" />
              {project.deployments.length}
            </span>
            {project.githubActions.length > 0 && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                {project.githubActions.length}
              </span>
            )}
          </div>

          {project.health === "live" && (
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t">
          {/* Actions bar */}
          <div className="px-4 py-3 bg-secondary/10 border-b">
            <ProjectActions
              applicationId={applicationId}
              projectName={project.name}
              onViewLogs={() => setActiveTab("logs")}
              onViewEnv={() => setActiveTab("env")}
            />
          </div>

          {/* Tab bar */}
          <div className="px-4 pt-2 flex gap-1 border-b">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono rounded-t-md transition-colors -mb-px",
                  activeTab === t.key
                    ? "bg-card border border-b-transparent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-4 py-3 bg-secondary/20">
            {activeTab === "deploys" && (
              <>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Deployment History (cached)
                </h4>
                <DeploymentTimeline deployments={project.deployments} />
              </>
            )}
            {activeTab === "logs" && applicationId && (
              <DeploymentLogs
                applicationId={applicationId}
                projectName={project.name}
              />
            )}
            {activeTab === "logs" && !applicationId && (
              <p className="text-xs font-mono text-muted-foreground py-4">
                Dokploy application ID not available. Configure DOKPLOY_TOKEN on pipeline-api.
              </p>
            )}
            {activeTab === "env" && applicationId && (
              <EnvVarEditor
                applicationId={applicationId}
                projectName={project.name}
              />
            )}
            {activeTab === "env" && !applicationId && (
              <p className="text-xs font-mono text-muted-foreground py-4">
                Dokploy application ID not available. Configure DOKPLOY_TOKEN on pipeline-api.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
