import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";
import { StatusDot } from "./StatusDot";
import { DeploymentTimeline } from "./DeploymentTimeline";
import { ChevronDown, ExternalLink, GitBranch, Globe, Server } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function httpLabel(status: string): string {
  if (status === "200") return "LIVE";
  if (status === "502") return "502";
  return "DOWN";
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const errorCount = project.deployments.filter((d) => d.status === "error").length;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-all duration-300",
        "animate-fade-in-up hover:border-muted-foreground/30",
        project.httpStatus === "200" && "border-status-success/20",
        project.httpStatus === "502" && "border-status-error/20"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusDot status={project.httpStatus} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
              {project.appName !== project.name && (
                <span className="text-xs text-muted-foreground font-mono">({project.appName})</span>
              )}
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
                project.httpStatus === "200" && "bg-status-success/15 text-status-success",
                project.httpStatus === "502" && "bg-status-error/15 text-status-error",
                project.httpStatus === "unreachable" && "bg-muted text-muted-foreground"
              )}
            >
              {httpLabel(project.httpStatus)}
            </span>
            {errorCount > 0 && <span className="text-status-error">{errorCount} err</span>}
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

          {project.httpStatus === "200" && (
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
        <div className="border-t px-4 py-3 bg-secondary/20">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Deployment History
          </h4>
          <DeploymentTimeline deployments={project.deployments} />
        </div>
      )}
    </div>
  );
}
