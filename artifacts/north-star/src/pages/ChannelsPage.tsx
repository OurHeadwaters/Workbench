import { useMemo, useState } from "react";
import { useStore } from "@/store";
import type { ChannelCategory, ChannelMeta } from "@/types";
import { BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_2, AMBER, FONT_DISPLAY } from "@/lib/theme";
import { Hash, Clock, Archive, Plus, X } from "lucide-react";

const CATEGORY_LABELS: Record<ChannelCategory, string> = {
  main:           "Main",
  workbench:      "Workbench",
  "helping-hands": "Helping Hands",
  briefing:       "Briefing",
  lab:            "Lab",
};

const CATEGORY_ORDER: ChannelCategory[] = ["main", "workbench", "helping-hands", "briefing", "lab"];

const TTL_OPTIONS: { label: string; minutes: number | null }[] = [
  { label: "No expiry", minutes: null },
  { label: "30 min",    minutes: 30 },
  { label: "2 hours",   minutes: 120 },
  { label: "End of day", minutes: null }, // special — computed
];

function useNow(intervalMs = 10_000) {
  const [now, setNow] = useState(() => Date.now());
  useMemo(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function formatTTL(expiresAt: string, now: number): string {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return "expired";
  const totalMin = Math.floor(ms / 60_000);
  if (totalMin < 60) return `${totalMin}m left`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m left` : `${h}h left`;
}

function endOfDay(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

interface AddChannelFormProps {
  onClose: () => void;
}

function AddChannelForm({ onClose }: AddChannelFormProps) {
  const addChannel = useStore((s) => s.addChannel);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<ChannelCategory>("workbench");
  const [ttlIdx, setTtlIdx] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    let expiresAt: string | undefined;
    const opt = TTL_OPTIONS[ttlIdx];
    if (opt.label === "End of day") {
      expiresAt = endOfDay();
    } else if (opt.minutes !== null) {
      expiresAt = new Date(Date.now() + opt.minutes * 60_000).toISOString();
    }
    addChannel({ label: label.trim(), category, expiresAt, createdBy: "human" });
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
          <h2 className="text-lg" style={{ color: TEXT, fontFamily: FONT_DISPLAY, fontWeight: 600 }}>
            New Channel
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
          {/* Label */}
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_2 }}>Channel name</label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. deer-lake-burst"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: "rgba(237,232,213,0.06)",
                border: `1px solid ${BORDER}`,
                color: TEXT,
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_2 }}>Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: category === cat ? AMBER : "rgba(237,232,213,0.06)",
                    color: category === cat ? "#0B0905" : TEXT_2,
                    border: `1px solid ${category === cat ? AMBER : BORDER}`,
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* TTL */}
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_2 }}>Expires</label>
            <div className="flex flex-wrap gap-2">
              {TTL_OPTIONS.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setTtlIdx(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: ttlIdx === i ? "rgba(200,146,58,0.18)" : "rgba(237,232,213,0.06)",
                    color: ttlIdx === i ? AMBER : TEXT_2,
                    border: `1px solid ${ttlIdx === i ? AMBER : BORDER}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!label.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: AMBER,
              color: "#0B0905",
              opacity: label.trim() ? 1 : 0.4,
            }}
          >
            Add Channel
          </button>
        </div>
      </form>
    </div>
  );
}

interface ChannelRowProps {
  ch: ChannelMeta;
  now: number;
  onExpire: (id: string) => void;
}

function ChannelRow({ ch, now, onExpire }: ChannelRowProps) {
  const isExpired = ch.expiresAt ? new Date(ch.expiresAt).getTime() <= now : false;
  const isArchived = !!ch.archivedAt;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        backgroundColor: "rgba(237,232,213,0.04)",
        border: `1px solid ${BORDER}`,
        opacity: isArchived || isExpired ? 0.55 : 1,
      }}
    >
      <Hash size={14} style={{ color: TEXT_2, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: TEXT }}>{ch.label}</p>
        <p className="text-xs" style={{ color: TEXT_2 }}>
          {CATEGORY_LABELS[ch.category]}
          {" · "}
          <span style={{ color: TEXT_2, fontSize: "0.7rem" }}>
            {ch.createdBy === "agent" ? "agent" : "human"}
          </span>
        </p>
      </div>

      {/* TTL badge or archived pill */}
      {isArchived ? (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: "rgba(237,232,213,0.08)", color: TEXT_2 }}
        >
          <Archive size={10} />
          archived
        </span>
      ) : isExpired ? (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: "rgba(237,232,213,0.08)", color: TEXT_2 }}
        >
          <Archive size={10} />
          expired
        </span>
      ) : ch.expiresAt ? (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: "rgba(200,146,58,0.12)", color: AMBER }}
        >
          <Clock size={10} />
          {formatTTL(ch.expiresAt, now)}
        </span>
      ) : null}

      {/* Expire / archive button — only for active non-archived channels */}
      {!isArchived && (
        <button
          onClick={() => onExpire(ch.id)}
          aria-label="Archive channel"
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-colors"
          style={{ color: TEXT_2 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function ChannelsPage() {
  const channels = useStore((s) => s.channels);
  const expireChannel = useStore((s) => s.expireChannel);
  const now = useNow();
  const [addOpen, setAddOpen] = useState(false);

  // Auto-expire any ephemeral channels that have passed their expiry
  const processed = useMemo(() => {
    return channels.map((ch) => {
      if (!ch.archivedAt && ch.expiresAt && new Date(ch.expiresAt).getTime() <= now) {
        return { ...ch, archivedAt: ch.expiresAt };
      }
      return ch;
    });
  }, [channels, now]);

  const grouped = useMemo(() => {
    const map: Record<ChannelCategory, ChannelMeta[]> = {
      main: [], workbench: [], "helping-hands": [], briefing: [], lab: [],
    };
    for (const ch of processed) map[ch.category].push(ch);
    return map;
  }, [processed]);

  const hasAny = processed.length > 0;

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
            Channels
          </h1>
          <button
            onClick={() => setAddOpen(true)}
            aria-label="Add channel"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "rgba(200,146,58,0.12)", color: AMBER }}
          >
            <Plus size={15} />
            New
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {!hasAny && (
          <p className="text-sm text-center pt-12" style={{ color: TEXT_2 }}>
            No channels yet. Create one to get started.
          </p>
        )}

        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-2 px-1"
                style={{ color: TEXT_2 }}
              >
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="space-y-2">
                {items.map((ch) => (
                  <ChannelRow
                    key={ch.id}
                    ch={ch}
                    now={now}
                    onExpire={expireChannel}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {addOpen && <AddChannelForm onClose={() => setAddOpen(false)} />}
    </div>
  );
}
