import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tier = "GREEN" | "AMBER" | "RED";
type CouncilSeat = "saltbox" | "smith" | "systems" | "community" | "codetry" | "ishmael";

interface StoredTask {
  id: string;
  title: string;
  description?: string;
  status: "proposed" | "pending" | "cleared";
}

interface ClassifiedTask extends StoredTask {
  tier: Tier;
  rule: string;
  reasoning: string;
  councilSeat?: CouncilSeat;
  themeCluster?: string;
  hardGuardrail?: boolean;
  overrideTier?: Tier;
  greenSignalsIgnored?: string[];
}

interface TriageResult {
  tasks: ClassifiedTask[];
  summary: { green: number; amber: number; red: number; total: number };
  amberGroups: Record<string, { tasks: ClassifiedTask[]; count: number }>;
}

interface ConstellationProject {
  id: string;
  label: string;
  baseUrl: string;
  token: string;
}

interface ConstellationSection {
  project: ConstellationProject;
  tasks: StoredTask[];
  triaged: TriageResult | null;
  loading: boolean;
  error: string | null;
  pendingIds: Set<string>;
  pulledAt?: number;
}

// Council seat display metadata
const SEAT_META: Record<CouncilSeat, { icon: string; color: string; name: string }> = {
  saltbox:   { icon: "⊡", color: "#8A6A1A", name: "Saltbox" },
  smith:     { icon: "⚒", color: "#5C3D2E", name: "Smith" },
  systems:   { icon: "⟳", color: "#059669", name: "Systems" },
  community: { icon: "⌂", color: "#D97706", name: "Community" },
  codetry:   { icon: "☷", color: "#7C3AED", name: "Codetry" },
  ishmael:   { icon: "🐋", color: "#0369A1", name: "Ishmael" },
};

// Maps autopilot seat names to KitchenTable page seat IDs
const SEAT_ID_MAP: Record<CouncilSeat, string> = {
  saltbox:   "saltbox",
  smith:     "grok",
  systems:   "systems",
  community: "community-econ",
  codetry:   "codetry",
  ishmael:   "ishmael",
};

const TIER_COLOR: Record<Tier, { bg: string; border: string; badge: string; text: string; dot: string }> = {
  GREEN: { bg: "#0D2010", border: "#1A4020", badge: "#16A34A", text: "#4ADE80", dot: "#22C55E" },
  AMBER: { bg: "#1E1200", border: "#3D2800", badge: "#D97706", text: "#FCD34D", dot: "#F59E0B" },
  RED:   { bg: "#1E0A0A", border: "#3D1212", badge: "#DC2626", text: "#FCA5A5", dot: "#EF4444" },
};

const BASE_API = "/api";

const AQUIFER_DEFAULTS: ConstellationProject[] = [
  { id: "hw-north-star",    label: "North Star",                             baseUrl: "https://ourheadwaters.ca/north-star",          token: "" },
  { id: "hw-codetry-ship",  label: "Codetry Ship — Crew Manifest",           baseUrl: "https://ourheadwaters.ca",                     token: "" },
  { id: "hw-books",         label: "Headwaters Books",                       baseUrl: "https://ourheadwaters.ca/headwaters-books",    token: "" },
  { id: "hw-library",       label: "Northern Food Systems Research Library",  baseUrl: "https://ourheadwaters.ca/library",             token: "" },
  { id: "hw-learning",      label: "Headwaters Learning",                    baseUrl: "https://ourheadwaters.ca/headwaters-learning", token: "" },
  { id: "hw-print",         label: "Headwaters Print Marketing Suite",       baseUrl: "https://ourheadwaters.ca/print-marketing",     token: "" },
  { id: "hw-handbook",      label: "Headwaters Handbook",                    baseUrl: "https://ourheadwaters.ca/codetry-handbook",    token: "" },
];

// ── Green signal humaniser ────────────────────────────────────────────────────

const GREEN_SIGNAL_LABELS: Record<string, string> = {
  "\\bfix\\b":                                          "fix",
  "\\bbug\\b":                                          "bug",
  "\\bcrash\\b":                                        "crash",
  "\\berror\\b":                                        "error",
  "\\brefactor\\b":                                     "refactor",
  "\\bclean.?up\\b":                                    "clean up",
  "\\bformat\\b":                                       "format",
  "\\brename\\b":                                       "rename",
  "\\bresize\\b":                                       "resize",
  "\\bupdate.*(lib|package|dependency|version)\\b":     "update lib / package / dependency / version",
  "\\bcatch.*stale\\b":                                 "catch stale",
  "\\bcover.*flow\\b":                                  "cover flow",
  "\\bautomat(e|ic).*(test)\\b":                        "automate / automatic test",
  "\\bvisually.?(re.?check|inspect)\\b":                "visually re-check / inspect",
  "\\bcross.?link\\b":                                  "cross-link",
  "\\becho.*ethos\\b":                                  "echo ethos",
  "\\bmatch.*timeline\\b":                              "match timeline",
  "\\bsame.*export\\b":                                 "same export",
};

function humaniseGreenSignal(source: string): string {
  if (GREEN_SIGNAL_LABELS[source]) return GREEN_SIGNAL_LABELS[source];
  return source
    .replace(/\\b/g, "")
    .replace(/\.\*/g, " … ")
    .replace(/\.\?/g, "")
    .replace(/[\\()?|]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Sample backlog — seeded via import (enters real state machine) ─────────────
const SAMPLE_TASK_LINES = `Export the signed payback memo as a PDF the boards can file
Add a one-time addendum form so new Trigger B revenue lines can be added without rewriting the memo
Send the founder a weekly nudge to finish reviewing remaining costs
Cover the cost review flow with automated tests so it doesn't break silently
Catch other stale slide-position links scattered through the deck and pages
Show each People bucket's ~target % right inside cost review so edits stay anchored
Bring the Reinvestment slide in line with the new net-after-buckets framing
Resize the four reinvestment destinations to fit the ~$10.5k/mo that's actually free
Echo the Headwaters ethos into the Deer Lake deck (band council voice)
Lock Version A or Version B of the eagle prologue with the author
Show the eagle prologue once, then let returning visitors move straight to the content
Match the Brightside timeline to the active scenario
Add the same spreadsheet export to the Personal cash page
Give the founder one combined spreadsheet that covers every bucket at once
Side-by-side V2 vs V3 comparison view so the founder can show the trade-off live
Lock a full Phase-3 month-by-month cash schedule for V3 so the $6k reconciliation gap stops being a gut-feel rounding line
Lock the headline numbers in the Deer Lake store deck
Replace the TBD operating-system fee with a real Headwaters number
Visually re-check the research library after the corridor co-op rename
Cross-link Replication chapter from Compare and Contracts pages`;

// ── Helper to get auth header ─────────────────────────────────────────────────
function getOwnerToken(): string | null {
  try {
    return (
      window.localStorage.getItem("library.ownerToken") ||
      window.localStorage.getItem("ownerToken") ||
      null
    );
  } catch { return null; }
}

function ownerHeaders(): Record<string, string> {
  const token = getOwnerToken();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["x-library-owner-token"] = token;
  return h;
}

// ── TaskAutopilot ─────────────────────────────────────────────────────────────

interface TaskAutopilotProps {
  onOpenDeliberation?: (seatId: string, brief: string) => void;
  defaultOpen?: boolean;
}

export function TaskAutopilot({ onOpenDeliberation, defaultOpen = false }: TaskAutopilotProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [configOpen, setConfigOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);

  // Local project queue
  const [proposed, setProposed] = useState<StoredTask[]>([]);
  const [triaged, setTriaged] = useState<TriageResult | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Tier>>({});
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const [loadingProposed, setLoadingProposed] = useState(false);
  const [loadingTriage, setLoadingTriage] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authBlocked, setAuthBlocked] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [dryRunResult, setDryRunResult] = useState<{ taskIds: string[]; wouldApprove: number } | null>(null);

  // Constellation sections (per external project, never merged into local store)
  // Seeded from sessionStorage so data survives panel close/reopen within the same page load
  const [constellationSections, setConstellationSections] = useState<Map<string, ConstellationSection>>(() => {
    try {
      const raw = sessionStorage.getItem("headwaters-aquifer-cache");
      if (!raw) return new Map();
      const entries = JSON.parse(raw) as Array<[string, Omit<ConstellationSection, "pendingIds"> & { pendingIds: string[] }]>;
      return new Map(entries.map(([id, s]) => [id, { ...s, pendingIds: new Set(s.pendingIds) }]));
    } catch { return new Map(); }
  });

  const [constellation, setConstellation] = useState<ConstellationProject[]>(() => {
    try {
      const stored = localStorage.getItem("task-autopilot-constellation");
      return stored ? (JSON.parse(stored) as ConstellationProject[]) : [];
    } catch { return []; }
  });
  const [constellationDraft, setConstellationDraft] = useState({ label: "", baseUrl: "", token: "" });

  // ── Aquifer: pre-curated list of all known projects, sweepable in one click ──
  const [aquifer, setAquifer] = useState<ConstellationProject[]>(() => {
    try {
      const raw = localStorage.getItem("headwaters-aquifer-projects");
      // Key exists — honour whatever Bobbie has saved (including intentional empty list)
      if (raw !== null) return JSON.parse(raw) as ConstellationProject[];
      // Migration: seed aquifer from legacy constellation config on first load
      const legacy = localStorage.getItem("task-autopilot-constellation");
      if (legacy) {
        const legacyProjects = JSON.parse(legacy) as ConstellationProject[];
        if (legacyProjects.length > 0) {
          localStorage.setItem("headwaters-aquifer-projects", JSON.stringify(legacyProjects));
          return legacyProjects;
        }
      }
      // True first launch (key absent): pre-seed with all known Headwaters project URLs
      localStorage.setItem("headwaters-aquifer-projects", JSON.stringify(AQUIFER_DEFAULTS));
      return AQUIFER_DEFAULTS;
    } catch { return []; }
  });
  const [aquiferSettingsOpen, setAquiferSettingsOpen] = useState(false);
  const [aquiferDraft, setAquiferDraft] = useState({ label: "", baseUrl: "", token: "" });
  const [aquiferPulling, setAquiferPulling] = useState(false);

  // Tracks whether the auto-seed has been attempted this session (prevents re-seeding on panel re-opens)
  const autoSeededRef = useRef(false);

  useEffect(() => {
    try { localStorage.setItem("task-autopilot-constellation", JSON.stringify(constellation)); } catch { /**/ }
  }, [constellation]);

  useEffect(() => {
    try { localStorage.setItem("headwaters-aquifer-projects", JSON.stringify(aquifer)); } catch { /**/ }
  }, [aquifer]);

  // Persist aquifer pull results to sessionStorage so they survive panel close/reopen
  useEffect(() => {
    try {
      const entries = Array.from(constellationSections.entries()).map(([id, s]) => [
        id,
        { ...s, pendingIds: Array.from(s.pendingIds) },
      ]);
      sessionStorage.setItem("headwaters-aquifer-cache", JSON.stringify(entries));
    } catch { /**/ }
  }, [constellationSections]);

  // ── Triage ──

  const runTriage = useCallback(async (tasks: StoredTask[]) => {
    if (!tasks.length) return;
    setLoadingTriage(true);
    setError(null);
    setAuthBlocked(false);
    setTriaged(null);
    setOverrides({});
    setDryRunResult(null);
    try {
      const res = await fetch(`${BASE_API}/tasks/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      if (!res.ok) throw new Error(`Triage failed: ${res.status}`);
      setTriaged(await res.json() as TriageResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Triage request failed");
    }
    setLoadingTriage(false);
  }, []);

  // ── Import ──

  const importAndTriage = useCallback(async (lines: string) => {
    setImporting(true);
    setError(null);
    setAuthBlocked(false);
    try {
      const res = await fetch(`${BASE_API}/tasks/import`, {
        method: "POST",
        headers: ownerHeaders(),
        body: JSON.stringify({ lines }),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setAuthBlocked(true);
          setImporting(false);
          return;
        }
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? `Import failed: ${res.status}`);
      }
      const j = await res.json() as { imported: number; skipped: number };
      if (j.imported === 0 && j.skipped > 0) {
        setError(`All ${j.skipped} tasks already exist in the queue.`);
        setImporting(false);
        return;
      }
      const proposedRes = await fetch(`${BASE_API}/tasks/proposed`);
      if (!proposedRes.ok) throw new Error("Could not reload proposed tasks");
      const fresh = ((await proposedRes.json()) as { tasks: StoredTask[] }).tasks ?? [];
      setProposed(fresh);
      await runTriage(fresh);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    }
    setImporting(false);
  }, [runTriage]);

  // ── Load proposed + pending ──

  const loadProposed = useCallback(async () => {
    setLoadingProposed(true);
    setError(null);
    try {
      const [proposedRes, pendingRes] = await Promise.all([
        fetch(`${BASE_API}/tasks/proposed`),
        fetch(`${BASE_API}/tasks/pending`),
      ]);
      if (!proposedRes.ok) throw new Error(`Could not load tasks (${proposedRes.status})`);
      const proposedJson = await proposedRes.json() as { tasks: StoredTask[] };
      const tasks = proposedJson.tasks ?? [];
      setProposed(tasks);
      if (pendingRes.ok) {
        const pendingJson = await pendingRes.json() as { tasks: StoredTask[] };
        setPendingIds(new Set((pendingJson.tasks ?? []).map((t) => t.id)));
      }
      // Auto-seed the real backlog on first open if the queue is empty — owner only
      const hasToken = !!getOwnerToken();
      if (tasks.length === 0 && !autoSeededRef.current && hasToken) {
        autoSeededRef.current = true;
        await importAndTriage(SAMPLE_TASK_LINES);
      }
    } catch (e) {
      setAuthBlocked(false);
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    }
    setLoadingProposed(false);
  }, [importAndTriage]);

  useEffect(() => {
    if (open) loadProposed();
  }, [open, loadProposed]);

  // ── Approve / Unapprove (local queue) ──

  const handleApprove = async (taskIds: string[], tier: "green" | "amber", label: string) => {
    if (!taskIds.length) return;
    setApproving(label);
    setDryRunResult(null);
    try {
      const res = await fetch(`${BASE_API}/tasks/approve`, {
        method: "POST",
        headers: ownerHeaders(),
        body: JSON.stringify({ taskIds, tier }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? `Approve failed: ${res.status}`);
      }
      const idSet = new Set(taskIds);
      setPendingIds((prev) => { const next = new Set(prev); taskIds.forEach((id) => next.add(id)); return next; });
      setProposed((prev) => prev.filter((t) => !idSet.has(t.id)));
    } catch (e) {
      setAuthBlocked(false);
      setError(e instanceof Error ? e.message : "Approve failed");
    }
    setApproving(null);
  };

  const handleUnapprove = async (taskIds: string[]) => {
    const res = await fetch(`${BASE_API}/tasks/unapprove`, {
      method: "POST",
      headers: ownerHeaders(),
      body: JSON.stringify({ taskIds }),
    });
    if (res.ok) {
      setPendingIds((prev) => { const next = new Set(prev); taskIds.forEach((id) => next.delete(id)); return next; });
      // Fetch fresh proposed list — clear triaged so user can re-triage with reverted tasks visible
      const proposedRes = await fetch(`${BASE_API}/tasks/proposed`);
      if (proposedRes.ok) {
        const fresh = ((await proposedRes.json()) as { tasks: StoredTask[] }).tasks ?? [];
        setProposed(fresh);
        setTriaged(null);
      }
    }
  };

  const handleDryRun = async (taskIds: string[], tier: "green" | "amber") => {
    const res = await fetch(`${BASE_API}/tasks/approve`, {
      method: "POST",
      headers: ownerHeaders(),
      body: JSON.stringify({ taskIds, tier, dryRun: true }),
    });
    if (res.ok) {
      const j = await res.json() as { taskIds: string[]; wouldApprove: number };
      setDryRunResult(j);
    }
  };

  // ── Override ──

  const effectiveTier = (t: ClassifiedTask): Tier => overrides[t.id] ?? t.tier;

  const handleOverride = (taskId: string, fromTier: Tier, toTier: Tier, title: string) => {
    setOverrides((prev) => ({ ...prev, [taskId]: toTier }));
    fetch(`${BASE_API}/tasks/audit-log`, {
      method: "POST",
      headers: ownerHeaders(),
      body: JSON.stringify({ taskId, taskTitle: title, fromTier, toTier, reason: "Manual override by founder" }),
    }).catch(() => { /* silent */ });
  };

  // ── RED deliberation ──

  const openDeliberation = (task: ClassifiedTask) => {
    if (!onOpenDeliberation) return;
    const seat = task.councilSeat ?? "saltbox";
    const seatId = SEAT_ID_MAP[seat];
    const seatName = SEAT_META[seat].name;
    const brief = `DELIBERATION BRIEF — RED task routed to ${seatName}

Task: "${task.title}"
Compact rule triggered: ${task.rule}
Classification: ${task.reasoning}

${seatName}, this task needs your voice before it can move to PENDING. What is your counsel?`;
    onOpenDeliberation(seatId, brief);
  };

  // ── Constellation: fetch per external project, triage locally, keep separate ──

  const pullConstellation = async (project: ConstellationProject) => {
    setConstellationSections((prev) => {
      const next = new Map(prev);
      next.set(project.id, {
        project,
        tasks: [],
        triaged: null,
        loading: true,
        error: null,
        pendingIds: new Set(),
      });
      return next;
    });

    try {
      const headers: Record<string, string> = {};
      if (project.token) headers["Authorization"] = `Bearer ${project.token}`;

      const res = await fetch(`${project.baseUrl}/api/tasks/proposed`, { headers });
      if (!res.ok) throw new Error(`Could not reach ${project.label} (${res.status})`);

      const j = await res.json() as { tasks: StoredTask[] };
      const remoteTasks = j.tasks ?? [];

      if (!remoteTasks.length) {
        setConstellationSections((prev) => {
          const next = new Map(prev);
          next.set(project.id, { project, tasks: [], triaged: null, loading: false, error: `No proposed tasks in ${project.label}`, pendingIds: new Set() });
          return next;
        });
        return;
      }

      // Triage remotely fetched tasks through local classification engine
      const triageRes = await fetch(`${BASE_API}/tasks/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: remoteTasks }),
      });
      if (!triageRes.ok) throw new Error("Triage failed for constellation tasks");
      const triaged = await triageRes.json() as TriageResult;

      setConstellationSections((prev) => {
        const next = new Map(prev);
        next.set(project.id, { project, tasks: remoteTasks, triaged, loading: false, error: null, pendingIds: new Set(), pulledAt: Date.now() });
        return next;
      });
    } catch (e) {
      setConstellationSections((prev) => {
        const next = new Map(prev);
        next.set(project.id, { project, tasks: [], triaged: null, loading: false, error: e instanceof Error ? e.message : "Fetch failed", pendingIds: new Set() });
        return next;
      });
    }
  };

  // Approve tasks in a constellation project (sends back to the external project)
  const approveConstellation = async (projectId: string, taskIds: string[], tier: "green" | "amber") => {
    const section = constellationSections.get(projectId);
    if (!section) return;
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (section.project.token) headers["Authorization"] = `Bearer ${section.project.token}`;
      const res = await fetch(`${section.project.baseUrl}/api/tasks/approve`, {
        method: "POST",
        headers,
        body: JSON.stringify({ taskIds, tier }),
      });
      if (!res.ok) throw new Error(`Approve on ${section.project.label} failed (${res.status})`);
      setConstellationSections((prev) => {
        const next = new Map(prev);
        const s = next.get(projectId);
        if (s) {
          const newPending = new Set(s.pendingIds);
          taskIds.forEach((id) => newPending.add(id));
          next.set(projectId, { ...s, pendingIds: newPending });
        }
        return next;
      });
      // Record in local audit log with projectId so the constellation origin is traceable
      const approvedTasks = (section.tasks ?? []).filter((t) => taskIds.includes(t.id)).map((t) => ({ id: t.id, title: t.title }));
      fetch(`${BASE_API}/tasks/audit-log/constellation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: approvedTasks.length ? approvedTasks : taskIds.map((id) => ({ id })),
          projectId: section.project.id,
          projectLabel: section.project.label,
          tier: tier.toUpperCase(),
        }),
      }).catch(() => { /* best-effort */ });
    } catch (e) {
      setAuthBlocked(false);
      setError(e instanceof Error ? e.message : `Approve on ${section.project.label} failed`);
    }
  };

  // Add a new task to a constellation project's proposed queue
  const addTaskToConstellation = async (projectId: string, title: string): Promise<boolean> => {
    const section = constellationSections.get(projectId);
    if (!section || !title.trim()) return false;
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (section.project.token) headers["Authorization"] = `Bearer ${section.project.token}`;
      const res = await fetch(`${section.project.baseUrl}/api/tasks/import`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tasks: [{ title: title.trim() }] }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? `Could not add task to ${section.project.label} (${res.status})`);
      }
      return true;
    } catch (e) {
      setAuthBlocked(false);
      setError(e instanceof Error ? e.message : `Could not add task to ${section.project.label}`);
      return false;
    }
  };

  // ── Pull all aquifer projects in parallel ──

  const pullAquifer = async () => {
    if (!aquifer.length) return;
    setAquiferPulling(true);
    await Promise.all(aquifer.map((p) => pullConstellation(p)));
    setAquiferPulling(false);
  };

  // ── Computed ──

  const isOwner = !!getOwnerToken();

  const greenTasks  = (triaged?.tasks ?? []).filter((t) => effectiveTier(t) === "GREEN");
  const amberTasks  = (triaged?.tasks ?? []).filter((t) => effectiveTier(t) === "AMBER");
  const redTasks    = (triaged?.tasks ?? []).filter((t) => effectiveTier(t) === "RED");

  const computedAmberGroups = amberTasks.reduce<Record<string, ClassifiedTask[]>>((acc, t) => {
    const cluster = t.themeCluster ?? "general";
    if (!acc[cluster]) acc[cluster] = [];
    acc[cluster]!.push(t);
    return acc;
  }, {});

  const allGreenPending = greenTasks.length > 0 && greenTasks.every((t) => pendingIds.has(t.id));
  const summary = triaged?.summary;

  // ── Aquifer sweep summary ──────────────────────────────────────────────────
  const sweepSections = Array.from(constellationSections.values());
  const sweepVisible = sweepSections.length > 0;
  const sweepLoadingCount = sweepSections.filter((s) => s.loading).length;
  const sweepDoneCount = sweepSections.filter((s) => !s.loading).length;
  const sweepReachedCount = sweepSections.filter((s) => !s.loading && !s.error).length;
  const sweepErrorCount = sweepSections.filter((s) => !s.loading && !!s.error).length;
  const sweepTotalTasks = sweepSections.reduce((n, s) => n + (s.tasks?.length ?? 0), 0);
  const sweepTotalGreen = sweepSections.reduce((n, s) => n + (s.triaged?.summary.green ?? 0), 0);
  const sweepTotalAmber = sweepSections.reduce((n, s) => n + (s.triaged?.summary.amber ?? 0), 0);
  const sweepTotalRed   = sweepSections.reduce((n, s) => n + (s.triaged?.summary.red   ?? 0), 0);
  const sweepInFlight = sweepLoadingCount > 0;

  return (
    <div className="border-b border-[#251E18]">
      {/* ── Header toggle ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-[#0F0D0B] hover:bg-[#13110E] transition-colors text-left group"
      >
        <span className="text-[18px] leading-none">⚡</span>
        <div className="flex-1 min-w-0">
          <span className="text-[12px] uppercase tracking-[0.18em] text-[#8C7B6D] font-bold">Task Autopilot</span>
          {summary && (
            <span className="ml-3 text-[11px] text-[#5C5046]">
              <span className="text-[#4ADE80]">{summary.green}G</span>
              {" · "}
              <span className="text-[#FCD34D]">{summary.amber}A</span>
              {" · "}
              <span className="text-[#FCA5A5]">{summary.red}R</span>
            </span>
          )}
          {!triaged && proposed.length > 0 && (
            <span className="ml-3 text-[11px] text-[#5C5046]">{proposed.length} proposed</span>
          )}
        </div>
        <span className="text-[10px] text-[#3D3228] group-hover:text-[#5C5046] transition-colors">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="bg-[#0F0D0B] px-5 pb-5">

          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-center gap-2 py-3 border-b border-[#1A1612] mb-4">
            {isOwner && proposed.length === 0 && !loadingProposed && (
              <button
                onClick={() => importAndTriage(SAMPLE_TASK_LINES)}
                disabled={importing}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#2A231E] text-[#A39485] hover:text-[#EAE4DB] hover:border-[#3D3228] transition-colors disabled:opacity-40"
              >
                {importing ? "Importing…" : "Seed project backlog"}
              </button>
            )}
            {proposed.length > 0 && !triaged && (
              <button
                onClick={() => runTriage(proposed)}
                disabled={loadingTriage}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#2A231E] text-[#A39485] hover:text-[#EAE4DB] hover:border-[#3D3228] transition-colors disabled:opacity-40"
              >
                {loadingTriage ? "Classifying…" : `Triage ${proposed.length} tasks`}
              </button>
            )}
            {triaged && (
              <button
                onClick={() => runTriage(proposed)}
                disabled={loadingTriage}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#2A231E] text-[#A39485] hover:text-[#EAE4DB] hover:border-[#3D3228] transition-colors disabled:opacity-40"
              >
                Re-triage
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => setPasteOpen(true)}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#2A231E] text-[#A39485] hover:text-[#EAE4DB] hover:border-[#3D3228] transition-colors"
              >
                Paste task list
              </button>
            )}
            <button
              onClick={loadProposed}
              disabled={loadingProposed}
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#2A231E] text-[#5C5046] hover:text-[#A39485] transition-colors disabled:opacity-40"
              title="Refresh from server"
            >
              ↻
            </button>
            <div className="flex-1" />
            {/* ── Aquifer sweep button ── */}
            <button
              onClick={pullAquifer}
              disabled={aquiferPulling || aquifer.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#1A3028] text-[#4ADE80] hover:text-[#86EFAC] hover:border-[#2A4A38] transition-colors disabled:opacity-40"
              title={aquifer.length === 0 ? "Add projects in Aquifer settings first" : `Pull from ${aquifer.length} aquifer project${aquifer.length !== 1 ? "s" : ""}`}
            >
              {aquiferPulling ? (
                <div className="w-3 h-3 border-2 border-[#4ADE80]/40 border-t-[#4ADE80] rounded-full animate-spin" />
              ) : (
                <span>◎</span>
              )}
              <span>Pull Aquifer</span>
              {aquifer.length > 0 && (
                <span className="ml-1 text-[10px] bg-[#0D2010] text-[#4ADE80] rounded-full px-1.5 py-0.5">
                  {aquifer.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAquiferSettingsOpen((o) => !o)}
              className="px-2.5 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#1A3028] text-[#4ADE80]/60 hover:text-[#4ADE80] hover:border-[#2A4A38] transition-colors"
              title="Aquifer project settings"
            >
              ⚙
            </button>
            <button
              onClick={() => setConfigOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border border-[#2A231E] text-[#5C5046] hover:text-[#A39485] hover:border-[#3D3228] transition-colors"
            >
              <span>✦</span>
              <span>Constellation</span>
              {constellation.length > 0 && (
                <span className="ml-1 text-[10px] bg-[#2A231E] text-[#8C7B6D] rounded-full px-1.5 py-0.5">
                  {constellation.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Inline Aquifer settings panel ── */}
          {aquiferSettingsOpen && (
            <AquiferSettingsPanel
              projects={aquifer}
              onAdd={(p) => setAquifer((prev) => [...prev, p])}
              onRemove={(id) => setAquifer((prev) => prev.filter((p) => p.id !== id))}
              onUpdate={(updated) => setAquifer((prev) => prev.map((p) => p.id === updated.id ? updated : p))}
              onReset={() => setAquifer(AQUIFER_DEFAULTS)}
              onPull={(p) => pullConstellation(p)}
              onPullAll={pullAquifer}
              draft={aquiferDraft}
              setDraft={setAquiferDraft}
              pulling={aquiferPulling}
              onClose={() => setAquiferSettingsOpen(false)}
            />
          )}

          {error && !authBlocked && (
            <div className="mb-4 px-4 py-3 rounded-sm border border-[#5C1A1A] bg-[#1E0A0A] text-[12px] text-[#FCA5A5] flex items-start gap-3">
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-[#5C5046] hover:text-[#FCA5A5] flex-shrink-0">×</button>
            </div>
          )}

          {(loadingProposed || loadingTriage || importing) && (
            <div className="flex items-center gap-3 py-8 justify-center text-[#5C5046]">
              <div className="w-4 h-4 border-2 border-[#5C5046] border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] tracking-wide">
                {loadingProposed ? "Loading proposed tasks…" : importing ? "Importing tasks…" : "Applying Watershed Compact filters…"}
              </span>
            </div>
          )}

          {/* ── Dry-run preview banner ── */}
          {dryRunResult && (
            <div className="mb-4 px-4 py-3 rounded-sm border border-[#3D2800] bg-[#1E1200] text-[12px] text-[#FCD34D] flex items-center gap-3">
              <span>Preview: {dryRunResult.wouldApprove} tasks would move to PENDING</span>
              <button onClick={() => setDryRunResult(null)} className="ml-auto text-[#5C5046] hover:text-[#FCD34D]">dismiss</button>
            </div>
          )}

          {/* ── Pending count ── */}
          {pendingIds.size > 0 && (
            <div className="mb-4 px-4 py-2.5 rounded-sm border border-[#1A4020] bg-[#0D2010] text-[11px] text-[#4ADE80]">
              {pendingIds.size} task{pendingIds.size !== 1 ? "s" : ""} moved to PENDING in this session
            </div>
          )}

          {/* ── LOCAL project triage ── */}
          {triaged && !loadingTriage && (
            <div className="space-y-4">
              <TierSection
                tier="GREEN"
                tasks={greenTasks}
                pendingIds={pendingIds}
                approving={approving}
                label={`${greenTasks.length} task${greenTasks.length !== 1 ? "s" : ""} · batch approve`}
                rationale="These pass all 5 Watershed Compact rules and all 3 Tests. Technical/infrastructure work — no ownership transfer, no new leak, no strategic commitment."
                onDryRun={() => handleDryRun(greenTasks.filter((t) => !pendingIds.has(t.id)).map((t) => t.id), "green")}
                onApprove={() => handleApprove(greenTasks.filter((t) => !pendingIds.has(t.id)).map((t) => t.id), "green", "green")}
                onUnapprove={() => handleUnapprove(greenTasks.filter((t) => pendingIds.has(t.id)).map((t) => t.id))}
                allPending={allGreenPending}
                onOverride={(t, toTier) => handleOverride(t.id, effectiveTier(t), toTier, t.title)}
                onOpenDeliberation={null}
                isOwner={isOwner}
              />

              {Object.entries(computedAmberGroups).map(([cluster, clusterTasks]) => {
                const notPending = clusterTasks.filter((t) => !pendingIds.has(t.id)).map((t) => t.id);
                const allPending = clusterTasks.length > 0 && clusterTasks.every((t) => pendingIds.has(t.id));
                return (
                  <TierSection
                    key={cluster}
                    tier="AMBER"
                    tasks={clusterTasks}
                    pendingIds={pendingIds}
                    approving={approving}
                    label={`${clusterTasks.length} ${cluster} task${clusterTasks.length !== 1 ? "s" : ""}`}
                    rationale={`Directionally correct. Review this "${cluster}" group as a batch before approving. Compact Rule 4: the numbers are the numbers.`}
                    onDryRun={() => handleDryRun(notPending, "amber")}
                    onApprove={() => handleApprove(notPending, "amber", `amber-${cluster}`)}
                    onUnapprove={() => handleUnapprove(clusterTasks.filter((t) => pendingIds.has(t.id)).map((t) => t.id))}
                    allPending={allPending}
                    onOverride={(t, toTier) => handleOverride(t.id, effectiveTier(t), toTier, t.title)}
                    onOpenDeliberation={null}
                    isOwner={isOwner}
                  />
                );
              })}

              {/* RED — with optional deliberation brief routing */}
              {redTasks.length > 0 && (
                <RedSection
                  tasks={redTasks}
                  pendingIds={pendingIds}
                  onOverride={(t, toTier) => handleOverride(t.id, effectiveTier(t), toTier, t.title)}
                  onOpenDeliberation={onOpenDeliberation ? (t) => openDeliberation(t) : null}
                  isOwner={isOwner}
                />
              )}
            </div>
          )}

          {/* ── Empty / pre-triage state ── */}
          {!triaged && !loadingTriage && !loadingProposed && !importing && (
            <div className="py-10 text-center">
              {proposed.length > 0 ? (
                <div>
                  <p className="text-[14px] text-[#8C7B6D] mb-2">{proposed.length} task{proposed.length !== 1 ? "s" : ""} in the PROPOSED queue</p>
                  <button
                    onClick={() => runTriage(proposed)}
                    className="px-4 py-2 text-[12px] uppercase tracking-wider font-bold text-[#13110E] bg-[#8C7B6D] hover:bg-[#A39485] rounded-sm transition-colors"
                  >
                    Triage now
                  </button>
                </div>
              ) : !isOwner ? (
                <div>
                  <p className="text-[22px] mb-2 opacity-30">⚡</p>
                  <p className="text-[13px] text-[#4A3D30] leading-relaxed max-w-xs mx-auto">
                    The backlog lives here — sign in as owner to triage tasks.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[13px] text-[#4A3D30] leading-relaxed max-w-xs mx-auto mb-4">
                    No tasks in the PROPOSED queue. Seed the project backlog or paste a task list to begin.
                  </p>
                  <button
                    onClick={() => importAndTriage(SAMPLE_TASK_LINES)}
                    disabled={importing}
                    className="px-4 py-2 text-[12px] uppercase tracking-wider font-bold text-[#13110E] bg-[#8C7B6D] hover:bg-[#A39485] disabled:opacity-30 rounded-sm transition-colors"
                  >
                    Seed project backlog
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Aquifer sweep summary bar ── */}
          {sweepVisible && (
            <div className="mb-3 flex items-center gap-3 px-4 py-2.5 rounded-sm border border-[#1A3028] bg-[#0A1A12] text-[11px]">
              {sweepInFlight ? (
                <>
                  <div className="w-3 h-3 border-2 border-[#4ADE80]/40 border-t-[#4ADE80] rounded-full animate-spin flex-shrink-0" />
                  <span className="text-[#4ADE80] font-medium tracking-wide">
                    {sweepDoneCount} / {sweepSections.length} project{sweepSections.length !== 1 ? "s" : ""} fetched…
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#059669]">◎</span>
                  <span className="text-[#4ADE80] font-medium">
                    {sweepReachedCount} project{sweepReachedCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[#2A4A38]">·</span>
                  <span className="text-[#86EFAC]">{sweepTotalTasks} task{sweepTotalTasks !== 1 ? "s" : ""}</span>
                  {(sweepTotalGreen > 0 || sweepTotalAmber > 0 || sweepTotalRed > 0) && (
                    <>
                      <span className="text-[#2A4A38]">·</span>
                      <span className="text-[#4ADE80]">{sweepTotalGreen}G</span>
                      <span className="text-[#2A4A38]">·</span>
                      <span className="text-[#FCD34D]">{sweepTotalAmber}A</span>
                      <span className="text-[#2A4A38]">·</span>
                      <span className="text-[#FCA5A5]">{sweepTotalRed}R</span>
                    </>
                  )}
                  {sweepErrorCount > 0 && (
                    <>
                      <span className="text-[#2A4A38]">·</span>
                      <span className="text-[#EF4444]">{sweepErrorCount} error{sweepErrorCount !== 1 ? "s" : ""}</span>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Constellation sections — one per external project ── */}
          {Array.from(constellationSections.values()).map((section) => (
            <ConstellationProjectSection
              key={section.project.id}
              section={section}
              onApprove={(taskIds, tier) => approveConstellation(section.project.id, taskIds, tier)}
              onAddTask={(title) => addTaskToConstellation(section.project.id, title)}
              onRefresh={() => pullConstellation(section.project)}
              onOpenDeliberation={onOpenDeliberation}
              onClose={() => setConstellationSections((prev) => { const next = new Map(prev); next.delete(section.project.id); return next; })}
            />
          ))}
        </div>
      )}

      {/* ── Paste modal ── */}
      {pasteOpen && (
        <div
          className="fixed inset-0 bg-[#0A0807]/80 backdrop-blur-md z-50 flex items-end sm:items-center sm:justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setPasteOpen(false); }}
        >
          <div className="w-full sm:w-[520px] bg-[#181512] border-t sm:border border-[#251E18] rounded-t-sm sm:rounded-sm p-6 shadow-2xl">
            <div className="w-16 h-1 bg-[#251E18] rounded-full mx-auto mb-6 sm:hidden" />
            <h3 className="text-[18px] font-serif text-[#EAE4DB] mb-1">Paste task list</h3>
            <p className="text-[13px] text-[#8C7B6D] mb-4 leading-relaxed">
              One task title per line. Bullets and numbering are stripped. Tasks enter the PROPOSED queue before triage.
            </p>
            <textarea
              autoFocus
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={"Fix the broken PDF export\nCover the cost review with automated tests\nAdd spreadsheet export to Personal cash page\n..."}
              rows={8}
              className="w-full text-[13px] font-mono text-[#D8D0C5] bg-[#13110E] border border-[#251E18] rounded-sm p-4 resize-y outline-none focus:border-[#5C5046] transition-colors mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setPasteOpen(false)} className="flex-1 py-3 text-[12px] uppercase tracking-wide font-bold text-[#8C7B6D] hover:text-[#EAE4DB] border border-[#2A231E] bg-[#1C1814] rounded-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { setPasteOpen(false); importAndTriage(pasteText); setPasteText(""); }}
                disabled={!pasteText.trim()}
                className="flex-1 py-3 text-[12px] uppercase tracking-wide font-bold text-[#13110E] bg-[#8C7B6D] hover:bg-[#A39485] disabled:opacity-30 rounded-sm transition-colors"
              >
                Import & triage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Constellation config modal ── */}
      {configOpen && (
        <ConstellationConfig
          projects={constellation}
          onAdd={(p) => setConstellation((prev) => [...prev, p])}
          onRemove={(id) => setConstellation((prev) => prev.filter((p) => p.id !== id))}
          onPull={(p) => { setConfigOpen(false); pullConstellation(p); }}
          onClose={() => setConfigOpen(false)}
          draft={constellationDraft}
          setDraft={setConstellationDraft}
        />
      )}
    </div>
  );
}

// ── TierSection ───────────────────────────────────────────────────────────────

function TierSection({
  tier, tasks, pendingIds, approving, label, rationale,
  onDryRun, onApprove, onUnapprove, allPending, onOverride, onOpenDeliberation, isOwner,
}: {
  tier: Tier;
  tasks: ClassifiedTask[];
  pendingIds: Set<string>;
  approving: string | null;
  label: string;
  rationale: string;
  onDryRun: () => void;
  onApprove: () => void;
  onUnapprove: () => void;
  allPending: boolean;
  onOverride: (t: ClassifiedTask, toTier: Tier) => void;
  onOpenDeliberation: ((t: ClassifiedTask) => void) | null;
  isOwner: boolean;
}) {
  const [expanded, setExpanded] = useState(tier !== "GREEN");
  const c = TIER_COLOR[tier];
  const notPendingCount = tasks.filter((t) => !pendingIds.has(t.id)).length;
  const pendingCount = tasks.length - notPendingCount;
  const isApproving = approving === tier.toLowerCase() || (approving?.startsWith("amber") && tier === "AMBER");

  if (!tasks.length) return null;

  return (
    <div className="rounded-sm border overflow-hidden" style={{ borderColor: c.border, background: c.bg }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
        <span className="text-[11px] uppercase tracking-[0.15em] font-bold flex-1" style={{ color: c.text }}>
          {tier} — {label}
        </span>
        {pendingCount > 0 && (
          <span className="text-[10px]" style={{ color: c.text, opacity: 0.6 }}>{pendingCount} pending</span>
        )}
        <button onClick={() => setExpanded((o) => !o)} className="text-[10px] text-[#5C5046] hover:text-[#8C7B6D] ml-2 transition-colors">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      <div className="px-4 pt-2.5 pb-2 border-b" style={{ borderColor: c.border }}>
        <p className="text-[11px] leading-relaxed" style={{ color: c.text, opacity: 0.7 }}>{rationale}</p>
      </div>

      {expanded && (
        <div className="divide-y" style={{ borderColor: c.border }}>
          {tasks.map((t) => {
            const isPending = pendingIds.has(t.id);
            return (
              <div key={t.id} className={cn("px-4 py-2.5 flex items-start gap-3", isPending && "opacity-50")}>
                <span className="flex-shrink-0 mt-0.5 w-3 h-3 rounded-full border" style={{ borderColor: isPending ? c.dot : c.border, background: isPending ? c.dot : "transparent" }} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-[12px] leading-snug", isPending ? "line-through text-[#5C5046]" : "text-[#D8D0C5]")}>{t.title}</p>
                  <details className="mt-0.5">
                    <summary className="text-[10px] cursor-pointer select-none" style={{ color: c.text, opacity: 0.5 }}>rule</summary>
                    <p className="mt-0.5 text-[10px] leading-relaxed pl-2 border-l" style={{ borderColor: c.border, color: c.text, opacity: 0.6 }}>{t.rule}</p>
                  </details>
                </div>
                {isOwner && <OverrideMenu task={t} onOverride={(toTier) => onOverride(t, toTier)} />}
              </div>
            );
          })}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-2 px-4 py-3">
          {!allPending && (
            <>
              <button onClick={onDryRun} className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm border transition-colors" style={{ borderColor: c.border, color: c.text, opacity: 0.7 }}>
                Preview
              </button>
              <button
                onClick={onApprove}
                disabled={isApproving || notPendingCount === 0}
                className="flex items-center gap-2 px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-sm transition-all disabled:opacity-40"
                style={{ background: c.badge, color: "#13110E" }}
              >
                {isApproving && <div className="w-3 h-3 border-2 border-current/40 border-t-current rounded-full animate-spin" />}
                {tier === "GREEN" ? `Run ${notPendingCount} task${notPendingCount !== 1 ? "s" : ""}` : `Approve ${notPendingCount}`}
              </button>
            </>
          )}
          {pendingCount > 0 && (
            <button onClick={onUnapprove} className="ml-auto px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm border transition-colors" style={{ borderColor: c.border, color: c.text, opacity: 0.5 }}>
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── RedSection ────────────────────────────────────────────────────────────────

function RedSection({
  tasks, pendingIds, onOverride, onOpenDeliberation, isOwner,
}: {
  tasks: ClassifiedTask[];
  pendingIds: Set<string>;
  onOverride: (t: ClassifiedTask, toTier: Tier) => void;
  onOpenDeliberation: ((t: ClassifiedTask) => void) | null;
  isOwner: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const c = TIER_COLOR.RED;

  return (
    <div className="rounded-sm border overflow-hidden" style={{ borderColor: c.border, background: c.bg }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
        <span className="text-[11px] uppercase tracking-[0.15em] font-bold flex-1" style={{ color: c.text }}>
          RED — {tasks.length} require your voice
        </span>
        <span className="text-[10px] text-[#5C5046]">no auto-approve</span>
        <button onClick={() => setExpanded((o) => !o)} className="text-[10px] text-[#5C5046] hover:text-[#8C7B6D] ml-2 transition-colors">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {expanded && (
        <div className="divide-y" style={{ borderColor: c.border }}>
          {tasks.map((t) => {
            const seat = t.councilSeat ? SEAT_META[t.councilSeat] : null;
            const isPending = pendingIds.has(t.id);
            return (
              <div key={t.id} className={cn("px-4 py-3", isPending && "opacity-40")}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#EAE4DB] leading-snug mb-1">{t.title}</p>
                    <p className="text-[11px] text-[#8C7B6D] leading-relaxed">{t.rule}</p>
                    {t.hardGuardrail && (
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm font-bold" style={{ background: c.border, color: c.text }}>
                        hard guardrail
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {seat && (
                      <span className="text-[11px] px-2 py-0.5 rounded-sm font-medium" style={{ background: `${seat.color}22`, color: seat.color }}>
                        {seat.icon} {seat.name}
                      </span>
                    )}
                    {isOwner && <OverrideMenu task={t} onOverride={(toTier) => onOverride(t, toTier)} />}
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="text-[10px] text-[#5C5046] cursor-pointer hover:text-[#8C7B6D] select-none">why RED?</summary>
                  <p className="mt-1 text-[11px] text-[#8C7B6D] leading-relaxed pl-3 border-l-2" style={{ borderColor: c.border }}>{t.reasoning}</p>
                </details>
                {t.greenSignalsIgnored && t.greenSignalsIgnored.length > 0 && (
                  <div className="mt-2 flex items-start gap-2 px-2.5 py-2 rounded-sm" style={{ background: "#0D2010", border: "1px solid #1A4020" }}>
                    <span className="text-[11px] flex-shrink-0" style={{ color: "#4ADE80" }}>⚠</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#4ADE80" }}>
                        Looks green but blocked by guardrail
                      </p>
                      <p className="text-[10px] leading-relaxed" style={{ color: "#86EFAC" }}>
                        Matched green phrase{t.greenSignalsIgnored.length !== 1 ? "s" : ""}:{" "}
                        {t.greenSignalsIgnored.map((s) => humaniseGreenSignal(s)).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {isOwner && onOpenDeliberation && (
                  <div className="mt-2.5">
                    <button
                      onClick={() => onOpenDeliberation(t)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-sm border transition-colors"
                      style={{ borderColor: c.border, color: seat?.color ?? c.text }}
                    >
                      {seat && <span>{seat.icon}</span>}
                      <span>Open deliberation at {seat?.name ?? "table"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── ConstellationProjectSection ───────────────────────────────────────────────

function ConstellationProjectSection({
  section, onApprove, onAddTask, onRefresh, onOpenDeliberation, onClose,
}: {
  section: ConstellationSection;
  onApprove: (taskIds: string[], tier: "green" | "amber") => void;
  onAddTask: (title: string) => Promise<boolean>;
  onRefresh: () => void;
  onOpenDeliberation?: (seatId: string, brief: string) => void;
  onClose: () => void;
}) {
  const [addTitle, setAddTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  const handleAddTask = async () => {
    if (!addTitle.trim()) return;
    setAdding(true);
    setAddFeedback(null);
    const ok = await onAddTask(addTitle.trim());
    if (ok) {
      setAddTitle("");
      setAddFeedback("Added — refresh to see it in the triage queue");
    }
    setAdding(false);
  };

  const { project, triaged, loading, error, pendingIds, pulledAt } = section;
  const c = TIER_COLOR.AMBER;

  const pulledAtLabel = pulledAt
    ? new Date(pulledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  const effectiveTier = (t: ClassifiedTask): Tier => t.tier;
  const greenTasks = (triaged?.tasks ?? []).filter((t) => effectiveTier(t) === "GREEN");
  const amberTasks = (triaged?.tasks ?? []).filter((t) => effectiveTier(t) === "AMBER");
  const redTasks   = (triaged?.tasks ?? []).filter((t) => effectiveTier(t) === "RED");

  const amberGroups = amberTasks.reduce<Record<string, ClassifiedTask[]>>((acc, t) => {
    const cluster = t.themeCluster ?? "general";
    if (!acc[cluster]) acc[cluster] = [];
    acc[cluster]!.push(t);
    return acc;
  }, {});

  const openConstellationDeliberation = (t: ClassifiedTask) => {
    if (!onOpenDeliberation || !t.councilSeat) return;
    const seat = t.councilSeat;
    const seatId = SEAT_ID_MAP[seat];
    const seatName = SEAT_META[seat].name;
    const brief = `DELIBERATION BRIEF — RED task from ${project.label}, routed to ${seatName}

Task: "${t.title}"
Compact rule triggered: ${t.rule}
Classification: ${t.reasoning}

${seatName}, this task from ${project.label} needs your voice before it can move to PENDING. What is your counsel?`;
    onOpenDeliberation(seatId, brief);
  };

  return (
    <div className="mt-4 rounded-sm border border-[#2A231E] overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#13110E] border-b border-[#2A231E]">
        <span className="text-[10px]">✦</span>
        <span className="text-[12px] font-bold text-[#A39485] flex-1 uppercase tracking-wider">{project.label}</span>
        {pulledAtLabel && (
          <span className="text-[10px] text-[#3D3228] flex-shrink-0" title={`Last pulled at ${pulledAtLabel}`}>
            {pulledAtLabel}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-[#5C5046] hover:text-[#4ADE80] text-[13px] leading-none flex-shrink-0 disabled:opacity-30 transition-colors"
          title="Refresh from project"
        >
          ↻
        </button>
        <button onClick={onClose} className="text-[#5C5046] hover:text-[#A39485] text-[16px] leading-none ml-1 flex-shrink-0">×</button>
      </div>

      <div className="px-4 py-3 bg-[#0F0D0B]">
        {loading && (
          <div className="flex items-center gap-3 py-4 text-[#5C5046]">
            <div className="w-3 h-3 border-2 border-[#5C5046] border-t-transparent rounded-full animate-spin" />
            <span className="text-[12px]">Fetching {project.label}…</span>
          </div>
        )}

        {error && (
          <div className="py-3 text-[12px] text-[#FCA5A5]">{error}</div>
        )}

        {triaged && !loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[11px] text-[#5C5046] mb-2">
              <span className="text-[#4ADE80]">{triaged.summary.green}G</span>
              <span className="text-[#FCD34D]">{triaged.summary.amber}A</span>
              <span className="text-[#FCA5A5]">{triaged.summary.red}R</span>
              <span>from {triaged.summary.total} proposed tasks</span>
            </div>

            {greenTasks.length > 0 && (
              <TierSection
                tier="GREEN"
                tasks={greenTasks}
                pendingIds={pendingIds}
                approving={null}
                label={`${greenTasks.length} task${greenTasks.length !== 1 ? "s" : ""} · batch approve`}
                rationale={`Green tasks from ${project.label} — pass all Compact rules.`}
                onDryRun={() => { }}
                onApprove={() => onApprove(greenTasks.filter((t) => !pendingIds.has(t.id)).map((t) => t.id), "green")}
                onUnapprove={() => { }}
                allPending={greenTasks.every((t) => pendingIds.has(t.id))}
                onOverride={() => { }}
                onOpenDeliberation={null}
              />
            )}

            {Object.entries(amberGroups).map(([cluster, tasks]) => (
              <TierSection
                key={cluster}
                tier="AMBER"
                tasks={tasks}
                pendingIds={pendingIds}
                approving={null}
                label={`${tasks.length} ${cluster} task${tasks.length !== 1 ? "s" : ""}`}
                rationale={`Amber tasks from ${project.label} — review "${cluster}" group.`}
                onDryRun={() => { }}
                onApprove={() => onApprove(tasks.filter((t) => !pendingIds.has(t.id)).map((t) => t.id), "amber")}
                onUnapprove={() => { }}
                allPending={tasks.every((t) => pendingIds.has(t.id))}
                onOverride={() => { }}
                onOpenDeliberation={null}
              />
            ))}

            {redTasks.length > 0 && (
              <RedSection
                tasks={redTasks}
                pendingIds={pendingIds}
                onOverride={() => { }}
                onOpenDeliberation={onOpenDeliberation ? (t) => openConstellationDeliberation(t) : null}
              />
            )}
          </div>
        )}

        {/* ── Add task row ── */}
        <div className="mt-3 pt-3 border-t border-[#2A231E]">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#5C5046] font-bold mb-2">Add task to {project.label}</p>
          <div className="flex gap-2">
            <input
              value={addTitle}
              onChange={(e) => { setAddTitle(e.target.value); setAddFeedback(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(); }}
              placeholder="Task title…"
              className="flex-1 text-[12px] text-[#EAE4DB] bg-[#13110E] border border-[#251E18] rounded-sm px-3 py-2 outline-none focus:border-[#5C5046] transition-colors placeholder:text-[#3D3228]"
            />
            <button
              onClick={handleAddTask}
              disabled={adding || !addTitle.trim()}
              className="px-3 py-2 text-[11px] uppercase tracking-wider font-bold rounded-sm border border-[#2A231E] text-[#8C7B6D] hover:text-[#EAE4DB] hover:border-[#3D3228] disabled:opacity-30 transition-colors flex-shrink-0"
            >
              {adding ? "…" : "+ Add"}
            </button>
            <button
              onClick={onRefresh}
              disabled={section.loading}
              className="px-2.5 py-2 text-[12px] text-[#5C5046] hover:text-[#8C7B6D] border border-[#2A231E] rounded-sm transition-colors disabled:opacity-30 flex-shrink-0"
              title="Refresh task list"
            >
              ↻
            </button>
          </div>
          {addFeedback && (
            <p className="mt-2 text-[11px] text-[#4ADE80]">{addFeedback}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── OverrideMenu ──────────────────────────────────────────────────────────────

function OverrideMenu({ task, onOverride }: { task: ClassifiedTask; onOverride: (toTier: Tier) => void }) {
  const [open, setOpen] = useState(false);
  const current = task.overrideTier ?? task.tier;
  const others: Tier[] = (["GREEN", "AMBER", "RED"] as Tier[]).filter((t) => t !== current);

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[9px] text-[#3D3228] hover:text-[#5C5046] uppercase tracking-wider px-1.5 py-1 rounded transition-colors"
        title="Override tier"
      >
        ⇅
      </button>
      {open && (
        <div className="absolute right-0 top-6 z-30 bg-[#1C1814] border border-[#2A231E] rounded-sm shadow-xl overflow-hidden" onMouseLeave={() => setOpen(false)}>
          {others.map((t) => (
            <button
              key={t}
              onClick={() => { onOverride(t); setOpen(false); }}
              className="block w-full px-3 py-2 text-[10px] uppercase tracking-wider text-left hover:bg-[#251E18] transition-colors"
              style={{ color: TIER_COLOR[t].text }}
            >
              Move to {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AquiferSettingsPanel ──────────────────────────────────────────────────────
// Inline (not a modal) — collapses in the main panel.

function AquiferProjectRow({
  project, onRemove, onUpdate, onPull,
}: {
  project: ConstellationProject;
  onRemove: (id: string) => void;
  onUpdate: (updated: ConstellationProject) => void;
  onPull: (p: ConstellationProject) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({ label: project.label, baseUrl: project.baseUrl, token: project.token });

  const handleSave = () => {
    if (!editFields.label.trim() || !editFields.baseUrl.trim()) return;
    onUpdate({ ...project, label: editFields.label.trim(), baseUrl: editFields.baseUrl.trim(), token: editFields.token.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditFields({ label: project.label, baseUrl: project.baseUrl, token: project.token });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-[#0D2010] border border-[#4ADE80]/30 rounded-sm px-3 py-2.5 space-y-2">
        <input
          value={editFields.label}
          onChange={(e) => setEditFields((f) => ({ ...f, label: e.target.value }))}
          placeholder="Project label"
          className="w-full text-[12px] text-[#86EFAC] bg-[#0A1A10] border border-[#1A3028] rounded-sm px-2.5 py-1.5 outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#2A4A38]"
        />
        <input
          value={editFields.baseUrl}
          onChange={(e) => setEditFields((f) => ({ ...f, baseUrl: e.target.value }))}
          placeholder="Base URL"
          className="w-full text-[12px] text-[#86EFAC] bg-[#0A1A10] border border-[#1A3028] rounded-sm px-2.5 py-1.5 outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#2A4A38]"
        />
        <input
          type="password"
          value={editFields.token}
          onChange={(e) => setEditFields((f) => ({ ...f, token: e.target.value }))}
          placeholder="Bearer token (optional)"
          className="w-full text-[12px] text-[#86EFAC] bg-[#0A1A10] border border-[#1A3028] rounded-sm px-2.5 py-1.5 outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#2A4A38]"
        />
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={handleSave}
            disabled={!editFields.label.trim() || !editFields.baseUrl.trim()}
            className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm bg-[#16A34A] text-[#0A1A10] hover:bg-[#4ADE80] disabled:opacity-30 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-sm border border-[#1A3028] text-[#4ADE80] hover:text-[#86EFAC] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#0D2010] border border-[#1A3028] rounded-sm px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-[#86EFAC] font-medium leading-tight">{project.label}</p>
        <p className="text-[10px] text-[#3A6A4A] truncate">{project.baseUrl}/api/tasks/proposed</p>
      </div>
      <button
        onClick={() => onPull(project)}
        className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm border border-[#1A3028] text-[#4ADE80] hover:text-[#86EFAC] hover:border-[#2A4A38] transition-colors flex-shrink-0"
      >
        Pull
      </button>
      <button
        onClick={() => setEditing(true)}
        className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm border border-[#1A3028] text-[#3A6A4A] hover:text-[#4ADE80] hover:border-[#2A4A38] transition-colors flex-shrink-0"
        title="Edit project"
      >
        Edit
      </button>
      <button onClick={() => onRemove(project.id)} className="text-[#2A4A38] hover:text-[#FCA5A5] text-[14px] leading-none transition-colors flex-shrink-0">×</button>
    </div>
  );
}

function AquiferSettingsPanel({
  projects, onAdd, onRemove, onUpdate, onReset, onPull, onPullAll, draft, setDraft, pulling, onClose,
}: {
  projects: ConstellationProject[];
  onAdd: (p: ConstellationProject) => void;
  onRemove: (id: string) => void;
  onUpdate: (updated: ConstellationProject) => void;
  onReset: () => void;
  onPull: (p: ConstellationProject) => void;
  onPullAll: () => void;
  draft: { label: string; baseUrl: string; token: string };
  setDraft: (d: { label: string; baseUrl: string; token: string }) => void;
  pulling: boolean;
  onClose: () => void;
}) {
  const canAdd = draft.label.trim() && draft.baseUrl.trim();

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ id: `aquifer-${Date.now()}`, label: draft.label.trim(), baseUrl: draft.baseUrl.trim(), token: draft.token.trim() });
    setDraft({ label: "", baseUrl: "", token: "" });
  };

  return (
    <div className="mb-4 rounded-sm border border-[#1A3028] bg-[#0A1A10] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1A3028]">
        <span className="text-[10px] text-[#4ADE80]">◎</span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#4ADE80] font-bold flex-1">Aquifer Projects</span>
        {projects.length > 0 && (
          <button
            onClick={onPullAll}
            disabled={pulling}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm bg-[#16A34A] text-[#0A1A10] hover:bg-[#4ADE80] disabled:opacity-40 transition-colors"
          >
            {pulling && <div className="w-2.5 h-2.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />}
            Pull all {projects.length}
          </button>
        )}
        <button onClick={onClose} className="text-[#2A4A38] hover:text-[#4ADE80] text-[16px] leading-none transition-colors ml-1">×</button>
      </div>

      <div className="px-4 py-3">
        <p className="text-[11px] text-[#3A6A4A] mb-3 leading-relaxed">
          One "Pull Aquifer" sweeps all projects below in parallel.
          Each project must expose <code className="text-[#4ADE80] text-[10px] bg-[#0D2010] px-1 py-0.5 rounded">GET /api/tasks/proposed</code>.
          Results appear as separate triage sections — never merged into the local queue.
        </p>

        {/* Project list with edit/remove per row */}
        {projects.length > 0 ? (
          <div className="space-y-1.5 mb-4">
            {projects.map((p) => (
              <AquiferProjectRow
                key={p.id}
                project={p}
                onRemove={onRemove}
                onUpdate={onUpdate}
                onPull={onPull}
              />
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-[#2A4A38] mb-4 italic">No projects yet — add one below.</p>
        )}

        {/* Add form */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              placeholder="Project label (e.g. Headwaters Books)"
              className="flex-1 text-[12px] text-[#86EFAC] bg-[#0D2010] border border-[#1A3028] rounded-sm px-3 py-2 outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#2A4A38]"
            />
          </div>
          <div className="flex gap-2">
            <input
              value={draft.baseUrl}
              onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
              placeholder="Base URL (e.g. https://project.replit.app)"
              className="flex-1 text-[12px] text-[#86EFAC] bg-[#0D2010] border border-[#1A3028] rounded-sm px-3 py-2 outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#2A4A38]"
            />
            <input
              type="password"
              value={draft.token}
              onChange={(e) => setDraft({ ...draft, token: e.target.value })}
              placeholder="Token (optional)"
              className="w-32 text-[12px] text-[#86EFAC] bg-[#0D2010] border border-[#1A3028] rounded-sm px-3 py-2 outline-none focus:border-[#4ADE80] transition-colors placeholder:text-[#2A4A38]"
            />
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="px-3 py-2 text-[11px] uppercase tracking-wider font-bold rounded-sm bg-[#1A3028] text-[#4ADE80] hover:bg-[#2A4A38] disabled:opacity-30 transition-colors flex-shrink-0"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Reset to defaults */}
        <div className="mt-3 pt-3 border-t border-[#1A3028] flex justify-end">
          <button
            onClick={onReset}
            className="text-[10px] uppercase tracking-wider text-[#3A6A4A] hover:text-[#86EFAC] transition-colors"
          >
            ↺ Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ConstellationConfig ───────────────────────────────────────────────────────

function ConstellationConfig({
  projects, onAdd, onRemove, onPull, onClose, draft, setDraft,
}: {
  projects: ConstellationProject[];
  onAdd: (p: ConstellationProject) => void;
  onRemove: (id: string) => void;
  onPull: (p: ConstellationProject) => void;
  onClose: () => void;
  draft: { label: string; baseUrl: string; token: string };
  setDraft: (d: { label: string; baseUrl: string; token: string }) => void;
}) {
  const canAdd = draft.label.trim() && draft.baseUrl.trim();
  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ id: `proj-${Date.now()}`, label: draft.label.trim(), baseUrl: draft.baseUrl.trim(), token: draft.token.trim() });
    setDraft({ label: "", baseUrl: "", token: "" });
  };

  return (
    <div
      className="fixed inset-0 bg-[#0A0807]/80 backdrop-blur-md z-50 flex items-end sm:items-center sm:justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:w-[480px] bg-[#181512] border-t sm:border border-[#251E18] rounded-t-sm sm:rounded-sm p-6 shadow-2xl max-h-[85dvh] overflow-y-auto">
        <div className="w-16 h-1 bg-[#251E18] rounded-full mx-auto mb-6 sm:hidden" />
        <h3 className="text-[18px] font-serif text-[#EAE4DB] mb-1">Constellation projects</h3>
        <p className="text-[13px] text-[#8C7B6D] mb-6 leading-relaxed">
          Add other Headwaters projects. Each project must expose <code className="text-[#A39485] text-[11px] bg-[#13110E] px-1 py-0.5 rounded">GET /api/tasks/proposed</code> — tasks are triaged and displayed as separate sections, not merged into this project's queue.
        </p>

        {projects.length > 0 && (
          <div className="space-y-2 mb-6">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#EAE4DB] font-medium">{p.label}</p>
                  <p className="text-[11px] text-[#5C5046] truncate">{p.baseUrl}/api/tasks/proposed</p>
                </div>
                <button onClick={() => onPull(p)} className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded-sm border border-[#2A231E] text-[#8C7B6D] hover:text-[#EAE4DB] hover:border-[#3D3228] transition-colors">
                  Pull
                </button>
                <button onClick={() => onRemove(p.id)} className="text-[#5C5046] hover:text-[#FCA5A5] text-[16px] leading-none transition-colors">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-bold block">Project label</label>
          <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. Headwaters Books" className="w-full text-[14px] text-[#EAE4DB] bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-3 outline-none focus:border-[#5C5046] transition-colors placeholder:text-[#4A3D33]" />
          <label className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-bold block">Base URL</label>
          <input value={draft.baseUrl} onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })} placeholder="https://yourapp.replit.app" className="w-full text-[14px] text-[#EAE4DB] bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-3 outline-none focus:border-[#5C5046] transition-colors placeholder:text-[#4A3D33]" />
          <label className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A5C] font-bold block">Bearer token (optional)</label>
          <input type="password" value={draft.token} onChange={(e) => setDraft({ ...draft, token: e.target.value })} placeholder="Leave blank for open endpoints" className="w-full text-[14px] text-[#EAE4DB] bg-[#13110E] border border-[#251E18] rounded-sm px-4 py-3 outline-none focus:border-[#5C5046] transition-colors placeholder:text-[#4A3D33]" />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3.5 text-[12px] uppercase tracking-wide font-bold text-[#8C7B6D] hover:text-[#EAE4DB] border border-[#2A231E] bg-[#1C1814] rounded-sm transition-colors">Done</button>
          <button onClick={handleAdd} disabled={!canAdd} className="flex-1 py-3.5 text-[12px] uppercase tracking-wide font-bold text-[#13110E] bg-[#8C7B6D] hover:bg-[#A39485] disabled:opacity-30 rounded-sm transition-colors">Add project</button>
        </div>
      </div>
    </div>
  );
}
