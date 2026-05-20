import { useState, useEffect } from "react";
import { Inbox, ChevronDown, ChevronUp, Check, Clock } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

interface EmailThread {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
}

const BASE_API = "/api";

export function MorningTriage() {
  const inbox = useStore((s) => s.inbox);
  const pendingReplies = useStore((s) => s.pendingReplies);
  const setPendingReply = useStore((s) => s.setPendingReply);

  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!inbox.enabled) return;
    setLoading(true);

    const params = new URLSearchParams();
    if (inbox.keywords?.length) params.set("keywords", inbox.keywords.join(","));
    if (inbox.senders?.length) params.set("senders", inbox.senders.join(","));
    if (inbox.hatLabels?.length) params.set("labels", inbox.hatLabels.map((h) => h.label).join(","));

    fetch(`${BASE_API}/inbox/threads?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("unavailable");
        return r.json();
      })
      .then((data: EmailThread[]) => {
        setThreads(data);
        setLoading(false);
      })
      .catch(() => {
        setError("unavailable");
        setLoading(false);
      });
  }, [inbox.enabled, inbox.keywords, inbox.senders, inbox.hatLabels]);

  if (!inbox.enabled) return null;
  if (error || (!loading && threads.length === 0)) return null;

  const active = threads.filter((t) => !pendingReplies[t.id]?.doneAt);

  return (
    <div className="rounded-xl border border-[#E7E5E4] bg-white overflow-hidden mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]"
      >
        <div className="flex items-center gap-2">
          <Inbox size={16} className="text-[#78716C]" />
          <span className="text-sm font-medium">Morning triage</span>
          {active.length > 0 && (
            <span className="text-xs bg-[#F5F5F0] text-[#44403C] rounded-full px-2 py-0.5">
              {active.length}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="border-t border-[#E7E5E4] divide-y divide-[#E7E5E4]">
          {loading && (
            <div className="px-4 py-3 text-sm text-[#78716C]">Loading…</div>
          )}
          {active.map((t) => {
            const state = pendingReplies[t.id];
            return (
              <div key={t.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.subject}</p>
                    <p className="text-xs text-[#78716C] truncate">{t.from}</p>
                    <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">{t.snippet}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setPendingReply(t.id, { doneAt: new Date().toISOString() })}
                      className="p-2 rounded-lg hover:bg-[#D1E7DB] min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Mark done"
                    >
                      <Check size={16} className="text-[#4F6E5C]" />
                    </button>
                    <button
                      onClick={() =>
                        setPendingReply(t.id, {
                          deferredCount: (state?.deferredCount ?? 0) + 1,
                          lastDeferred: new Date().toISOString(),
                        })
                      }
                      className="p-2 rounded-lg hover:bg-[#F5F5F0] min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Defer"
                    >
                      <Clock size={16} className="text-[#78716C]" />
                    </button>
                  </div>
                </div>
                {(state?.deferredCount ?? 0) > 0 && (
                  <p className="text-xs text-[#78716C] mt-1">
                    Deferred {state.deferredCount}×
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
