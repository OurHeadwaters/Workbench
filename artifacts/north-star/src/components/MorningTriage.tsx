import { useState, useEffect, useCallback, useRef } from "react";
import { Inbox, ChevronDown, ChevronUp, Check, Clock, RefreshCw } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

interface EnrichedEmailThread {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  accountId: string;
  accountLabel: string;
}

type AccountStatus = "ok" | "scope" | "unavailable" | "no-connection";

const BASE_API = "/api";
const POLL_INTERVAL_MS = 4 * 60 * 1000;

const BADGE_COLORS: Record<string, string> = {
  "acc-bobbie-personal": "bg-[#EDE9FE] text-[#5B21B6]",
  "acc-pj-main":         "bg-[#D1FAE5] text-[#065F46]",
  "acc-pj-orders":       "bg-[#D1FAE5] text-[#065F46]",
  "acc-pj-info":         "bg-[#D1FAE5] text-[#065F46]",
  "acc-xbuckets":        "bg-[#FEF3C7] text-[#92400E]",
  "acc-807foodcoop":     "bg-[#DBEAFE] text-[#1E40AF]",
  "acc-the807foodcoop":  "bg-[#DBEAFE] text-[#1E40AF]",
  "acc-807foodhub":      "bg-[#DBEAFE] text-[#1E40AF]",
  "acc-headwaters-alias":"bg-[#FCE7F3] text-[#9D174D]",
  default:               "bg-[#F5F5F0] text-[#44403C]",
};

export function MorningTriage({ alwaysExpanded = false }: { alwaysExpanded?: boolean } = {}) {
  const inbox = useStore((s) => s.inbox);
  const gmailAccounts = useStore((s) => s.gmailAccounts);
  const pendingReplies = useStore((s) => s.pendingReplies);
  const setPendingReply = useStore((s) => s.setPendingReply);

  const [threads, setThreads] = useState<EnrichedEmailThread[]>([]);
  const [accountStatuses, setAccountStatuses] = useState<Record<string, AccountStatus>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<"unavailable" | "scope" | null>(null);
  const [expanded, setExpanded] = useState(true);

  const enabledAccounts = gmailAccounts.filter((a) => a.enabled && !a.isAlias);

  const enabledRef = useRef(inbox.enabled);
  const enabledAccountsRef = useRef(enabledAccounts);
  const inboxRef = useRef(inbox);

  enabledRef.current = inbox.enabled;
  enabledAccountsRef.current = enabledAccounts;
  inboxRef.current = inbox;

  const loadThreads = useCallback((showSpinner: boolean) => {
    const currentInbox = inboxRef.current;
    const accounts = enabledAccountsRef.current;

    if (!enabledRef.current || accounts.length === 0) return;

    if (showSpinner) {
      setLoading(true);
      setGlobalError(null);
    }

    const params = new URLSearchParams();
    if (currentInbox.keywords?.length) params.set("keywords", currentInbox.keywords.join(","));
    if (currentInbox.senders?.length) params.set("senders", currentInbox.senders.join(","));
    if (currentInbox.hatLabels?.length) params.set("labels", currentInbox.hatLabels.map((h) => h.label).join(","));

    params.set("accountIds", accounts.map((a) => a.id).join(","));
    params.set(
      "accountLabels",
      accounts.map((a) => `${a.id}:${a.label}`).join(","),
    );

    fetch(`${BASE_API}/inbox/threads/all?${params.toString()}`)
      .then(async (r) => {
        if (r.status === 403) {
          if (showSpinner) setGlobalError("scope");
          setLoading(false);
          return;
        }
        if (!r.ok) throw new Error("unavailable");
        const data = await r.json() as {
          threads: EnrichedEmailThread[];
          accountStatuses: Record<string, AccountStatus>;
        };
        setThreads(data.threads ?? []);
        setAccountStatuses(data.accountStatuses ?? {});
        setLoading(false);
      })
      .catch(() => {
        if (showSpinner) setGlobalError("unavailable");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!inbox.enabled || enabledAccounts.length === 0) return;
    loadThreads(true);
  }, [inbox.enabled, inbox.keywords, inbox.senders, inbox.hatLabels, inbox.lastSavedAt, gmailAccounts]);

  useEffect(() => {
    if (!inbox.enabled || enabledAccounts.length === 0) return;
    const id = setInterval(() => loadThreads(false), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inbox.enabled, enabledAccounts.length, loadThreads]);

  if (!inbox.enabled) return null;
  if (!loading && threads.length === 0 && globalError !== "scope") return null;

  if (globalError === "scope") {
    return (
      <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 mb-4 flex items-start gap-3">
        <Inbox size={16} className="text-[#92400E] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#92400E]">Gmail read access needed</p>
          <p className="text-xs text-[#78350F] mt-0.5">
            The connected Gmail account only has add-on permissions. To enable Morning Triage, the Gmail connection needs the <strong>gmail.readonly</strong> scope — reconnect it in the Replit integrations panel with broader access.
          </p>
        </div>
      </div>
    );
  }

  const active = threads.filter((t) => !pendingReplies[`${t.accountId}:${t.id}`]?.doneAt);

  const failedCount = Object.values(accountStatuses).filter(
    (s) => s === "scope" || s === "unavailable",
  ).length;

  return (
    <div className="rounded-xl border border-[#E7E5E4] bg-white overflow-hidden mb-4">
      {alwaysExpanded ? (
        <div className="flex items-center gap-2 px-4 py-3">
          <Inbox size={16} className="text-[#78716C]" />
          <span className="text-sm font-medium">Morning triage</span>
          {active.length > 0 && (
            <span className="text-xs bg-[#F5F5F0] text-[#44403C] rounded-full px-2 py-0.5">
              {active.length}
            </span>
          )}
          {failedCount > 0 && (
            <span className="text-xs bg-[#FEF3C7] text-[#92400E] rounded-full px-2 py-0.5">
              {failedCount} needs auth
            </span>
          )}
          <button
            onClick={() => loadThreads(true)}
            disabled={loading}
            className="ml-auto p-1.5 rounded-lg hover:bg-[#F5F5F0] disabled:opacity-40 transition-opacity"
            title="Refresh inbox"
          >
            <RefreshCw
              size={14}
              className={cn("text-[#78716C]", loading && "animate-spin")}
            />
          </button>
        </div>
      ) : (
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
            {failedCount > 0 && (
              <span className="text-xs bg-[#FEF3C7] text-[#92400E] rounded-full px-2 py-0.5">
                {failedCount} needs auth
              </span>
            )}
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {(alwaysExpanded || expanded) && (
        <div className="border-t border-[#E7E5E4] divide-y divide-[#E7E5E4]">
          {loading && (
            <div className="px-4 py-3 text-sm text-[#78716C]">Loading…</div>
          )}
          {active.map((t) => {
            const stateKey = `${t.accountId}:${t.id}`;
            const state = pendingReplies[stateKey];
            const badgeColor = BADGE_COLORS[t.accountId] ?? BADGE_COLORS.default;
            return (
              <div key={stateKey} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0", badgeColor)}>
                        {t.accountLabel}
                      </span>
                      <p className="text-sm font-medium truncate">{t.subject}</p>
                    </div>
                    <p className="text-xs text-[#78716C] truncate">{t.from}</p>
                    <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">{t.snippet}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setPendingReply(stateKey, { doneAt: new Date().toISOString() })}
                      className="p-2 rounded-lg hover:bg-[#D1E7DB] min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Mark done"
                    >
                      <Check size={16} className="text-[#4F6E5C]" />
                    </button>
                    <button
                      onClick={() =>
                        setPendingReply(stateKey, {
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
