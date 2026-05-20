import { useState, useEffect } from "react";
import { Plus, X, Archive, AlertTriangle, CheckCircle2, Link2Off, RefreshCw, Wifi, Copy, Check as CheckIcon } from "lucide-react";
import { Link } from "wouter";
import { useStore } from "@/store";
import type { HatLabel } from "@/types";
import { cn } from "@/lib/utils";

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
      return { icon: <Link2Off size={12} />, label: "Display alias", color: "text-[#78716C]", needsAction: false };
    }
    if (!entry) {
      return { icon: <AlertTriangle size={12} />, label: "Needs auth", color: "text-[#92400E]", needsAction: true };
    }
    switch (entry.status) {
      case "ok":
        return { icon: <CheckCircle2 size={12} />, label: "Connected", color: "text-[#4F6E5C]", needsAction: false };
      case "scope":
        return { icon: <AlertTriangle size={12} />, label: "Needs reconnection", color: "text-[#92400E]", needsAction: true };
      case "unavailable":
        return { icon: <AlertTriangle size={12} />, label: "Needs reconnection", color: "text-[#92400E]", needsAction: true };
      case "no-connection":
        return { icon: <Wifi size={12} />, label: "Not yet connected", color: "text-[#A8A29E]", needsAction: true };
      case "checking":
        return { icon: <RefreshCw size={12} className="animate-spin" />, label: "Checking…", color: "text-[#78716C]", needsAction: false };
    }
  }

  const connectedCount = Object.values(accountStatuses).filter((e) => e.status === "ok").length;
  const needsActionCount = Object.values(accountStatuses).filter((e) =>
    e.status === "scope" || e.status === "unavailable" || e.status === "no-connection"
  ).length;

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl mb-1">Gmail inbox setup</h1>
          <p className="text-sm text-[#78716C]">
            Configure which threads surface in Morning Triage. All enabled accounts feed into a single unified list.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Inbox triage</p>
            <p className="text-xs text-[#78716C]">Show matching threads on the Today screen</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${enabled ? "bg-[#1C1917]" : "bg-[#E7E5E4]"}`}
          >
            <span className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-3" : "-translate-x-3"}`} />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium">Gmail accounts</h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Toggle accounts on or off. {connectedCount > 0 ? `${connectedCount} connected` : "None connected yet"}
                {needsActionCount > 0 ? ` · ${needsActionCount} need setup` : ""}.
              </p>
            </div>
            <button
              onClick={fetchStatuses}
              className="shrink-0 p-2 rounded-lg hover:bg-[#F5F5F0] min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Refresh connection status"
            >
              <RefreshCw size={14} className="text-[#78716C]" />
            </button>
          </div>

          <div className="divide-y divide-[#E7E5E4]">
            {gmailAccounts.map((acc) => {
              const entry = accountStatuses[acc.id];
              const { icon, label, color, needsAction } = getStatusBadge(entry, !!acc.isAlias);
              const showReconnect = expandedReconnect[acc.id];
              const envVar = entry?.envVar ?? "";

              return (
                <div key={acc.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium">{acc.fullName}</span>
                        {acc.isAlias && (
                          <span className="text-[10px] bg-[#F5F5F0] text-[#78716C] px-1.5 py-0.5 rounded-full">alias</span>
                        )}
                      </div>
                      <p className="text-xs text-[#78716C] truncate">{acc.address}</p>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className={cn("flex items-center gap-1 text-[10px] font-medium", color)}>
                          {icon}
                          <span>{label}</span>
                        </div>
                        {needsAction && (
                          <button
                            onClick={() => toggleReconnect(acc.id)}
                            className="text-[10px] font-medium text-[#1C1917] bg-[#F5F5F0] px-2 py-0.5 rounded-full hover:bg-[#E7E5E4] transition-colors min-h-[24px]"
                          >
                            {showReconnect ? "Hide steps" : "How to connect →"}
                          </button>
                        )}
                      </div>

                      {acc.isAlias && acc.aliasNote && (
                        <p className="text-[10px] text-[#A8A29E] mt-1 leading-snug">{acc.aliasNote}</p>
                      )}

                      {showReconnect && envVar && (
                        <div className="mt-2 bg-[#F8F7F6] border border-[#E7E5E4] rounded-xl p-3 space-y-2">
                          <p className="text-[11px] font-medium text-[#1C1917]">Connect {acc.address}</p>
                          <ol className="text-[11px] text-[#44403C] space-y-1 leading-snug list-none">
                            <li><span className="font-mono text-[#78716C] mr-1">1.</span> In the Replit integrations panel, add a new <strong>Gmail</strong> connection and sign in with <strong>{acc.address}</strong>.</li>
                            <li><span className="font-mono text-[#78716C] mr-1">2.</span> Copy the new connection ID (starts with <code className="font-mono bg-[#E7E5E4] px-0.5 rounded">conn_google-mail_</code>).</li>
                            <li><span className="font-mono text-[#78716C] mr-1">3.</span> Set this environment variable in Replit Secrets to the connection ID:</li>
                          </ol>
                          <div className="flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-lg px-3 py-2">
                            <code className="text-[11px] font-mono text-[#1C1917] flex-1 break-all">{envVar}</code>
                            <button
                              onClick={() => copyEnvVar(envVar)}
                              className="shrink-0 p-1 rounded hover:bg-[#F5F5F0] min-h-[28px] min-w-[28px] flex items-center justify-center"
                              title="Copy env var name"
                            >
                              {copiedEnvVar === envVar
                                ? <CheckIcon size={12} className="text-[#4F6E5C]" />
                                : <Copy size={12} className="text-[#78716C]" />
                              }
                            </button>
                          </div>
                          <p className="text-[10px] text-[#78716C]">After setting the secret, restart the API server and tap the refresh button above.</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => updateGmailAccount(acc.id, { enabled: !acc.enabled })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors mt-0.5 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center",
                        acc.enabled ? "bg-[#1C1917]" : "bg-[#E7E5E4]",
                      )}
                      title={acc.enabled ? "Disable account" : "Enable account"}
                    >
                      <span className={cn("absolute w-4 h-4 bg-white rounded-full shadow transition-transform", acc.enabled ? "translate-x-2.5" : "-translate-x-2.5")} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Keywords</h2>
          <p className="text-xs text-[#78716C]">Threads containing these words will be surfaced across all accounts.</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span key={kw} className="flex items-center gap-1 bg-[#F5F5F0] rounded-lg px-2 py-1 text-xs">
                {kw}
                <button onClick={() => setKeywords(keywords.filter((k) => k !== kw))} className="min-h-[24px] min-w-[24px] flex items-center justify-center"><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()} placeholder="Add keyword" className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]" />
            <button onClick={addKeyword} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]"><Plus size={16} /></button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Always-surface senders</h2>
          <p className="text-xs text-[#78716C]">Threads from these senders surface regardless of keywords, across all accounts.</p>
          <div className="flex flex-wrap gap-2">
            {senders.map((s) => (
              <span key={s} className="flex items-center gap-1 bg-[#F5F5F0] rounded-lg px-2 py-1 text-xs">
                {s}
                <button onClick={() => setSenders(senders.filter((x) => x !== s))} className="min-h-[24px] min-w-[24px] flex items-center justify-center"><X size={10} /></button>
              </span>
            ))}
            {senders.length === 0 && <p className="text-xs text-[#78716C]">No senders added.</p>}
          </div>
          <div className="flex gap-2">
            <input value={newSender} onChange={(e) => setNewSender(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSender()} placeholder="email@example.com" className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]" />
            <button onClick={addSender} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]"><Plus size={16} /></button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Hat labels</h2>
          <p className="text-xs text-[#78716C]">Gmail labels whose threads are always surfaced (e.g. "inbox-priority").</p>
          <div className="flex flex-wrap gap-2">
            {hatLabels.map((hl) => (
              <span key={hl.label} className="flex items-center gap-1 bg-[#F5F5F0] rounded-lg px-2 py-1 text-xs">
                {hl.label}
                <button onClick={() => setHatLabels(hatLabels.filter((x) => x.label !== hl.label))} className="min-h-[24px] min-w-[24px] flex items-center justify-center"><X size={10} /></button>
              </span>
            ))}
            {hatLabels.length === 0 && <p className="text-xs text-[#78716C]">No labels added.</p>}
          </div>
          <div className="flex gap-2">
            <input value={newHatLabel} onChange={(e) => setNewHatLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHatLabel()} placeholder="Label name" className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]" />
            <button onClick={addHatLabel} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]"><Plus size={16} /></button>
          </div>
        </div>

        <Link href="/archive-mining">
          <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 flex items-center gap-3 cursor-pointer hover:bg-[#F5F5F0] transition-colors">
            <Archive size={18} className="text-[#78716C] shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Archive Mining</p>
              <p className="text-xs text-[#78716C]">Search your Gmail archive by zone, tag threads, build a content bank</p>
            </div>
            <span className="text-[#A8A29E] text-sm ml-auto shrink-0">→</span>
          </div>
        </Link>

        <button onClick={handleSave} className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px]">
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
