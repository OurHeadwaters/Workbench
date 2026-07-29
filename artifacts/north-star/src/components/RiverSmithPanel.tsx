/**
 * RiverSmithPanel — collapsible River Smith briefing section for the Kitchen Table.
 *
 * - Fetches the latest published briefing from /api/river-smith/briefing/latest
 * - Owner-only "Generate Now" button triggers a fresh briefing
 * - Archive dropdown shows past 30 briefings by date
 * - Renders markdown using a simple in-house parser (no dep needed)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { publishToRelay, RELAY_EVENT_KINDS, getZ2Npub } from "@/lib/relay-stub";
import type { ProofOfWork } from "@/lib/relay-event-types";
import { useStore } from "@/store";

interface SafetyFlag {
  text: string;
  reason: string;
  source: string;
}

interface Briefing {
  id: string;
  generatedAt: string;
  rawMarkdown: string;
  triggeredBy: string;
  safetyFlagsCount?: number;
  proofOfWork?: ProofOfWork | null;
}

interface ArchiveEntry {
  id: string;
  generatedAt: string;
  triggeredBy: string;
  status: string;
  emailStatus: "sent" | "failed" | "skipped" | null;
}

function getOwnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("library.ownerToken") ||
    window.localStorage.getItem("ownerToken") ||
    null
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Proof-of-work helpers ─────────────────────────────────────────────────────

/** djb2-variant hash of a string — produces an 8-char hex fingerprint. */
function simpleHash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h | 0; // keep 32-bit
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** Extract section headings (##) from River Smith markdown. */
function extractSections(md: string): string[] {
  return md
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3).trim());
}

/** Compute a ProofOfWork block describing what changed vs. the previous briefing. */
function computeProof(
  prev: Briefing | null,
  nextMarkdown: string,
  nextFlagsCount: number,
): ProofOfWork {
  if (!prev) {
    return {
      changed_fields: ["briefing_content"],
      summary: "First briefing — no previous record to compare.",
    };
  }

  const changed: string[] = [];
  const notes: string[] = [];

  // Flag count diff
  const prevFlags = prev.safetyFlagsCount ?? 0;
  if (prevFlags !== nextFlagsCount) {
    changed.push("safety_flags_count");
    const delta = nextFlagsCount - prevFlags;
    notes.push(
      `safety flags ${delta > 0 ? "+" : ""}${delta} (${prevFlags} → ${nextFlagsCount})`,
    );
  }

  // Section headings diff
  const prevSections = extractSections(prev.rawMarkdown);
  const nextSections = extractSections(nextMarkdown);
  const added = nextSections.filter((s) => !prevSections.includes(s));
  const removed = prevSections.filter((s) => !nextSections.includes(s));
  if (added.length > 0 || removed.length > 0) {
    changed.push("sections");
    if (added.length > 0) notes.push(`+${added.length} section${added.length > 1 ? "s" : ""}: ${added.join(", ")}`);
    if (removed.length > 0) notes.push(`−${removed.length} section${removed.length > 1 ? "s" : ""}: ${removed.join(", ")}`);
  }

  // Content length diff (flag if > 5% change)
  const prevLen = prev.rawMarkdown.length;
  const nextLen = nextMarkdown.length;
  const pct = prevLen > 0 ? Math.abs(nextLen - prevLen) / prevLen : 1;
  if (pct > 0.05) {
    changed.push("content_length");
    const sign = nextLen > prevLen ? "+" : "−";
    notes.push(`content ${sign}${Math.round(pct * 100)}% (${prevLen} → ${nextLen} chars)`);
  }

  if (changed.length === 0) {
    return {
      changed_fields: [],
      summary: "No structural changes detected vs. previous briefing.",
      previous_snapshot_hash: simpleHash(prev.rawMarkdown),
    };
  }

  return {
    changed_fields: changed,
    summary: notes.join("; "),
    previous_snapshot_hash: simpleHash(prev.rawMarkdown),
  };
}

// ── Proof card component ──────────────────────────────────────────────────────

interface ProofCardProps {
  proof: ProofOfWork;
  briefingId: string;
  sentAt: string;
}

function ProofCard({ proof, briefingId, sentAt }: ProofCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#1E332E] bg-[#0C1410] rounded-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-[#0F1A14] transition-colors"
      >
        <span className="text-[11px]">✓</span>
        <span className="text-[11px] text-[#4A8A7C] font-semibold tracking-wide flex-1">
          What was sent
        </span>
        {proof.changed_fields.length > 0 && (
          <span className="text-[10px] text-[#2A6A5C] bg-[#0D1F1C] border border-[#1A3A33] rounded px-1.5 py-0.5">
            {proof.changed_fields.length} change{proof.changed_fields.length !== 1 ? "s" : ""}
          </span>
        )}
        <span className="text-[10px] text-[#2A4A43] ml-1">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-[#1A2E28] px-4 py-3 space-y-3">
          {/* Summary */}
          <p className="text-[12px] text-[#8C7B6D] leading-relaxed">{proof.summary}</p>

          {/* Changed fields */}
          {proof.changed_fields.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#3A5A52] font-bold mb-1.5">
                Changed fields
              </p>
              <div className="flex flex-wrap gap-1.5">
                {proof.changed_fields.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] font-mono text-[#4A8A7C] bg-[#0D1F1C] border border-[#1A3A33] rounded px-1.5 py-0.5"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-[#1A2E28]">
            <span className="text-[10px] font-mono text-[#3A5A52]">
              id: {briefingId.slice(0, 12)}…
            </span>
            {proof.previous_snapshot_hash && (
              <span className="text-[10px] font-mono text-[#3A5A52]">
                prev: {proof.previous_snapshot_hash}
              </span>
            )}
            <span className="text-[10px] text-[#3A5A52] ml-auto">
              {new Date(sentAt).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lightweight markdown renderer ─────────────────────────────────────────────
// Handles the fixed River Smith output format:
//   ## heading, ### heading, **bold**, - bullets, *italic*, blank lines

/**
 * Split markdown into a preamble + sections keyed by their ## heading.
 * Each section's body is the raw markdown lines between that heading and the next one.
 */
function splitSections(md: string): { heading: string; body: string }[] {
  const lines = md.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; bodyLines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) {
        sections.push({ heading: current.heading, body: current.bodyLines.join("\n").trim() });
      }
      current = { heading: line.slice(3).trim(), bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    }
  }
  if (current) {
    sections.push({ heading: current.heading, body: current.bodyLines.join("\n").trim() });
  }
  return sections;
}

function RiverMarkdown({ text, onPropose }: { text: string; onPropose?: (heading: string, body: string) => void }) {
  const sectionBodies = onPropose
    ? Object.fromEntries(splitSections(text).map((s) => [s.heading, s.body]))
    : {};

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();
      elements.push(
        <h2
          key={i}
          className="group text-[17px] font-serif text-[#EAE4DB] tracking-wide mt-4 mb-1 flex items-center gap-2"
        >
          <span>{inlineMarkdown(heading)}</span>
          {onPropose && (
            <button
              onClick={() => onPropose(heading, sectionBodies[heading] ?? "")}
              title={`Pre-fill proposal from "${heading}"`}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity flex-shrink-0 text-[10px] text-[#4A8A7C] border border-[#2A4A43] bg-[#0D1F1C] hover:bg-[#1A3A33] rounded px-1.5 py-0.5 font-sans font-semibold tracking-[0.08em] leading-none"
            >
              → Propose
            </button>
          )}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-[12px] uppercase tracking-[0.15em] text-[#8C7B6D] font-bold mt-5 mb-2">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("**Decision ")) {
      elements.push(
        <p key={i} className="text-[14px] font-semibold text-[#C5A96A] mt-4 mb-1">
          {inlineMarkdown(line)}
        </p>,
      );
    } else if (line.startsWith("*Why it can't wait:*") || line.startsWith("*The options:*") || line.startsWith("*Weight:*")) {
      elements.push(
        <p key={i} className="text-[13px] text-[#A39485] ml-3 mb-1 leading-relaxed">
          {inlineMarkdown(line)}
        </p>,
      );
    } else if (line.startsWith("A) ") || line.startsWith("B) ") || line.startsWith("C) ")) {
      elements.push(
        <p key={i} className="text-[13px] text-[#D8D0C5] ml-6 mb-0.5 leading-relaxed">
          {line}
        </p>,
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <li key={i} className="text-[13px] text-[#C5B6A5] leading-relaxed mb-1 ml-4 list-none flex gap-2">
          <span className="text-[#5C5046] flex-shrink-0 mt-0.5">·</span>
          <span>{inlineMarkdown(line.slice(2))}</span>
        </li>,
      );
    } else if (line === "---") {
      elements.push(<hr key={i} className="border-[#251E18] my-3" />);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-[13px] text-[#C5B6A5] leading-relaxed mb-1">
          {inlineMarkdown(line)}
        </p>,
      );
    }

    i++;
  }

  return <div className="select-text">{elements}</div>;
}

function inlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-[#EAE4DB] font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="text-[#A39485] not-italic font-medium">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// ── Email delivery badge ──────────────────────────────────────────────────────

function EmailBadge({ status }: { status: "sent" | "failed" | "skipped" | null }) {
  if (!status) return null;

  const styles: Record<string, { label: string; icon: string; text: string; bg: string; border: string }> = {
    sent: {
      label: "email sent",
      icon: "✉",
      text: "#4A8A7C",
      bg: "#0D1F1C",
      border: "#1A3A33",
    },
    failed: {
      label: "email failed",
      icon: "✉",
      text: "#A05A3A",
      bg: "#1A0E0A",
      border: "#3A1A0A",
    },
    skipped: {
      label: "email skipped",
      icon: "✉",
      text: "#5C5046",
      bg: "#141210",
      border: "#251E18",
    },
  };

  const s = styles[status];
  if (!s) return null;

  return (
    <span
      title={s.label}
      style={{
        color: s.text,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono flex-shrink-0"
    >
      {s.icon} {status}
    </span>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

interface RiverSmithPanelProps {
  defaultOpen?: boolean;
  embedded?: boolean;
}

export function RiverSmithPanel({ defaultOpen = false, embedded = false }: RiverSmithPanelProps) {
  const token = getOwnerToken();
  const isOwner = !!token;

  const [open, setOpen] = useState(defaultOpen);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);

  const [flagsOpen, setFlagsOpen] = useState(false);
  const [flags, setFlags] = useState<SafetyFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(false);
  const [flagsError, setFlagsError] = useState<string | null>(null);

  const [proofCard, setProofCard] = useState<{ proof: ProofOfWork; briefingId: string; sentAt: string } | null>(null);

  const addProposal = useStore((s) => s.addProposal);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [proposeTitle, setProposeTitle] = useState("");
  const [proposeDesc, setProposeDesc] = useState("");
  const [proposeSurface, setProposeSurface] = useState("");
  const [proposeSuccess, setProposeSuccess] = useState(false);
  const [proposing, setProposing] = useState(false);
  const proposeFormRef = useRef<HTMLDivElement>(null);

  const handleProposeFromSection = (heading: string, body: string) => {
    setProposeTitle(heading);
    setProposeDesc(body);
    setProposeSurface(heading);
    setProposeOpen(true);
    setProposeSuccess(false);
    // Scroll the form into view after React has rendered it.
    setTimeout(() => {
      proposeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
  };

  const handlePropose = () => {
    if (!proposeTitle.trim() || !proposeDesc.trim() || proposing) return;
    setProposing(true);
    addProposal({
      agent_role: "river-smith",
      title: proposeTitle.trim(),
      description: proposeDesc.trim(),
      affected_surface: proposeSurface.trim() || "North Star",
      relay_event_ref: briefing?.id,
    });
    setProposeTitle("");
    setProposeDesc("");
    setProposeSurface("");
    setProposeOpen(false);
    setProposeSuccess(true);
    setProposing(false);
    setTimeout(() => setProposeSuccess(false), 3500);
  };

  const fetchLatest = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setProofCard(null);
    try {
      const res = await fetch("/api/river-smith/briefing/latest", {
        headers: { "x-library-owner-token": token },
      });
      if (res.status === 404) {
        setBriefing(null);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Briefing;
      setBriefing(data);
      // Rehydrate the proof card from the stored value so it survives a reload.
      if (data.proofOfWork) {
        setProofCard({ proof: data.proofOfWork, briefingId: data.id, sentAt: data.generatedAt });
      } else {
        setProofCard(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load briefing.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (open && !briefing && !loading) {
      void fetchLatest();
    }
  }, [open, briefing, loading, fetchLatest]);

  const handleGenerate = async () => {
    if (!token || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/river-smith/generate", {
        method: "POST",
        headers: { "x-library-owner-token": token, "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { rawMarkdown: string; id: string; safetyFlagsCount?: number; proofOfWork?: ProofOfWork };
      const generatedAt = new Date().toISOString();
      const nextFlagsCount = data.safetyFlagsCount ?? 0;

      // Use server-stored proof when available; fall back to local computation.
      const proof = data.proofOfWork ?? computeProof(briefing, data.rawMarkdown, nextFlagsCount);

      setBriefing({ id: data.id, rawMarkdown: data.rawMarkdown, generatedAt, triggeredBy: "manual", safetyFlagsCount: nextFlagsCount, proofOfWork: proof });
      setArchive([]);
      setFlags([]);
      setFlagsOpen(false);
      setFlagsError(null);
      setProofCard({ proof, briefingId: data.id, sentAt: generatedAt });

      void publishToRelay({
        kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
        payload: {
          zone: "Z2",
          actor_type: "agent",
          agent_role: "river-smith",
          briefing_id: data.id,
          generated_at: generatedAt,
          triggered_by: "manual",
          safety_flags_count: nextFlagsCount,
          proof_of_work: proof,
        },
        z2npub: getZ2Npub(),
        timestamp: generatedAt,
        signature: "stub",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const fetchArchive = async () => {
    if (!token || archiveLoading) return;
    setArchiveLoading(true);
    try {
      const res = await fetch("/api/river-smith/briefings", {
        headers: { "x-library-owner-token": token },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { briefings: ArchiveEntry[] };
      setArchive(data.briefings);
    } catch {
      // silently ignore
    } finally {
      setArchiveLoading(false);
    }
  };

  const loadArchiveBriefing = async (id: string) => {
    if (!token) return;
    setArchiveOpen(false);
    setLoading(true);
    setFlags([]);
    setFlagsOpen(false);
    setFlagsError(null);
    try {
      const res = await fetch(`/api/river-smith/briefing/${id}`, {
        headers: { "x-library-owner-token": token },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Briefing;
      setBriefing(data);
      // Show stored proof card if this archived briefing has one.
      if (data.proofOfWork) {
        setProofCard({ proof: data.proofOfWork, briefingId: data.id, sentAt: data.generatedAt });
      } else {
        setProofCard(null);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchFlags = async (id: string) => {
    if (!token || flagsLoading) return;
    setFlagsLoading(true);
    setFlagsError(null);
    try {
      const res = await fetch(`/api/river-smith/briefing/${id}/flags`, {
        headers: { "x-library-owner-token": token },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { flags: SafetyFlag[] };
      setFlags(data.flags);
    } catch (e) {
      setFlagsError(e instanceof Error ? e.message : "Failed to load flagged items.");
    } finally {
      setFlagsLoading(false);
    }
  };

  const toggleFlags = () => {
    if (!briefing) return;
    const next = !flagsOpen;
    setFlagsOpen(next);
    if (next && flags.length === 0) void fetchFlags(briefing.id);
  };

  if (!isOwner) return null;

  return (
    <div className="flex-shrink-0 z-10 border-b border-[#251E18]">
      {/* ── Collapsed header — hidden when embedded inside a drawer ── */}
      {!embedded && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-5 py-3 bg-[#13110E] hover:bg-[#181512] transition-colors text-left"
        >
          <span className="text-[16px]">🌊</span>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#4A8A7C] font-bold">
              River Smith
            </span>
            {briefing && !open && (
              <span className="ml-2 text-[10px] text-[#5C5046]">
                — {formatDate(briefing.generatedAt)}
              </span>
            )}
          </div>
          {!briefing && !open && (
            <span className="text-[10px] text-[#5C5046] tracking-wide">nightly briefing</span>
          )}
          <span className="text-[10px] text-[#4A3D33] flex-shrink-0">{open ? "▲" : "▼"}</span>
        </button>
      )}

      {/* ── Expanded panel ── */}
      {(open || embedded) && (
        <div className="bg-[#111009] border-t border-[#1E1A14]">
          {/* Controls row */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1E1A14]">
            {isOwner && (
              <button
                onClick={() => void handleGenerate()}
                disabled={generating}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-sm text-[11px] uppercase tracking-[0.1em] font-bold transition-all",
                  generating
                    ? "opacity-40 bg-[#1C1814] text-[#5C5046] cursor-not-allowed"
                    : "bg-[#1E332E] text-[#4A8A7C] hover:bg-[#253D38] border border-[#2A4A43]",
                )}
              >
                {generating ? (
                  <>
                    <span className="animate-pulse">◌</span>
                    <span>Reading the river…</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Generate now</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => {
                setArchiveOpen((o) => !o);
                if (!archiveOpen && archive.length === 0) void fetchArchive();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-[11px] text-[#5C5046] hover:text-[#8C7B6D] border border-[#1E1A14] bg-[#181512] transition-colors"
            >
              <span>📂</span>
              <span>Archive</span>
              <span className="text-[10px]">{archiveOpen ? "▲" : "▼"}</span>
            </button>
            {isOwner && (
              <button
                onClick={() => { setProposeOpen((o) => !o); setProposeSuccess(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-sm text-[11px] border transition-colors",
                  proposeOpen
                    ? "text-[#C5A96A] border-[#3D3020] bg-[#1E1810]"
                    : "text-[#5C5046] border-[#1E1A14] bg-[#181512] hover:text-[#8C7B6D]",
                )}
              >
                <span>💡</span>
                <span>Propose</span>
              </button>
            )}
            {briefing && (
              <span className="ml-auto text-[10px] text-[#3D3228] tracking-wide">
                {formatDate(briefing.generatedAt)}
                {briefing.triggeredBy === "manual" && (
                  <span className="ml-1 text-[#4A3D33]">· manual</span>
                )}
              </span>
            )}
          </div>

          {/* Propose improvement form */}
          {proposeOpen && (
            <div ref={proposeFormRef} className="border-b border-[#1E1A14] bg-[#0E0C09] px-5 py-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#C5A96A] font-bold">
                New improvement proposal
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={proposeTitle}
                  onChange={(e) => setProposeTitle(e.target.value)}
                  placeholder="Title — what should improve?"
                  maxLength={120}
                  className="w-full bg-[#181512] border border-[#2A2520] rounded-sm px-3 py-2 text-[13px] text-[#EAE4DB] placeholder-[#4A3D33] focus:outline-none focus:border-[#3D3020]"
                />
                <input
                  type="text"
                  value={proposeSurface}
                  onChange={(e) => setProposeSurface(e.target.value)}
                  placeholder="Affected surface (e.g. Briefing panel, Daily pick…)"
                  maxLength={80}
                  className="w-full bg-[#181512] border border-[#2A2520] rounded-sm px-3 py-2 text-[13px] text-[#EAE4DB] placeholder-[#4A3D33] focus:outline-none focus:border-[#3D3020]"
                />
                <textarea
                  value={proposeDesc}
                  onChange={(e) => setProposeDesc(e.target.value)}
                  placeholder="Describe the improvement and why it matters…"
                  rows={3}
                  maxLength={800}
                  className="w-full bg-[#181512] border border-[#2A2520] rounded-sm px-3 py-2 text-[13px] text-[#EAE4DB] placeholder-[#4A3D33] focus:outline-none focus:border-[#3D3020] resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePropose}
                  disabled={!proposeTitle.trim() || !proposeDesc.trim() || proposing}
                  className="px-4 py-2 rounded-sm text-[12px] font-bold uppercase tracking-[0.1em] transition-all bg-[#1E332E] text-[#4A8A7C] border border-[#2A4A43] hover:bg-[#253D38] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit proposal
                </button>
                <button
                  onClick={() => setProposeOpen(false)}
                  className="px-3 py-2 text-[12px] text-[#5C5046] hover:text-[#8C7B6D] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Success flash */}
          {proposeSuccess && (
            <div className="border-b border-[#1E1A14] px-5 py-3 flex items-center gap-2">
              <span className="text-[12px] text-[#4A8A7C]">✓</span>
              <span className="text-[12px] text-[#4A8A7C]">Proposal submitted — review it under More → Proposals</span>
            </div>
          )}

          {/* Proof card — shown after a successful save */}
          {proofCard && (
            <div className="px-4 py-3 border-b border-[#1E1A14]">
              <ProofCard
                proof={proofCard.proof}
                briefingId={proofCard.briefingId}
                sentAt={proofCard.sentAt}
              />
            </div>
          )}

          {/* Flagged items toggle */}
          {briefing && (briefing.safetyFlagsCount ?? 0) > 0 && (
            <div className="border-b border-[#1E1A14]">
              <button
                onClick={toggleFlags}
                className="w-full flex items-center gap-2 px-5 py-2.5 text-left hover:bg-[#181512] transition-colors"
              >
                <span className="text-[11px]">🚩</span>
                <span className="text-[11px] text-[#A05A3A] font-semibold tracking-wide">
                  Flagged for review
                </span>
                <span className="ml-1 text-[10px] text-[#7A4428] bg-[#2A1A0E] border border-[#4A2A15] rounded px-1.5 py-0.5">
                  {briefing.safetyFlagsCount}
                </span>
                <span className="ml-auto text-[10px] text-[#4A3D33]">{flagsOpen ? "▲" : "▼"}</span>
              </button>
              {flagsOpen && (
                <div className="bg-[#0E0C0A] max-h-72 overflow-y-auto">
                  {flagsLoading && (
                    <p className="text-[12px] text-[#4A3D33] px-5 py-3">Loading flags…</p>
                  )}
                  {!flagsLoading && flagsError && (
                    <p className="text-[12px] text-[#8C4A3A] px-5 py-3">⚠ {flagsError}</p>
                  )}
                  {!flagsLoading && !flagsError && flags.length === 0 && (
                    <p className="text-[12px] text-[#4A3D33] px-5 py-3">No flagged items found.</p>
                  )}
                  {flags.map((flag, i) => (
                    <div
                      key={i}
                      className="px-5 py-3 border-b border-[#1A1510] last:border-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-[#7A4428] font-bold">
                          {flag.reason}
                        </span>
                        <span className="text-[10px] text-[#3D3228]">·</span>
                        <span className="text-[10px] text-[#4A3D33]">{flag.source}</span>
                      </div>
                      <p className="text-[12px] text-[#8C7060] leading-relaxed">
                        {flag.text.length > 400 ? `${flag.text.slice(0, 400)}…` : flag.text}
                      </p>
                      {flag.text.length > 400 && (
                        <p className="text-[10px] text-[#4A3D33] mt-0.5 italic">
                          {flag.text.length} chars total — full text stored in the database
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Archive list */}
          {archiveOpen && (
            <div className="border-b border-[#1E1A14] bg-[#0D0C0A] max-h-48 overflow-y-auto">
              {archiveLoading && (
                <p className="text-[12px] text-[#4A3D33] px-5 py-3">Loading…</p>
              )}
              {!archiveLoading && archive.length === 0 && (
                <p className="text-[12px] text-[#4A3D33] px-5 py-3">No archived briefings found.</p>
              )}
              {archive.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => void loadArchiveBriefing(entry.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-[#181512] transition-colors border-b border-[#1A1814] last:border-0",
                    briefing?.id === entry.id && "bg-[#181512]",
                  )}
                >
                  <span className="text-[10px] text-[#4A8A7C]">🌊</span>
                  <span className="text-[12px] text-[#8C7B6D]">{formatDate(entry.generatedAt)}</span>
                  <EmailBadge status={entry.emailStatus} />
                  {entry.triggeredBy === "manual" && (
                    <span className="text-[10px] text-[#4A3D33] ml-auto">manual</span>
                  )}
                  {briefing?.id === entry.id && (
                    <span className="text-[10px] text-[#4A8A7C] ml-auto">current</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-5 py-3 text-[12px] text-[#8C4A3A] border-b border-[#1E1A14]">
              ⚠ {error}
            </div>
          )}

          {/* Loading */}
          {loading && !briefing && (
            <div className="px-5 py-8 text-center text-[12px] text-[#4A3D33]">
              <span className="animate-pulse">Reading the river…</span>
            </div>
          )}

          {/* No briefing yet */}
          {!loading && !briefing && !error && (
            <div className="px-5 py-8 text-center">
              <p className="text-[12px] text-[#4A3D33] mb-4 leading-relaxed">
                No briefing has been generated yet.<br />
                The river runs tonight at 11:45 PM.
              </p>
              {isOwner && (
                <button
                  onClick={() => void handleGenerate()}
                  disabled={generating}
                  className="px-5 py-3 text-[12px] uppercase tracking-[0.1em] font-bold text-[#4A8A7C] bg-[#1E332E] border border-[#2A4A43] rounded-sm hover:bg-[#253D38] transition-colors disabled:opacity-40"
                >
                  {generating ? "Reading the river…" : "Generate first briefing"}
                </button>
              )}
            </div>
          )}

          {/* Briefing content */}
          {briefing && !loading && (
            <div className="px-5 py-5 max-h-[60dvh] overflow-y-auto">
              <RiverMarkdown
                text={briefing.rawMarkdown}
                onPropose={isOwner ? handleProposeFromSection : undefined}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
