import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { PipelineHeader } from "@/components/PipelineHeader";

type Filter = "all" | "live" | "error" | "down";

export default function Index() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const lastUpdated = useMemo(() => new Date(), []);

  const filtered = useMemo(() => {
    let list = projects;
    if (filter === "live") list = list.filter((p) => p.httpStatus === "200");
    if (filter === "error") list = list.filter((p) => p.httpStatus === "502");
    if (filter === "down")
      list = list.filter((p) => p.httpStatus === "unreachable");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.appName.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "live", label: "Live" },
    { key: "error", label: "Errors" },
    { key: "down", label: "Down" },
  ];

  return (
    <div className="min-h-screen grid-bg">
      <PipelineHeader projects={projects} lastUpdated={lastUpdated} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  filter === f.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary/50 border rounded-lg px-3 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-full sm:w-64"
          />
        </div>

        {/* Projects */}
        <div className="space-y-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-mono text-sm">
              No projects match your filter
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
