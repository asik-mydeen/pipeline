export type DeploymentStatus = "done" | "error" | "building";
export type HttpStatus = "200" | "502" | "unreachable";

export interface Deployment {
  status: DeploymentStatus;
  duration: string;
  message: string;
  timestamp: string;
}

export interface GitHubAction {
  status: string;
  timestamp: string;
}

export interface Project {
  name: string;
  appName: string;
  domain: string;
  dokployStatus: DeploymentStatus;
  httpStatus: HttpStatus;
  httpCode?: number;
  deployments: Deployment[];
  githubActions: GitHubAction[];
}

export const projects: Project[] = [
  {
    name: "ship-mcp",
    appName: "ship-mcp",
    domain: "ship-mcp.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [
      { status: "done", duration: "7s", message: "feat: add ship_deploy_existing", timestamp: "2026-04-04T02:19:14Z" },
      { status: "done", duration: "1s", message: "docs: comprehensive MCP infrastructure guide", timestamp: "2026-04-03T18:28:08Z" },
      { status: "done", duration: "1s", message: "docs: comprehensive CLAUDE.md with all 13 tools", timestamp: "2026-04-03T07:03:28Z" },
      { status: "done", duration: "3s", message: "fix: fastify template wrap in async main()", timestamp: "2026-04-03T06:56:03Z" },
      { status: "done", duration: "3s", message: "fix: api() now throws on HTTP errors", timestamp: "2026-04-03T06:54:11Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-04T02:19:10Z" },
      { status: "success", timestamp: "2026-04-03T18:28:03Z" },
    ],
  },
  {
    name: "memory-mcp",
    appName: "memory-mcp",
    domain: "memory-mcp.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [
      { status: "done", duration: "5s", message: "fix: remove all silent defaults across cal", timestamp: "2026-04-04T09:32:05Z" },
      { status: "done", duration: "5s", message: "fix: food member param ask user if not clear", timestamp: "2026-04-04T05:56:13Z" },
      { status: "done", duration: "5s", message: "fix: food_log member description", timestamp: "2026-04-04T05:17:52Z" },
      { status: "done", duration: "5s", message: "fix: food tracks per family member by name", timestamp: "2026-04-03T18:28:05Z" },
      { status: "done", duration: "5s", message: "feat: shared AI service + rewrite food module", timestamp: "2026-04-03T07:03:28Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-04T09:32:05Z" },
      { status: "success", timestamp: "2026-04-04T05:56:13Z" },
    ],
  },
  {
    name: "life-mcp",
    appName: "life-mcp",
    domain: "life-mcp.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [
      { status: "done", duration: "4s", message: "docs: point to full infra guide", timestamp: "2026-04-03T18:28:05Z" },
      { status: "done", duration: "4s", message: "ci: deploy workflow", timestamp: "2026-04-03T18:04:05Z" },
      { status: "done", duration: "6s", message: "ci: deploy workflow", timestamp: "2026-04-03T07:03:28Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-03T18:28:05Z" },
      { status: "success", timestamp: "2026-04-03T18:04:05Z" },
    ],
  },
  {
    name: "resume-builder",
    appName: "resume-builder",
    domain: "resume-builder.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "200",
    httpCode: 200,
    deployments: [
      { status: "done", duration: "38s", message: "fix: move tailwindcss/postcss/autoprefixer to deps", timestamp: "2026-04-03T18:29:23Z" },
      { status: "done", duration: "37s", message: "Rebuild deployment", timestamp: "2026-04-03T18:15:39Z" },
      { status: "done", duration: "22s", message: "fix: move tailwindcss/postcss/autoprefixer to deps", timestamp: "2026-04-03T18:09:16Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-03T18:29:23Z" },
      { status: "success", timestamp: "2026-04-03T18:15:39Z" },
    ],
  },
  {
    name: "mindfulbites",
    appName: "mindfulbites",
    domain: "mindfulbites.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [
      { status: "done", duration: "24s", message: "fix: lazy-init OpenAI client to avoid build-time crash", timestamp: "2026-04-03T04:53:34Z" },
      { status: "error", duration: "14s", message: "fix: add dark background to page-level containers", timestamp: "2026-04-03T04:51:17Z" },
      { status: "error", duration: "17s", message: "Rebuild deployment", timestamp: "2026-04-03T04:44:30Z" },
      { status: "done", duration: "24s", message: "feat: rebrand to BiteBuddy + dark theme + DNS", timestamp: "2026-04-03T04:40:00Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-03T04:53:34Z" },
      { status: "success", timestamp: "2026-04-03T04:51:17Z" },
    ],
  },
  {
    name: "todo",
    appName: "todo",
    domain: "todo.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "200",
    httpCode: 200,
    deployments: [
      { status: "done", duration: "64s", message: "fix: remove Dockerfile, use Nixpacks with config", timestamp: "2026-04-02T19:31:12Z" },
      { status: "error", duration: "22s", message: "sec: scrub leaked keys from .env.example", timestamp: "2026-04-02T19:26:37Z" },
      { status: "error", duration: "22s", message: "fix: pass NEXT_PUBLIC env vars as Docker build args", timestamp: "2026-04-02T19:24:39Z" },
      { status: "error", duration: "30s", message: "fix: add Dockerfile for reliable builds", timestamp: "2026-04-02T19:20:00Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-02T19:31:12Z" },
      { status: "success", timestamp: "2026-04-02T19:26:37Z" },
    ],
  },
  {
    name: "ship-e2e-test",
    appName: "ship-e2e-test",
    domain: "ship-e2e-test.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "200",
    httpCode: 200,
    deployments: [
      { status: "done", duration: "6s", message: "feat: add /version endpoint", timestamp: "2026-04-02T19:04:57Z" },
      { status: "done", duration: "1s", message: "Rebuild deployment", timestamp: "2026-04-02T17:05:40Z" },
      { status: "done", duration: "4s", message: "ci: add GitHub Actions deploy workflow + Supabase", timestamp: "2026-04-02T16:55:00Z" },
    ],
    githubActions: [
      { status: "success", timestamp: "2026-04-02T19:04:57Z" },
      { status: "success", timestamp: "2026-04-02T17:05:40Z" },
    ],
  },
  {
    name: "car-racers",
    appName: "ffe",
    domain: "car-racers.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [
      { status: "done", duration: "0s", message: "Rebuild deployment", timestamp: "2026-04-02T16:00:00Z" },
      { status: "done", duration: "6s", message: "Merge PR #1 add-game feature", timestamp: "2026-04-02T15:50:00Z" },
      { status: "done", duration: "3s", message: "Add Dockerfile for Node.js and Nginx", timestamp: "2026-04-02T15:40:00Z" },
      { status: "error", duration: "0s", message: "Rebuild deployment", timestamp: "2026-04-02T15:30:00Z" },
    ],
    githubActions: [],
  },
  {
    name: "ollama",
    appName: "ollama",
    domain: "ollama.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "502",
    httpCode: 502,
    deployments: [
      { status: "done", duration: "87s", message: "Manual deployment", timestamp: "2026-04-02T12:00:00Z" },
    ],
    githubActions: [],
  },
  {
    name: "famcal",
    appName: "famcal",
    domain: "famcal.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [],
    githubActions: [],
  },
  {
    name: "ESPHome",
    appName: "esphome",
    domain: "esphome.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [],
    githubActions: [],
  },
  {
    name: "RuView",
    appName: "ruview",
    domain: "ruview.asikmydeen.com",
    dokployStatus: "done",
    httpStatus: "unreachable",
    deployments: [],
    githubActions: [],
  },
];
