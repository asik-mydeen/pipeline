import { cn } from "@/lib/utils";
import type { Deployment } from "@/data/projects";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface DeploymentTimelineProps {
  deployments: Deployment[];
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DeploymentTimeline({ deployments }: DeploymentTimelineProps) {
  if (deployments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground font-mono pl-4">
        No deployments recorded
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {deployments.map((d, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start gap-3 py-1.5 px-3 rounded-sm text-sm font-mono",
            "animate-fade-in-up",
            i === 0 && "bg-secondary/50"
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {d.status === "done" ? (
            <CheckCircle2 className="h-4 w-4 text-status-success mt-0.5 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-status-error mt-0.5 shrink-0" />
          )}
          <span className="text-muted-foreground shrink-0 w-12 text-right">
            {d.duration}
          </span>
          <span className="text-foreground truncate flex-1">{d.message}</span>
          <span className="text-muted-foreground shrink-0 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(d.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
