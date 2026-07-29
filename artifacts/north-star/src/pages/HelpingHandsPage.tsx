import { useStore } from "@/store";
import { HelpingHandsStatus, HelpingHandsTask } from "@/types";
import {
  BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_2, AMBER, AMBER_WASH, FONT_DISPLAY,
} from "@/lib/theme";
import { Plus, X, HandHelping, CheckCheck, Check, Users, Archive, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

// ── Status badge ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<HelpingHandsStatus, string> = {
  open:      "Open",
  claimed:   "Claimed",
  done:      "Done",
  confirmed: "Confirmed",
};

const STATUS_COLOR: Record<HelpingHandsStatus, { bg: string; text: string }> = {
  open:      { bg: "rgba(200,146,58,0.14)", text: AMBER },
  claimed:   { bg: "rgba(86,150,110,0.16)", text: "#7ABF94" },
  done:      { bg: "rgba(86,130,200,0.14)", text: "#8DB4E8" },
  confirmed: { bg: "rgba(160,160,160,0.12)", text: "rgba(237,232,213,0.5)" },
};

function StatusBadge({ status }: { status: HelpingHandsStatus }) {
  const { bg, text } = STATUS_COLOR[status];
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: bg, color: text }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

// ── Add task form ────────────────────────────────────────────────────────────

function AddTaskForm({ onClose }: { onClose: () => void }) {
  const addHelpingHandsTask = useStore((s) => s.addHelpingHandsTask);
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addHelpingHandsTask({ title: trimmed });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-t-2xl pb-safe-bottom"
        style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER_STRONG}` }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2
            className="text-lg font-semibold"
            style={{ color: TEXT, fontFamily: FONT_DISPLAY }}
          >
            Post a task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full"
            style={{ color: TEXT_2 }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_2 }}>
              What needs doing?
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unload the delivery truck"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: "rgba(237,232,213,0.06)",
                border: `1px solid ${BORDER}`,
                color: TEXT,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: AMBER,
              color: "#0B0905",
              opacity: title.trim() ? 1 : 0.4,
            }}
          >
            Post task
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task }: { task: HelpingHandsTask }) {
  const claim    = useStore((s) => s.claimHelpingHandsTask);
  const complete = useStore((s) => s.completeHelpingHandsTask);
  const confirm  = useStore((s) => s.confirmHelpingHandsTask);
  const archive  = useStore((s) => s.archiveHelpingHandsTask);
  const restore  = useStore((s) => s.restoreHelpingHandsTask);

  return (
    <div
      className="rounded-xl px-4 py-3 space-y-2"
      style={{
        backgroundColor: "rgba(237,232,213,0.04)",
        border: `1px solid ${BORDER}`,
        opacity: task.status === "confirmed" ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <HandHelping
          size={15}
          style={{ color: TEXT_2, flexShrink: 0, marginTop: 2 }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: TEXT }}>
            {task.title}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: TEXT_2 }}>
            Posted {new Date(task.postedAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Action buttons — progress through the lifecycle */}
      <div className="flex gap-2 pl-6">
        {task.status === "open" && (
          <button
            onClick={() => claim(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: AMBER_WASH, color: AMBER }}
          >
            <Users size={12} />
            Claim
          </button>
        )}
        {task.status === "claimed" && (
          <button
            onClick={() => complete(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "rgba(86,130,200,0.14)", color: "#8DB4E8" }}
          >
            <Check size={12} />
            Mark done
          </button>
        )}
        {task.status === "done" && (
          <button
            onClick={() => confirm(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "rgba(86,150,110,0.16)", color: "#7ABF94" }}
          >
            <CheckCheck size={12} />
            Confirm
          </button>
        )}
        {task.status === "confirmed" && !task.archivedAt && (
          <button
            onClick={() => archive(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "rgba(160,160,160,0.10)", color: TEXT_2 }}
          >
            <Archive size={12} />
            Dismiss
          </button>
        )}
        {task.archivedAt && (
          <button
            onClick={() => restore(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "rgba(200,146,58,0.10)", color: AMBER }}
          >
            <RotateCcw size={12} />
            Restore
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const STATUS_ORDER: HelpingHandsStatus[] = ["open", "claimed", "done", "confirmed"];

export function HelpingHandsPage() {
  const tasks   = useStore((s) => s.helpingHandsTasks);
  const archive = useStore((s) => s.archiveHelpingHandsTask);
  const [addOpen, setAddOpen] = useState(false);
  const [archivedOpen, setArchivedOpen] = useState(false);

  // Auto-archive confirmed tasks that have been sitting for longer than the threshold.
  useEffect(() => {
    function runAutoArchive() {
      const now = Date.now();
      tasks
        .filter(
          (t) =>
            !t.archivedAt &&
            t.status === "confirmed" &&
            t.confirmedAt &&
            now - new Date(t.confirmedAt).getTime() >= AUTO_ARCHIVE_AFTER_MS,
        )
        .forEach((t) => archive(t.id));
    }

    runAutoArchive();
    const timer = setInterval(runAutoArchive, AUTO_ARCHIVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [tasks, archive]);

  const active = [...tasks]
    .filter((t) => !t.archivedAt)
    .sort((a, b) => {
      const ai = STATUS_ORDER.indexOf(a.status);
      const bi = STATUS_ORDER.indexOf(b.status);
      if (ai !== bi) return ai - bi;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

  const archived = [...tasks]
    .filter((t) => !!t.archivedAt)
    .sort((a, b) => new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime());

  return (
    <div className="min-h-dvh pb-32" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-safe-top pb-4"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center justify-between pt-4">
          <h1
            className="text-xl font-semibold"
            style={{ color: TEXT, fontFamily: FONT_DISPLAY }}
          >
            Helping Hands
          </h1>
          <button
            onClick={() => setAddOpen(true)}
            aria-label="Post a task"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: AMBER_WASH, color: AMBER }}
          >
            <Plus size={15} />
            Post task
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {active.length === 0 && archived.length === 0 && (
          <p className="text-sm text-center pt-12" style={{ color: TEXT_2 }}>
            No tasks yet. Post one to get started.
          </p>
        )}
        {active.length === 0 && archived.length > 0 && (
          <p className="text-sm text-center pt-8" style={{ color: TEXT_2 }}>
            All tasks have been completed.
          </p>
        )}
        {active.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>

      {/* Archived / completed section */}
      {archived.length > 0 && (
        <div className="px-4 pt-6">
          <button
            onClick={() => setArchivedOpen((o) => !o)}
            className="flex items-center gap-2 text-xs font-medium mb-3"
            style={{ color: TEXT_2 }}
          >
            {archivedOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            Completed ({archived.length})
          </button>
          {archivedOpen && (
            <div className="space-y-3 opacity-60">
              {archived.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}

      {addOpen && <AddTaskForm onClose={() => setAddOpen(false)} />}
    </div>
  );
}

/** Confirmed tasks older than this are auto-archived. Change to adjust the window. */
const AUTO_ARCHIVE_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours

/** How often the page re-checks while mounted. */
const AUTO_ARCHIVE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
