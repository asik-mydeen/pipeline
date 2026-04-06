import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/data/projects";

interface StatusDotProps {
  status: HealthStatus;
  size?: "sm" | "md" | "lg";
}

const statusStyles: Record<HealthStatus, string> = {
  live: "bg-status-success shadow-[var(--glow-green)]",
  running: "bg-status-running shadow-[var(--glow-blue)]",
  degraded: "bg-status-error shadow-[var(--glow-red)]",
  down: "bg-status-error",
  unknown: "bg-status-unreachable",
};

const sizeStyles = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        sizeStyles[size],
        statusStyles[status],
        (status === "live" || status === "running") && "animate-pulse-dot"
      )}
    />
  );
}
