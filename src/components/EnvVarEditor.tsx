import { useState, useEffect } from "react";
import { fetchEnvVars, saveEnvVars } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";

interface EnvVarEditorProps {
  applicationId: string;
  projectName: string;
}

export function EnvVarEditor({ applicationId, projectName }: EnvVarEditorProps) {
  const [env, setEnv] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchEnvVars(applicationId)
      .then((data) => setEnv(data.env || ""))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveEnvVars(applicationId, env);
      toast.success(`Environment updated for ${projectName}`);
    } catch (e: any) {
      toast.error(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading environment...
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Environment — {projectName}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => setVisible(!visible)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-secondary text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {visible ? "Hide" : "Show"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            Save
          </button>
        </div>
      </div>
      <textarea
        value={visible ? env : env.replace(/=.*/g, "=••••••")}
        onChange={(e) => {
          if (visible) setEnv(e.target.value);
        }}
        readOnly={!visible}
        className="w-full h-48 bg-background border rounded-lg p-3 text-xs font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
        placeholder="KEY=value&#10;ANOTHER_KEY=value"
      />
    </div>
  );
}
