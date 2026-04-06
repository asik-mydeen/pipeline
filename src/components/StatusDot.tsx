import { cn } from "@/lib/utils";
import type { HttpStatus } from "@/data/projects";

interface StatusDotProps {
  status: HttpStatus;
  size?: "sm" | "md" | "lg";
}

const statusStyles: Record<HttpStatus, string> = {
  "200": "bg-status-success shadow-[var(--glow-green)]",
  "502": "bg-status-error shadow-[var(--glow-red)]",
  "unreachable": "bg-status-unreachable",
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
        status === "200" && "animate-pulse-dot"
      )}
    />
  );
}
