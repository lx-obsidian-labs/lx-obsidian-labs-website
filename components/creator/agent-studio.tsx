"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, FileCode2, FileText, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlanResult = {
  summary: string;
  steps: string[];
  suggestedMode: "web" | "docs" | "consult" | "mixed";
};

type ChatMessage = {
  role: "user" | "agent";
  text: string;
  at: string;
};

type ProjectCard = {
  id: string;
  type: string;
  title: string;
  updatedAt: string;
};

type AgentOutput = {
  mode: string;
  projectId?: string;
  title?: string;
};

type AgentMode = "web" | "docs" | "consult";
type AgentFailure = { mode: AgentMode; error: string };

const promptPresets = [
  "Build a high-conversion agency website with service pages and clear CTAs.",
  "Create a client proposal document for an automation implementation project.",
  "Plan a business process improvement roadmap for operations and reporting.",
  "Generate website and proposal outputs for a new product launch campaign.",
];

export function AgentStudio() {
  const [objective, setObjective] = useState("");
  const [workspaceType, setWorkspaceType] = useState<"web" | "docs" | "consult" | "mixed">("mixed");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [outputs, setOutputs] = useState<AgentOutput[]>([]);
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [failures, setFailures] = useState<AgentFailure[]>([]);
  const [companyName, setCompanyName] = useState("LX Obsidian Labs Client");
  const [audience, setAudience] = useState("business decision makers");
  const [depth, setDepth] = useState<"quick" | "standard" | "deep">("standard");
  const [forcedModes, setForcedModes] = useState<AgentMode[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const res = await fetch("/api/creator/projects", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { projects?: ProjectCard[]; error?: string } | null;
      if (!res.ok) {
        if ((data?.error || "").toLowerCase().includes("persistence is not configured")) {
          setStatus("Persistence is disabled. Agent can still generate outputs in transient mode.");
          return;
        }
        setError(data?.error || "Unable to load creator projects.");
        return;
      }
      if (res.ok && data?.projects) {
        setProjects(data.projects);
      }
    }

    void loadProjects();
  }, []);

  const progress = useMemo(() => {
    if (!completed.length) return 0;
    const done = completed.filter(Boolean).length;
    return Math.round((done / completed.length) * 100);
  }, [completed]);

  const runAgent = async () => {
    setLoading(true);
    setError("");
    setStatus("Planning execution steps...");
    try {
      const userMsg: ChatMessage = { role: "user", text: objective, at: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);

      const response = await fetch("/api/creator/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, workspaceType }),
      });

      const data = (await response.json().catch(() => null)) as PlanResult | { error?: string } | null;
      if (!response.ok || !data || ("error" in data && typeof data.error === "string")) {
        throw new Error((data as { error?: string } | null)?.error || "Agent run failed");
      }

      const result = data as PlanResult;
      setPlan(result);
      setCompleted(new Array(result.steps.length).fill(false));
      setOutputs([]);
      setLogs([]);
      setFailures([]);
      setMessages((prev) => [...prev, { role: "agent", text: result.summary, at: new Date().toISOString() }]);
      setStatus("Plan ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent run failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const runAndBuild = async () => {
    if (!objective.trim()) return;
    setLoading(true);
    setError("");
    setOutputs([]);
    setLogs([]);
    setFailures([]);
    setStatus("Planning and generating outputs...");
    try {
      const userMsg: ChatMessage = { role: "user", text: objective, at: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);

      const response = await fetch("/api/creator/agent/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, workspaceType, companyName, audience, depth, forcedModes }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; plan?: PlanResult; outputs?: AgentOutput[]; logs?: string[]; failures?: AgentFailure[]; ok?: boolean }
        | null;

      if (!response.ok || !data || data.error || !data.plan) {
        throw new Error(data?.error || "Agent build failed");
      }

      const planResult = data.plan;
      setPlan(planResult);
      setCompleted(new Array(planResult.steps.length).fill(false));
      setOutputs(data.outputs || []);
      setLogs(data.logs || []);
      setFailures(data.failures || []);
      setStatus("Outputs created. Review and continue editing in Projects.");

      const built = data.outputs?.length
        ? data.outputs
            .map((item) => `${item.mode}${item.projectId ? ` (${item.projectId.slice(0, 8)})` : ""}`)
            .join(", ")
        : "no outputs";

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `${planResult.summary} Built: ${built}.${data.failures?.length ? ` Failures: ${data.failures.map((f) => f.mode).join(", ")}.` : ""}`,
          at: new Date().toISOString(),
        },
      ]);

      const refresh = await fetch("/api/creator/projects", { cache: "no-store" });
      const refreshData = (await refresh.json().catch(() => null)) as { projects?: ProjectCard[] } | null;
      if (refresh.ok && refreshData?.projects) setProjects(refreshData.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent build failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const executeWeb = async () => {
    if (!objective.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/web/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: objective, style: "clean and conversion-focused" }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; projectId?: string; output?: { projectName?: string } } | null;
      if (!res.ok) throw new Error(data?.error || "Web plan generation failed");

      const refresh = await fetch("/api/creator/projects", { cache: "no-store" });
      const refreshData = (await refresh.json().catch(() => null)) as { projects?: ProjectCard[] } | null;
      if (refresh.ok && refreshData?.projects) setProjects(refreshData.projects);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `Web output generated and saved${data?.projectId ? ` (project ${data.projectId.slice(0, 8)}).` : "."}`,
          at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Web execution failed.");
    } finally {
      setLoading(false);
    }
  };

  const executeDocs = async () => {
    if (!objective.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/docs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: "proposal", companyName: "LX Obsidian Labs Client", goal: objective }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; projectId?: string; output?: { title?: string } } | null;
      if (!res.ok) throw new Error(data?.error || "Document generation failed");

      const refresh = await fetch("/api/creator/projects", { cache: "no-store" });
      const refreshData = (await refresh.json().catch(() => null)) as { projects?: ProjectCard[] } | null;
      if (refresh.ok && refreshData?.projects) setProjects(refreshData.projects);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `Document output generated and saved${data?.projectId ? ` (project ${data.projectId.slice(0, 8)}).` : "."}`,
          at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document execution failed.");
    } finally {
      setLoading(false);
    }
  };

  const checkpoint = () => {
    void (async () => {
      setError("");
      const save = await fetch("/api/creator/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Agent Checkpoint",
          type: "consult",
          description: "Agent checkpoint snapshot",
          payload: {
            objective,
            workspaceType,
            plan,
            messages,
            progress,
          },
        }),
      });

      const saveData = (await save.json().catch(() => null)) as { error?: string } | null;
      if (!save.ok) {
        setError(saveData?.error || "Unable to save checkpoint.");
        return;
      }

      const refresh = await fetch("/api/creator/projects", { cache: "no-store" });
      const refreshData = (await refresh.json().catch(() => null)) as { projects?: ProjectCard[] } | null;
      if (refresh.ok && refreshData?.projects) setProjects(refreshData.projects);
      setMessages((prev) => [...prev, { role: "agent", text: "Checkpoint saved to Projects.", at: new Date().toISOString() }]);
    })();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="space-y-4 rounded-xl border bg-white p-4 lg:col-span-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Agent Chat</p>
        <textarea
          rows={4}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Describe what the agent should build..."
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
        <div className="rounded-md border bg-surface p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Prompt Presets</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {promptPresets.map((preset, index) => (
              <button
                key={preset}
                type="button"
                onClick={() => setObjective(preset)}
                className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-[#111111] transition hover:border-accent hover:text-accent"
                title={preset}
              >
                Template {index + 1}
              </button>
            ))}
          </div>
        </div>
        <select className="h-10 w-full rounded-md border px-3 text-sm" value={workspaceType} onChange={(e) => setWorkspaceType(e.target.value as "web" | "docs" | "consult" | "mixed") }>
          <option value="mixed">Mixed</option>
          <option value="web">Web</option>
          <option value="docs">Docs</option>
          <option value="consult">Consult</option>
        </select>
        <input
          className="h-10 w-full rounded-md border px-3 text-sm"
          placeholder="Company / client name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          className="h-10 w-full rounded-md border px-3 text-sm"
          placeholder="Target audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
        <select className="h-10 w-full rounded-md border px-3 text-sm" value={depth} onChange={(e) => setDepth(e.target.value as "quick" | "standard" | "deep") }>
          <option value="quick">Quick output</option>
          <option value="standard">Standard output</option>
          <option value="deep">Deep output</option>
        </select>
        <div className="rounded-md border bg-surface p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Output Targets (Optional)</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {(["web", "docs", "consult"] as AgentMode[]).map((mode) => {
              const active = forcedModes.includes(mode);
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    setForcedModes((prev) =>
                      prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode],
                    )
                  }
                  className={`rounded-full border px-3 py-1 font-semibold transition ${active ? "border-accent bg-accent text-white" : "bg-white text-[#111111] hover:border-accent hover:text-accent"}`}
                >
                  {mode.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={runAgent} className="w-full" disabled={loading || objective.trim().length < 8}>
            <Play className="mr-2 h-4 w-4" /> {loading ? "Running..." : "Plan Only"}
          </Button>
          <Button onClick={runAndBuild} className="w-full" disabled={loading || objective.trim().length < 8}>
            <Play className="mr-2 h-4 w-4" /> {loading ? "Building..." : "Run + Build"}
          </Button>
        </div>
        {status ? <p className="text-xs text-muted">{status}</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <div className="max-h-64 space-y-2 overflow-auto rounded-md border bg-surface p-3">
          {messages.length ? (
            messages.map((msg, idx) => (
              <div key={`${msg.at}-${idx}`} className={msg.role === "agent" ? "rounded-md bg-white p-2 text-xs" : "rounded-md bg-[#111111] p-2 text-xs text-white"}>
                <p className="font-semibold uppercase tracking-[0.12em]">{msg.role}</p>
                <p className="mt-1">{msg.text}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted">No messages yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-4 lg:col-span-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Execution Plan</p>
        {plan ? (
          <>
            <div className="rounded-md border bg-surface p-3 text-sm">
              <p className="font-semibold">{plan.summary}</p>
              <p className="mt-1 text-xs text-muted">Mode: {plan.suggestedMode}</p>
              <p className="mt-1 text-xs text-muted">Progress: {progress}%</p>
            </div>

            {outputs.length ? (
              <div className="rounded-md border bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Generated Outputs</p>
                <div className="mt-2 space-y-2">
                  {outputs.map((item, idx) => (
                    <div key={`${item.mode}-${item.projectId || idx}`} className="rounded-md border bg-surface p-2 text-xs">
                      <p className="font-semibold">{item.mode.toUpperCase()}: {item.title || "Untitled output"}</p>
                      {item.projectId ? (
                        <Link href={`/creator/projects/${item.projectId}`} className="mt-1 inline-block font-semibold text-accent hover:underline">
                          Open Project
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {logs.length ? (
              <div className="rounded-md border bg-surface p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Execution Log</p>
                <ul className="mt-2 space-y-1 text-xs text-muted">
                  {logs.map((log, idx) => (
                    <li key={`${log}-${idx}`}>- {log}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {failures.length ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-700">Partial Failures</p>
                <ul className="mt-2 space-y-1 text-xs text-red-700">
                  {failures.map((failure, idx) => (
                    <li key={`${failure.mode}-${idx}`}>- {failure.mode.toUpperCase()}: {failure.error}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="space-y-2">
              {plan.steps.map((step, index) => (
                <label key={step} className="flex items-start gap-2 rounded-md border p-2 text-sm">
                  <input
                    type="checkbox"
                    checked={completed[index] || false}
                    onChange={(e) => setCompleted((prev) => prev.map((v, i) => (i === index ? e.target.checked : v)))}
                  />
                  <span>{step}</span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Run the agent to generate a plan.</p>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={executeWeb} disabled={loading || !objective.trim()}>
            <FileCode2 className="mr-2 h-4 w-4" /> Build Web
          </Button>
          <Button variant="secondary" onClick={executeDocs} disabled={loading || !objective.trim()}>
            <FileText className="mr-2 h-4 w-4" /> Build Doc
          </Button>
          <Button onClick={checkpoint} className="sm:col-span-2" disabled={!plan}>
            <Save className="mr-2 h-4 w-4" /> Save Checkpoint
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-4 lg:col-span-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Workspace</p>
        <div className="space-y-2">
          {projects.slice(0, 6).map((project) => (
            <div key={project.id} className="rounded-md border p-3 text-sm">
              <p className="font-semibold">{project.title}</p>
              <p className="text-xs text-muted">{project.type} • {new Date(project.updatedAt).toLocaleString()}</p>
              <Link href={`/creator/projects/${project.id}`} className="mt-1 inline-block text-xs font-semibold text-accent hover:underline">
                Open
              </Link>
            </div>
          ))}
          {!projects.length ? <p className="text-sm text-muted">No saved projects yet.</p> : null}
        </div>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/creator/projects"><Bot className="mr-2 h-4 w-4" /> Open Full Project List</Link>
        </Button>
      </div>
    </div>
  );
}
