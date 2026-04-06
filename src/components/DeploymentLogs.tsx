import { useState, useEffect } from "react";
import { fetchDeployments } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface DeploymentLogsProps {
  applicationId: string;
  projectName: string;
}

interface Deployment {
  deploymentId: string;
  status: string;
  title?: string;
  description?: string;
  createdAt: string;
}

export function DeploymentLogs({ applicationId, projectName }: DeploymentLogsProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeployments(applicationId)
      .then((data) => {
        setDeployments(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading deployments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-status-error font-mono text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Deployments — {projectName}
      </h4>
      {deployments.length === 0 ? (
        <p className="text-muted-foreground text-xs font-mono">No deployments found</p>
      ) : (
        deployments.slice(0, 20).map((d, i) => (
          <div
            key={d.deploymentId || i}
            className="flex items-start gap-2 py-2 px-2 rounded text-xs font-mono hover:bg-secondary/30"
          >
            {d.status === "done" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-status-success shrink-0 mt-0.5" />
            ) : d.status === "error" ? (
              <XCircle className="h-3.5 w-3.5 text-status-error shrink-0 mt-0.5" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-foreground">{d.title || d.description || "Deployment"}</span>
              <span className="text-muted-foreground ml-2">
                {new Date(d.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
