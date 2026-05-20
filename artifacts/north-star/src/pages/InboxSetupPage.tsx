import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useStore } from "@/store";
import type { HatLabel } from "@/types";

export function InboxSetupPage() {
  const inbox = useStore((s) => s.inbox);
  const updateInbox = useStore((s) => s.updateInbox);

  const [keywords, setKeywords] = useState<string[]>(inbox.keywords);
  const [senders, setSenders] = useState<string[]>(inbox.senders);
  const [hatLabels, setHatLabels] = useState<HatLabel[]>(inbox.hatLabels ?? []);
  const [enabled, setEnabled] = useState(inbox.enabled);
  const [newKeyword, setNewKeyword] = useState("");
  const [newSender, setNewSender] = useState("");
  const [newHatLabel, setNewHatLabel] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateInbox({ keywords, senders, enabled, hatLabels });
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

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl mb-1">Gmail inbox setup</h1>
          <p className="text-sm text-[#78716C]">
            Configure which threads surface in Morning Triage. Requires the Gmail connector to be wired in the API server.
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

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Keywords</h2>
          <p className="text-xs text-[#78716C]">Threads containing these words will be surfaced.</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span key={kw} className="flex items-center gap-1 bg-[#F5F5F0] rounded-lg px-2 py-1 text-xs">
                {kw}
                <button onClick={() => setKeywords(keywords.filter((k) => k !== kw))} className="min-h-[24px] min-w-[24px] flex items-center justify-center">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              placeholder="Add keyword"
              className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
            <button onClick={addKeyword} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Always-surface senders</h2>
          <div className="flex flex-wrap gap-2">
            {senders.map((s) => (
              <span key={s} className="flex items-center gap-1 bg-[#F5F5F0] rounded-lg px-2 py-1 text-xs">
                {s}
                <button onClick={() => setSenders(senders.filter((x) => x !== s))} className="min-h-[24px] min-w-[24px] flex items-center justify-center">
                  <X size={10} />
                </button>
              </span>
            ))}
            {senders.length === 0 && <p className="text-xs text-[#78716C]">No senders added.</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={newSender}
              onChange={(e) => setNewSender(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSender()}
              placeholder="email@example.com"
              className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
            <button onClick={addSender} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Hat labels</h2>
          <p className="text-xs text-[#78716C]">Gmail labels whose threads are always surfaced (e.g. "inbox-priority").</p>
          <div className="flex flex-wrap gap-2">
            {hatLabels.map((hl) => (
              <span key={hl.label} className="flex items-center gap-1 bg-[#F5F5F0] rounded-lg px-2 py-1 text-xs">
                {hl.label}
                <button onClick={() => setHatLabels(hatLabels.filter((x) => x.label !== hl.label))} className="min-h-[24px] min-w-[24px] flex items-center justify-center">
                  <X size={10} />
                </button>
              </span>
            ))}
            {hatLabels.length === 0 && <p className="text-xs text-[#78716C]">No labels added.</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={newHatLabel}
              onChange={(e) => setNewHatLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHatLabel()}
              placeholder="Label name"
              className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
            <button onClick={addHatLabel} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4">
          <p className="text-xs text-[#92400E]">
            <strong>Gmail OAuth required.</strong> The Morning Triage card reads from <code className="font-mono">/api/inbox/threads</code>. If OAuth isn't configured in the API server, the triage card will silently show nothing — the Today screen still works fully.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px]"
        >
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
