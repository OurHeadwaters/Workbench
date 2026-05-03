/**
 * SargeHQPage — Bobbie's morning dashboard.
 *
 * Left panel: Priority list editor (add / reorder / retire).
 * Right panel: Generated card set for the week (editable before locking).
 * Top bar: Weekly completion arc + lock button.
 *
 * Data lives in the api-server (/api/sarge/*).
 */

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Lock,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardStatus = "active" | "done" | "stuck";

interface Priority {
  id: string;
  label: string;
  order: number;
  isActive: boolean;
}

interface SargeCard {
  id: string;
  weekId: string;
  priorityId: string;
  priorityLabel: string;
  action: string;
  context: string | null;
  status: CardStatus;
  order: number;
  completedAt: string | null;
  barrierNote: string | null;
}

interface SargeWeek {
  id: string;
  weekOf: string;
  priorities: Priority[];
  isLocked: boolean;
  lockedAt: string | null;
  cards: SargeCard[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEED_PRIORITIES: Omit<Priority, "order">[] = [
  { id: "domains", label: "Get domains live (headwaters.ca + codetry domains — blocking for a week)", isActive: true },
  { id: "807-contract", label: "Deliver 807's contract (active engagement — progress this every day)", isActive: true },
  { id: "marketing", label: "Weekly marketing move (one visible thing: post, email, outreach, or pitch)", isActive: true },
  { id: "brightside", label: "Brightside product progress (even one small thing keeps momentum)", isActive: true },
  { id: "hiring", label: "Hiring pipeline (one action toward finding the five people)", isActive: true },
  { id: "homeschool", label: "Homeschool prep (don't let the afternoon session eat the morning context)", isActive: true },
];

const API = "/api/sarge";

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function currentISOWeek(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

// ─── Status icons ─────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: CardStatus }) {
  if (status === "done")
    return <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />;
  if (status === "stuck")
    return <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
  return <Circle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />;
}

// ─── Progress arc ─────────────────────────────────────────────────────────────

function ProgressArc({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? done / total : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#0F766E"
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor">
          {done}/{total}
        </text>
      </svg>
      <div>
        <p className="text-sm font-medium text-foreground">
          {total === 0 ? "No cards yet" : `${done} of ${total} done`}
        </p>
        <p className="text-xs text-muted-foreground">{currentISOWeek()}</p>
      </div>
    </div>
  );
}

// ─── Priority row ─────────────────────────────────────────────────────────────

function PriorityRow({
  priority,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  priority: Priority;
  index: number;
  total: number;
  onChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div
      className="flex items-start gap-2 p-3 rounded-lg border bg-card group"
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <div className="flex flex-col gap-0.5 pt-1 flex-shrink-0">
        <button
          onClick={() => onMoveUp(priority.id)}
          disabled={index === 0}
          className="text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20 transition-colors"
          aria-label="Move up"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <GripVertical className="h-4 w-4 text-muted-foreground/30" />
        <button
          onClick={() => onMoveDown(priority.id)}
          disabled={index === total - 1}
          className="text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20 transition-colors"
          aria-label="Move down"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <span className="flex-shrink-0 text-xs font-mono text-muted-foreground/60 w-4 pt-1">
        {index + 1}.
      </span>
      <textarea
        value={priority.label}
        onChange={(e) => onChange(priority.id, e.target.value)}
        rows={2}
        className="flex-1 text-sm bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
        placeholder="Priority description…"
      />
      <button
        onClick={() => onDelete(priority.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground/50 hover:text-destructive transition-all p-0.5 mt-0.5"
        aria-label="Remove priority"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Card row ─────────────────────────────────────────────────────────────────

function CardRow({
  card,
  locked,
  onEdit,
  onStatusChange,
}: {
  card: SargeCard;
  locked: boolean;
  onEdit: (id: string, field: "action" | "context", value: string) => void;
  onStatusChange: (id: string, status: CardStatus) => void;
}) {
  const statusColors: Record<CardStatus, string> = {
    active: "border-l-slate-300",
    done: "border-l-emerald-400",
    stuck: "border-l-amber-400",
  };

  return (
    <div
      className={`p-3 rounded-lg border border-l-4 bg-card ${statusColors[card.status]}`}
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => {
            const next: CardStatus =
              card.status === "active" ? "done" : card.status === "done" ? "stuck" : "active";
            onStatusChange(card.id, next);
          }}
          className="mt-0.5 flex-shrink-0"
          title="Toggle status"
        >
          <StatusIcon status={card.status} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono mb-0.5">
            {card.priorityLabel.split("(")[0]?.trim() ?? card.priorityLabel}
          </p>
          {locked ? (
            <p className="text-sm text-foreground leading-snug">{card.action}</p>
          ) : (
            <textarea
              value={card.action}
              onChange={(e) => onEdit(card.id, "action", e.target.value)}
              rows={2}
              className="w-full text-sm bg-transparent resize-none border-none outline-none text-foreground leading-snug"
            />
          )}
          {card.context && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {card.context}
            </p>
          )}
          {card.barrierNote && (
            <p className="text-xs text-amber-600 mt-1 italic">
              Barrier: {card.barrierNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SargeHQPage() {
  const [week, setWeek] = useState<SargeWeek | null>(null);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [cards, setCards] = useState<SargeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Derived
  const doneCount = cards.filter((c) => c.status === "done").length;
  const isLocked = week?.isLocked ?? false;

  // ─── Load current week ───────────────────────────────────────────────────

  const loadWeek = useCallback(async () => {
    try {
      const res = await fetch(`${API}/week/current`);
      const data = (await res.json()) as { week: SargeWeek | null };
      if (data.week) {
        setWeek(data.week);
        setPriorities(
          (data.week.priorities as Priority[]).sort((a, b) => a.order - b.order),
        );
        setCards(data.week.cards);
      } else {
        // First open: seed with suggested priorities
        const seeded: Priority[] = SEED_PRIORITIES.map((p, i) => ({
          ...p,
          order: i,
        }));
        setPriorities(seeded);
        setWeek(null);
        setCards([]);
      }
    } catch {
      setError("Could not load week data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeek();
    // Poll every 30s so completions from mobile reflect here
    const interval = setInterval(() => void loadWeek(), 30_000);
    return () => clearInterval(interval);
  }, [loadWeek]);

  // ─── Flash success ───────────────────────────────────────────────────────

  function flashSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  // ─── Priority operations ─────────────────────────────────────────────────

  function addPriority() {
    const newP: Priority = {
      id: uid(),
      label: "",
      order: priorities.length,
      isActive: true,
    };
    setPriorities((ps) => [...ps, newP]);
  }

  function updatePriority(id: string, label: string) {
    setPriorities((ps) => ps.map((p) => (p.id === id ? { ...p, label } : p)));
  }

  function deletePriority(id: string) {
    setPriorities((ps) => ps.filter((p) => p.id !== id));
    setCards((cs) => cs.filter((c) => c.priorityId !== id));
  }

  function movePriority(id: string, dir: "up" | "down") {
    setPriorities((ps) => {
      const idx = ps.findIndex((p) => p.id === id);
      if (idx === -1) return ps;
      const next = [...ps];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return ps;
      [next[idx], next[swap]] = [next[swap]!, next[idx]!];
      return next.map((p, i) => ({ ...p, order: i }));
    });
  }

  // ─── Generate cards ──────────────────────────────────────────────────────

  async function handleGenerate() {
    const activePriorities = priorities.filter((p) => p.isActive && p.label.trim());
    if (activePriorities.length === 0) {
      setError("Add at least one priority before generating.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priorities: activePriorities }),
      });
      if (!res.ok) throw new Error("Generate failed");
      const data = (await res.json()) as {
        cards: Omit<SargeCard, "id" | "weekId" | "status" | "order" | "completedAt" | "barrierNote">[];
      };
      const generated: SargeCard[] = data.cards.map((c, i) => ({
        id: uid(),
        weekId: week?.id ?? "",
        priorityId: c.priorityId,
        priorityLabel: c.priorityLabel,
        action: c.action,
        context: c.context,
        status: "active",
        order: i,
        completedAt: null,
        barrierNote: null,
      }));
      setCards(generated);
      flashSuccess("Cards generated — review and edit before locking.");
    } catch {
      setError("AI generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ─── Save week (auto-save priorities + cards) ────────────────────────────

  async function handleSave(lockWeek = false) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API}/week`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekOf: currentISOWeek(),
          priorities: priorities.map((p, i) => ({ ...p, order: i })),
          isLocked: lockWeek,
          cards: cards.map((c, i) => ({ ...c, order: i })),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = (await res.json()) as { week: SargeWeek };
      setWeek(data.week);
      setCards(data.week.cards);
      flashSuccess(lockWeek ? "Week locked — Sarge is ready on mobile." : "Saved.");
    } catch {
      setError("Save failed. Check your connection.");
    } finally {
      setSaving(false);
      setLocking(false);
    }
  }

  async function handleLock() {
    setLocking(true);
    await handleSave(true);
  }

  // ─── Card edits ──────────────────────────────────────────────────────────

  function editCard(id: string, field: "action" | "context", value: string) {
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  async function toggleCardStatus(id: string, status: CardStatus) {
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    if (week) {
      try {
        await fetch(`${API}/card/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        // Silent — local state already updated
      }
    }
  }

  // ─── Grouped cards by priority ───────────────────────────────────────────

  const grouped = priorities
    .filter((p) => p.isActive)
    .map((p) => ({
      priority: p,
      cards: cards.filter((c) => c.priorityId === p.id).sort((a, b) => a.order - b.order),
    }))
    .filter((g) => g.cards.length > 0);

  // ─── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Loading Sarge HQ…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Sarge HQ
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Set direction each morning. Lock the week. Let Sarge take it mobile.
          </p>
        </div>
        <ProgressArc done={doneCount} total={cards.length} />
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {successMsg}
        </div>
      )}

      {isLocked && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>
            Week is locked — mobile is live. Completions sync automatically every 30 s.
            {" "}
            <button
              onClick={async () => {
                setSaving(true);
                await fetch(`${API}/week`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    weekOf: currentISOWeek(),
                    priorities: priorities.map((p, i) => ({ ...p, order: i })),
                    isLocked: false,
                    cards,
                  }),
                });
                await loadWeek();
                setSaving(false);
              }}
              className="underline underline-offset-2 font-medium hover:text-amber-900 transition-colors"
            >
              Unlock to regenerate
            </button>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Left: Priorities ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">This Week's Priorities</h2>
            <button
              onClick={addPriority}
              disabled={isLocked}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add priority
            </button>
          </div>

          <div className="space-y-2">
            {priorities.map((p, i) => (
              <PriorityRow
                key={p.id}
                priority={p}
                index={i}
                total={priorities.length}
                onChange={updatePriority}
                onDelete={deletePriority}
                onMoveUp={(id) => movePriority(id, "up")}
                onMoveDown={(id) => movePriority(id, "down")}
              />
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={generating || isLocked}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generating…" : "Generate this week's cards"}
            </button>
            <button
              onClick={() => void handleSave(false)}
              disabled={saving || isLocked}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground border transition-colors disabled:opacity-40"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
              Save priorities
            </button>
          </div>
        </section>

        {/* ─── Right: Cards ───────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Week's Cards
              {cards.length > 0 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {cards.length} total
                </span>
              )}
            </h2>
            {!isLocked && cards.length > 0 && (
              <button
                onClick={() => void handleLock()}
                disabled={locking}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {locking ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                Lock week
              </button>
            )}
          </div>

          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground rounded-lg border border-dashed" style={{ borderColor: "hsl(var(--border))" }}>
              <Smartphone className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No cards yet.</p>
              <p className="text-xs mt-0.5">Set your priorities, then generate.</p>
            </div>
          ) : grouped.length > 0 ? (
            <div className="space-y-4">
              {grouped.map(({ priority, cards: groupCards }) => (
                <div key={priority.id} className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-mono px-1">
                    {priority.label.split("(")[0]?.trim() ?? priority.label}
                  </p>
                  {groupCards.map((card) => (
                    <CardRow
                      key={card.id}
                      card={card}
                      locked={isLocked}
                      onEdit={editCard}
                      onStatusChange={(id, status) => void toggleCardStatus(id, status)}
                    />
                  ))}
                </div>
              ))}
              {/* Ungrouped cards (priority might have been renamed) */}
              {cards
                .filter((c) => !priorities.find((p) => p.id === c.priorityId))
                .map((card) => (
                  <CardRow
                    key={card.id}
                    card={card}
                    locked={isLocked}
                    onEdit={editCard}
                    onStatusChange={(id, status) => void toggleCardStatus(id, status)}
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-2">
              {cards.map((card) => (
                <CardRow
                  key={card.id}
                  card={card}
                  locked={isLocked}
                  onEdit={editCard}
                  onStatusChange={(id, status) => void toggleCardStatus(id, status)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
