import { useState } from "react";
import { cn } from "@/lib/utils";
import { triggerRedeploy, deleteProject } from "@/lib/api";
import { toast } from "sonner";
import {
  RotateCw,
  Trash2,
  Terminal,
  Globe,
  Key,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectActionsProps {
  applicationId?: string;
  projectName: string;
  onViewLogs?: () => void;
  onViewEnv?: () => void;
  onViewDomains?: () => void;
}

export function ProjectActions({
  applicationId,
  projectName,
  onViewLogs,
  onViewEnv,
  onViewDomains,
}: ProjectActionsProps) {
  const [redeploying, setRedeploying] = useState(false);
  const [destroying, setDestroying] = useState(false);

  const handleRedeploy = async () => {
    if (!applicationId) {
      toast.error("No application ID found for this project");
      return;
    }
    setRedeploying(true);
    try {
      await triggerRedeploy(applicationId);
      toast.success(`Redeploying ${projectName}...`);
    } catch (e: any) {
      toast.error(`Redeploy failed: ${e.message}`);
    } finally {
      setRedeploying(false);
    }
  };

  const handleDestroy = async () => {
    if (!applicationId) return;
    setDestroying(true);
    try {
      await deleteProject(applicationId);
      toast.success(`${projectName} destroyed`);
    } catch (e: any) {
      toast.error(`Destroy failed: ${e.message}`);
    } finally {
      setDestroying(false);
    }
  };

  const btnClass =
    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleRedeploy}
        disabled={redeploying || !applicationId}
        className={cn(
          btnClass,
          "bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
        )}
      >
        {redeploying ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RotateCw className="h-3.5 w-3.5" />
        )}
        Redeploy
      </button>

      {onViewLogs && (
        <button onClick={onViewLogs} className={cn(btnClass, "bg-secondary text-foreground hover:bg-secondary/80")}>
          <Terminal className="h-3.5 w-3.5" />
          Logs
        </button>
      )}

      {onViewEnv && (
        <button onClick={onViewEnv} className={cn(btnClass, "bg-secondary text-foreground hover:bg-secondary/80")}>
          <Key className="h-3.5 w-3.5" />
          Env
        </button>
      )}

      {onViewDomains && (
        <button onClick={onViewDomains} className={cn(btnClass, "bg-secondary text-foreground hover:bg-secondary/80")}>
          <Globe className="h-3.5 w-3.5" />
          Domains
        </button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            disabled={!applicationId || destroying}
            className={cn(
              btnClass,
              "bg-status-error/10 text-status-error hover:bg-status-error/20 disabled:opacity-50"
            )}
          >
            {destroying ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Destroy
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Destroy {projectName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the application from Dokploy. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDestroy}
              className="bg-destructive text-destructive-foreground"
            >
              Yes, destroy it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
