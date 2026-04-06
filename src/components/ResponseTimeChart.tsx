import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchUptime } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface UptimeEntry {
  timestamp: string;
  projects: Array<{ name: string; health: string; responseTime?: number }>;
}

interface Props {
  projectName?: string;
  hours?: number;
}

const COLORS = [
  "hsl(142, 71%, 45%)",
  "hsl(210, 100%, 56%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 70%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(190, 80%, 50%)",
  "hsl(320, 70%, 55%)",
  "hsl(60, 80%, 50%)",
];

export function ResponseTimeChart({ projectName, hours = 1 }: Props) {
  const [entries, setEntries] = useState<UptimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUptime(hours)
      .then((data) => setEntries(data.entries))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hours]);

  const { chartData, projectNames } = useMemo(() => {
    const names = projectName
      ? [projectName]
      : [...new Set(entries.flatMap((e) => e.projects.filter((p) => p.responseTime != null).map((p) => p.name)))];

    const recent = entries.slice(-120);
    const data = recent.map((e) => {
      const point: Record<string, number | string> = {
        time: new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      for (const name of names) {
        const p = e.projects.find((pr) => pr.name === name);
        if (p?.responseTime != null) {
          point[name] = p.responseTime;
        }
      }
      return point;
    });

    return { chartData: data, projectNames: names };
  }, [entries, projectName]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading response times...
      </div>
    );
  }

  if (chartData.length === 0 || projectNames.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-mono py-4">
        Response time data will appear as the API collects health probes
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(240, 10%, 16%)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(240, 10%, 16%)" }}
              unit="ms"
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(240, 12%, 8%)",
                border: "1px solid hsl(240, 10%, 16%)",
                borderRadius: "8px",
                fontSize: "11px",
                fontFamily: "JetBrains Mono, monospace",
              }}
              labelStyle={{ color: "hsl(220, 15%, 85%)" }}
              itemStyle={{ color: "hsl(220, 15%, 75%)" }}
              formatter={(value: number) => [`${value}ms`, undefined]}
            />
            {projectNames.map((name, i) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1.5}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 px-1">
        {projectNames.map((name, i) => (
          <div key={name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-[10px] font-mono text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
