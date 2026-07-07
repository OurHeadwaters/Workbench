import { useState, useEffect } from "react";
import { Plus, X, Archive, AlertTriangle, CheckCircle2, Link2Off, RefreshCw, Wifi, Copy, Check as CheckIcon } from "lucide-react";
import { Link } from "wouter";
import { useStore } from "@/store";
import type { HatLabel } from "@/types";
import { cn } from "@/lib/utils";
import { BG, SURFACE, SURFACE_2, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, GREEN } from "@/lib/theme";

type LiveStatus = "ok" | "scope" | "unavailable" | "no-connection" | "checking";

interface AccountStatusEntry {
  status: LiveStatus;
  envVar: string;
}

const BASE_API = "/api";

export function InboxSetupPage() {
  const inbox = useStore((s) => s.inbox);
  const updateInbox = useStore((s) => s.updateInbox);
  const gmailAccounts = useStore((s) => s.gmailAccounts);
  const updateGmailAccount = useStore((s) => s.updateGmailAccount);

  const [keywords, setKeywords] = useState<string[]>(inbox.keywords);
  const [senders, setSenders] = useState<string[]>(inbox.senders);
  const [hatLabels, setHatLabels] = useState<HatLabel[]>(inbox.hatLabels ?? []);
  const [enabled, setEnabled] = useState(inbox.enabled);
  const [newKeyword, setNewKeyword] = useState("");
  const [newSender, setNewSender] = useState("");
  const [newHatLabel, setNewHatLabel] = useState("");
  const [saved, setSaved] = useState(false);

  const [accountStatuses, setAccountStatuses] = useState<Record<string, AccountStatusEntry>>({});
  const [expandedReconnect, setExpandedReconnect] = useState<Record<string, boolean>>({});
  const [copiedEnvVar, setCopiedEnvVar] = useState<string | null>(null);

  const probableAccounts = gmailAccounts.filter((a) => !a.isAlias);

  function fetchStatuses() {
    if (probableAccounts.length === 0) return;
    const ids = probableAccounts.map((a) => a.id).join(",");

    const checking: Record<string, AccountStatusEntry> = {};
    probableAccounts.forEach((a) => { checking[a.id] = { status: "checking", envVar: "" }; });
    setAccountStatuses(checking);

    fetch(`${BASE_API}/inbox/accounts/status?accountIds=${ids}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("unavailable");
        const data = await r.json() as Record<string, AccountStatusEntry>;
        setAccountStatuses(data);
      })
      .catch(() => {
        const err: Record<string, AccountStatusEntry> = {};
        probableAccounts.forEach((a) => { err[a.id] = { status: "unavailable", envVar: "" }; });
        setAccountStatuses(err);
      });
  }

  useEffect(() => { fetchStatuses(); }, []);

  function handleSave() {
    updateInbox({ keywords, senders, enabled, hatLabels, lastSavedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addKeyword() {
    if (!newKeyword.trim() || keywords.includes(newKeyword.trim())) return;
    setKeywords([...keywords, newKeyword.trim()]);
    setNewKeyword("");
  }

  function addSender() {
    if (!newSender.trim() || senders.includes(newSender.trim())) return;
    setSenders([...senders, newSender.trim()]);
    setNewSender("");
  }

  function addHatLabel() {
    const name = newHatLabel.trim();
    if (!name || hatLabels.some((h) => h.label === name)) return;
    setHatLabels([...hatLabels, { address: name, label: name }]);
    setNewHatLabel("");
  }

  function copyEnvVar(envVar: string) {
    navigator.clipboard.writeText(envVar).catch(() => {});
    setCopiedEnvVar(envVar);
    setTimeout(() => setCopiedEnvVar(null), 2000);
  }

  function toggleReconnect(accountId: string) {
    setExpandedReconnect((prev) => ({ ...prev, [accountId]: !prev[accountId] }));
  }

  function getStatusBadge(entry: AccountStatusEntry | undefined, isAlias: boolean) {
    if (isAlias) {
      return { icon: <Link2Off size={12} />, label: "Display alias", color: TEXT_3, needsAction: false };
    }
    if (!entry) {
      return { icon: <AlertTriangle size={12} />, label: "Needs auth", color: "#FB923C", needsAction: true };
    }
    switch (entry.status) {
      case "ok":
        return { icon: <CheckCircle2 size={12} />, label: "Connected", color: GREEN, needsAction: false };
      case "scope":
        return { icon: <AlertTriangle size={12} />, label: "Needs reconnection", color: "#FB923C", needsAction: true };
      case "unavailable":
        return { icon: <AlertTriangle size={12} />, label: "Needs reconnection", color: "#FB923C", needsAction: true };
      case "no-connection":
        return { icon: <Wifi size={12} />, label: "Not yet connected", color: TEXT_3, needsAction: true };
      case "checking":
        return { icon: <RefreshCw size={12} className="animate-spin" />, label: "Checking…", color: TEXT_2, needsAction: false };
    }
  }

  const connectedCount = Object.values(accountStatuses).filter((e) => e.status === "ok").length;
  const needsActionCount = Object.values(accountStatuses).filter((e) =>
    e.status === "scope" || e.status === "unavailable" || e.status === "no-connection"
  ).length;

  return (
    <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl mb-1" style={{ color: TEXT }}>Gmail inbox setup</h1>
          <p className="text-sm" style={{ color: TEXT_2 }}>
            Configure which threads surface in Morning Triage. All enabled accounts feed into a single unified list.
          </p>
        </div>

        <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-sm font-medium" style={{ color: TEXT }}>Inbox triage</p>
            <p className="text-xs" style={{ color: TEXT_2 }}>Show matching threads on the Today screen</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className="relative w-12 h-6 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ backgroundColor: enabled ? AMBER : SURFACE_2 }}
          >
            <span
              className="absolute w-5 h-5 bg-white rounded-full shadow transition-transform"
              style={{ transform: enabled ? "translateX(10px)" : "translateX(-10px)" }}
            />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
          <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium" style={{ color: TEXT }}>Gmail accounts</h2>
              <p className="text-xs mt-0.5" style={{ color: TEXT_2 }}>
                Toggle accounts on or off. {connectedCount > 0 ? `${connectedCount} connected` : "None connected yet"}
                {needsActionCount > 0 ? ` · ${needsActionCount} need setup` : ""}.
              </p>
            </div>
            <button
              onClick={fetchStatuses}
              className="shrink-0 p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              style={{ backgroundColor: "transparent" }}
              title="Refresh connection status"
            >
              <RefreshCw size={14} style={{ color: TEXT_2 }} />
            </button>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}` }}>
            {gmailAccounts.map((acc) => {
              const entry = accountStatuses[acc.id];
              const { icon, label, color, needsAction } = getStatusBadge(entry, !!acc.isAlias);
              const showReconnect = expandedReconnect[acc.id];
              const envVar = entry?.envVar ?? "";

              return (
                <div key={acc.id} className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: TEXT }}>{acc.fullName}</span>
                        {acc.isAlias && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: SURFACE_2, color: TEXT_2 }}>alias</span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color: TEXT_2 }}>{acc.address}</p>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color }}>
                          {icon}
                          <span>{label}</span>
                        </div>
                        {needsAction && (
                          <button
                            onClick={() => toggleReconnect(acc.id)}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors min-h-[24px]"
                            style={{ color: TEXT, backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}
                          >
                            {showReconnect ? "Hide steps" : "How to connect →"}
                          </button>
                        )}
                      </div>

                      {acc.isAlias && acc.aliasNote && (
                        <p className="text-[10px] mt-1 leading-snug" style={{ color: TEXT_3 }}>{acc.aliasNote}</p>
                      )}

                      {showReconnect && envVar && (
                        <div className="mt-2 rounded-xl p-3 space-y-2" style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}>
                          <p className="text-[11px] font-medium" style={{ color: TEXT }}>Connect {acc.address}</p>
                          <ol className="text-[11px] space-y-1 leading-snug list-none" style={{ color: TEXT_2 }}>
                            <li><span className="font-mono mr-1" style={{ color: TEXT_3 }}>1.</span> In the Replit integrations panel, add a new <strong>Gmail</strong> connection and sign in with <strong>{acc.address}</strong>.</li>
                            <li><span className="font-mono mr-1" style={{ color: TEXT_3 }}>2.</span> Copy the new connection ID (starts with <code className="font-mono rounded px-0.5" style={{ backgroundColor: BORDER }}>conn_google-mail_</code>).</li>
                            <li><span className="font-mono mr-1" style={{ color: TEXT_3 }}>3.</span> Set this environment variable in Replit Secrets to the connection ID:</li>
                          </ol>
                          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
                            <code className="text-[11px] font-mono flex-1 break-all" style={{ color: TEXT }}>{envVar}</code>
                            <button
                              onClick={() => copyEnvVar(envVar)}
                              className="shrink-0 p-1 rounded min-h-[28px] min-w-[28px] flex items-center justify-center"
                              title="Copy env var name"
                            >
                              {copiedEnvVar === envVar
                                ? <CheckIcon size={12} style={{ color: GREEN }} />
                                : <Copy size={12} style={{ color: TEXT_2 }} />
                              }
                            </button>
                          </div>
                          <p className="text-[10px]" style={{ color: TEXT_3 }}>After setting the secret, restart the API server and tap the refresh button above.</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => updateGmailAccount(acc.id, { enabled: !acc.enabled })}
                      className="relative w-11 h-6 rounded-full transition-colors mt-0.5 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      style={{ backgroundColor: acc.enabled ? AMBER : SURFACE_2 }}
                      title={acc.enabled ? "Disable account" : "Enable account"}
                    >
                      <span
                        className="absolute w-4 h-4 bg-white rounded-full shadow transition-transform"
                        style={{ transform: acc.enabled ? "translateX(10px)" : "translateX(-10px)" }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
          <h2 className="text-base" style={{ color: TEXT }}>Keywords</h2>
          <p className="text-xs" style={{ color: TEXT_2 }}>Threads containing these words will be surfaced across all accounts.</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span key={kw} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: SURFACE_2, color: TEXT }}>
                {kw}
                <button onClick={() => setKeywords(keywords.filter((k) => k !== kw))} className="min-h-[24px] min-w-[24px] flex items-center justify-center"><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              placeholder="Add keyword"
              className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}`, color: TEXT }}
            />
            <button onClick={addKeyword} className="px-3 py-2 rounded-lg text-sm min-h-[44px]" style={{ backgroundColor: AMBER, color: BG }}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
          <h2 className="text-base" style={{ color: TEXT }}>Always-surface senders</h2>
          <p className="text-xs" style={{ color: TEXT_2 }}>Threads from these senders surface regardless of keywords, across all accounts.</p>
          <div className="flex flex-wrap gap-2">
            {senders.map((s) => (
              <span key={s} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: SURFACE_2, color: TEXT }}>
                {s}
                <button onClick={() => setSenders(senders.filter((x) => x !== s))} className="min-h-[24px] min-w-[24px] flex items-center justify-center"><X size={10} /></button>
              </span>
            ))}
            {senders.length === 0 && <p className="text-xs" style={{ color: TEXT_2 }}>No senders added.</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={newSender}
              onChange={(e) => setNewSender(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSender()}
              placeholder="email@example.com"
              className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}`, color: TEXT }}
            />
            <button onClick={addSender} className="px-3 py-2 rounded-lg text-sm min-h-[44px]" style={{ backgroundColor: AMBER, color: BG }}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
          <h2 className="text-base" style={{ color: TEXT }}>Hat labels</h2>
          <p className="text-xs" style={{ color: TEXT_2 }}>Gmail labels whose threads are always surfaced (e.g. "inbox-priority").</p>
          <div className="flex flex-wrap gap-2">
            {hatLabels.map((hl) => (
              <span key={hl.label} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: SURFACE_2, color: TEXT }}>
                {hl.label}
                <button onClick={() => setHatLabels(hatLabels.filter((x) => x.label !== hl.label))} className="min-h-[24px] min-w-[24px] flex items-center justify-center"><X size={10} /></button>
              </span>
            ))}
            {hatLabels.length === 0 && <p className="text-xs" style={{ color: TEXT_2 }}>No labels added.</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={newHatLabel}
              onChange={(e) => setNewHatLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHatLabel()}
              placeholder="Label name"
              className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}`, color: TEXT }}
            />
            <button onClick={addHatLabel} className="px-3 py-2 rounded-lg text-sm min-h-[44px]" style={{ backgroundColor: AMBER, color: BG }}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        <Link href="/archive-mining">
          <div
            className="rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <Archive size={18} className="shrink-0" style={{ color: TEXT_2 }} />
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: TEXT }}>Archive Mining</p>
              <p className="text-xs" style={{ color: TEXT_2 }}>Search your Gmail archive by zone, tag threads, build a content bank</p>
            </div>
            <span className="text-sm ml-auto shrink-0" style={{ color: TEXT_3 }}>→</span>
          </div>
        </Link>

        <button
          onClick={handleSave}
          className="w-full rounded-xl py-3 text-sm font-medium min-h-[44px] transition-colors"
          style={{ backgroundColor: AMBER, color: BG }}
        >
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
