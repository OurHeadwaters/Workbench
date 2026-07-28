import { useMemo, useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useStore } from "@/store";
import type { RelayEventSummary } from "@/types";
import { AGENT_ROLE_REGISTRY } from "@/lib/relay-stub";
import { BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_2, AMBER, FONT_DISPLAY } from "@/lib/theme";
import { Clock, Archive, Send, ChevronLeft, Beaker, Bot, User, Loader2 } from "lucide-react";

// ── stub response generator ────────────────────────────────────────────────

function generateAgentStub(role: string, labLabel: string, recentMessages: string[]): string {
  const context = recentMessages.slice(-2).join(" … ");
  switch (role) {
    case "river-smith":
      return `Reviewing constellation signals for "${labLabel}".${context ? ` Building on: "${context}".` : ""} Across the seven dimensions, the Biological and Collective layers warrant the most attention right now. Will synthesise a full briefing at 11:45 PM.`;
    case "critical-challenger":
      return `Challenging the framing on "${labLabel}".${context ? ` On "${context}" —` : ""} Three questions the group may be avoiding: (1) What breaks first when this scales? (2) Who bears the downside if the assumption is wrong? (3) What does the 90-day exit look like if it stalls?`;
    case "r-and-d":
      return `R&D scan for "${labLabel}" complete.${context ? ` Building on "${context}" —` : ""} Found three analogous patterns in adjacent systems worth synthesising into a prototype proposal. Will draft a concept note for the next session.`;
    case "ops":
      return `Ops check on "${labLabel}".${context ? ` Tracking: "${context}".` : ""} Scheduling signals look stable — no burst windows blocked. One stalled item flagged for review. Recommend the group sets a 48-hour decision deadline to keep momentum.`;
    default:
      return `Processing request for "${labLabel}"…`;
  }
}

// ── helpers ────────────────────────────────────────────────────────────────

function formatTTL(expiresAt: string, now: number): string {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return "expired";
  const totalMin = Math.floor(ms / 60_000);
  if (totalMin < 60) return `${totalMin}m left`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m left` : `${h}h left`;
}

function useNow(intervalMs = 10_000) {
  const [now, setNow] = useState(() => Date.now());
  useMemo(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function roleLabel(role: string | undefined): string {
  if (!role) return "Human";
  const entry = AGENT_ROLE_REGISTRY.find((r) => r.role === role);
  return entry ? entry.name : role;
}

// ── EventBubble ────────────────────────────────────────────────────────────

function EventBubble({ ev }: { ev: RelayEventSummary }) {
  const isHuman = ev.actor_type === "human";
  const time = new Date(ev.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-2.5 ${isHuman ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: isHuman
            ? "rgba(200,146,58,0.18)"
            : "rgba(100,180,120,0.15)",
        }}
      >
        {isHuman ? (
          <User size={14} style={{ color: AMBER }} />
        ) : (
          <Bot size={14} style={{ color: "#7ecf8e" }} />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[75%] ${isHuman ? "items-end" : "items-start"}`}
      >
        {/* Role label */}
        <span className="text-[10px] font-medium px-1" style={{ color: TEXT_2 }}>
          {isHuman ? "You" : roleLabel(ev.agent_role)}
        </span>

        {/* Message */}
        <div
          className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
          style={{
            backgroundColor: isHuman
              ? "rgba(200,146,58,0.14)"
              : "rgba(237,232,213,0.07)",
            border: `1px solid ${isHuman ? "rgba(200,146,58,0.25)" : BORDER}`,
            color: TEXT,
          }}
        >
          {ev.text}
        </div>

        <span className="text-[10px] px-1" style={{ color: TEXT_2 }}>
          {time}
        </span>
      </div>
    </div>
  );
}

// ── RoleGroup ──────────────────────────────────────────────────────────────

function AgentRoleSection({ role, events }: { role: string; events: RelayEventSummary[] }) {
  const label = roleLabel(role);
  const count = events.length;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "#7ecf8e" }}
        />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEXT_2 }}>
          {label} · {count} {count === 1 ? "post" : "posts"}
        </span>
      </div>
      {events.map((ev) => (
        <EventBubble key={ev.id} ev={ev} />
      ))}
    </div>
  );
}

// ── LabPage ────────────────────────────────────────────────────────────────

export function LabPage() {
  const [, params] = useRoute("/channels/lab/:id");
  const [, navigate] = useLocation();
  const channelId = params?.id ?? "";

  const channel = useStore((s) => s.channels.find((c) => c.id === channelId));
  const postLabEvent = useStore((s) => s.postLabEvent);

  const now = useNow();
  const [reply, setReply] = useState("");
  const [askingRole, setAskingRole] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const isExpired = channel?.expiresAt
    ? new Date(channel.expiresAt).getTime() <= now
    : false;
  const isArchived = !!(channel?.archivedAt);
  const isReadOnly = isArchived || isExpired;

  const feed = channel?.event_feed ?? [];

  // Group events by agent_role (or "human" bucket) for the by-role view
  const roleGroups = useMemo(() => {
    const map = new Map<string, RelayEventSummary[]>();
    for (const ev of feed) {
      const key = ev.actor_type === "human" ? "__human__" : (ev.agent_role ?? "__unknown__");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [feed]);

  // Scroll to bottom of feed when new events arrive
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feed.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || isReadOnly || !channelId) return;
    postLabEvent(channelId, {
      kind: 1011,
      actor_type: "human",
      text: reply.trim(),
    });
    setReply("");
  }

  function handleAskAgent(role: (typeof invitedRoles)[number]) {
    if (isReadOnly || !channelId || askingRole) return;
    setAskingRole(role);
    const recentMessages = feed.slice(-3).map((ev) => ev.text);
    const label = channel?.label ?? "";
    // Brief simulated thinking delay before the response appears
    setTimeout(() => {
      postLabEvent(channelId, {
        kind: 1011,
        actor_type: "agent",
        agent_role: role,
        text: generateAgentStub(role, label, recentMessages),
      });
      setAskingRole(null);
    }, 800);
  }

  if (!channel) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4" style={{ backgroundColor: BG }}>
        <p className="text-sm" style={{ color: TEXT_2 }}>Lab channel not found.</p>
        <button
          onClick={() => navigate("/channels")}
          className="flex items-center gap-1 text-sm px-3 py-2 rounded"
          style={{ color: AMBER, border: `1px solid ${BORDER}` }}
          aria-label="Back to Channels"
        >
          <ChevronLeft size={16} />
          Back to Channels
        </button>
      </div>
    );
  }

  const invitedRoles = channel.invited_roles ?? [];

  return (
    <div className="min-h-dvh flex flex-col pb-[calc(env(safe-area-inset-bottom)+80px)]" style={{ backgroundColor: BG }}>
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-10 px-4 pt-safe-top pb-3"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={() => navigate("/channels")}
            aria-label="Back"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl"
            style={{ color: TEXT_2 }}
          >
            <ChevronLeft size={20} />
          </button>

          <Beaker size={16} style={{ color: AMBER, flexShrink: 0 }} />

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold truncate" style={{ color: TEXT, fontFamily: FONT_DISPLAY }}>
              {channel.label}
            </h1>
            {invitedRoles.length > 0 && (
              <p className="text-xs truncate" style={{ color: TEXT_2 }}>
                {invitedRoles.map((r) => roleLabel(r)).join(" · ")}
              </p>
            )}
          </div>

          {/* Expiry / archived badge */}
          {isArchived ? (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium shrink-0"
              style={{ backgroundColor: "rgba(237,232,213,0.08)", color: TEXT_2 }}
            >
              <Archive size={10} />
              archived
            </span>
          ) : isExpired ? (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium shrink-0"
              style={{ backgroundColor: "rgba(237,232,213,0.08)", color: TEXT_2 }}
            >
              <Archive size={10} />
              expired
            </span>
          ) : channel.expiresAt ? (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium shrink-0"
              style={{ backgroundColor: "rgba(200,146,58,0.12)", color: AMBER }}
            >
              <Clock size={10} />
              {formatTTL(channel.expiresAt, now)}
            </span>
          ) : null}
        </div>
      </div>

      {/* ── Event Feed ── */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-5"
      >
        {feed.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <Beaker size={32} style={{ color: TEXT_2, opacity: 0.4 }} />
            <p className="text-sm text-center" style={{ color: TEXT_2 }}>
              {isReadOnly
                ? "This lab has ended. No events were recorded."
                : "Lab is open. Post a message to start the conversation."}
            </p>
            {!isReadOnly && invitedRoles.length > 0 && (
              <p className="text-xs text-center max-w-xs" style={{ color: TEXT_2 }}>
                Invited: {invitedRoles.map((r) => roleLabel(r)).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Chronological feed */}
        <div className="space-y-4">
          {feed.map((ev) => (
            <EventBubble key={ev.id} ev={ev} />
          ))}
        </div>

        {/* By-role breakdown (shown when there's content from multiple roles) */}
        {roleGroups.size > 1 && feed.length >= 3 && (
          <div
            className="mt-6 rounded-2xl p-4 space-y-5"
            style={{ backgroundColor: "rgba(237,232,213,0.04)", border: `1px solid ${BORDER}` }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEXT_2 }}>
              By contributor
            </h3>
            {Array.from(roleGroups.entries())
              .filter(([key]) => key !== "__human__")
              .map(([key, events]) => (
                <AgentRoleSection key={key} role={key} events={events} />
              ))}
          </div>
        )}
      </div>

      {/* ── Reply Input ── */}
      {!isReadOnly && (
        <div
          className="fixed bottom-[64px] left-0 right-0 px-4 pb-3 pt-2"
          style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}` }}
        >
          {/* Ask-agent buttons */}
          {invitedRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 max-w-xl mx-auto mb-2">
              {invitedRoles.map((role) => {
                const entry = AGENT_ROLE_REGISTRY.find((r) => r.role === role);
                const label = entry ? entry.name : role;
                const isThinking = askingRole === role;
                const isDisabled = askingRole !== null;
                return (
                  <button
                    key={role}
                    onClick={() => handleAskAgent(role)}
                    disabled={isDisabled}
                    aria-label={`Ask ${label}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity"
                    style={{
                      backgroundColor: "rgba(100,180,120,0.12)",
                      border: `1px solid rgba(100,180,120,0.28)`,
                      color: "#7ecf8e",
                      opacity: isDisabled && !isThinking ? 0.4 : 1,
                    }}
                  >
                    {isThinking ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Bot size={11} />
                    )}
                    {isThinking ? `${label} thinking…` : `Ask ${label}`}
                  </button>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2 max-w-xl mx-auto">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Reply to the lab…"
              rows={1}
              className="flex-1 rounded-2xl px-4 py-3 text-sm resize-none outline-none"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER_STRONG}`,
                color: TEXT,
                minHeight: "44px",
                maxHeight: "120px",
                lineHeight: "1.4",
              }}
            />
            <button
              type="submit"
              disabled={!reply.trim()}
              aria-label="Send"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl transition-opacity"
              style={{
                backgroundColor: AMBER,
                color: "#0B0905",
                opacity: reply.trim() ? 1 : 0.4,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {isReadOnly && (
        <div
          className="px-4 py-3 text-center text-xs"
          style={{ color: TEXT_2, borderTop: `1px solid ${BORDER}` }}
        >
          This lab is {isArchived ? "archived" : "expired"} — no new events can be posted.
        </div>
      )}
    </div>
  );
}
