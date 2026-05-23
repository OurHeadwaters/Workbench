import { useState, useEffect } from "react";
import { api, type NurseryInvite, type NurseryProducer } from "../lib/api";
import { X, Plus, Trash2, Copy, Check, ShieldCheck } from "lucide-react";

interface InvitePanelProps {
  producer: NurseryProducer;
  onClose: () => void;
}

export function InvitePanel({ producer, onClose }: InvitePanelProps) {
  const [invites, setInvites] = useState<NurseryInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newIsSteward, setNewIsSteward] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listInvites()
      .then(setInvites)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setCreating(true);
    setError("");
    try {
      const inv = await api.createInvite(newNote.trim(), newIsSteward);
      setInvites((prev) => [inv, ...prev]);
      setNewNote("");
      setNewIsSteward(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await api.revokeInvite(id);
      setInvites((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to revoke");
    }
  }

  function copyCode(invite: NurseryInvite) {
    navigator.clipboard.writeText(invite.code).catch(() => {});
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const unused = invites.filter((i) => !i.usedAt);
  const used = invites.filter((i) => i.usedAt);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] w-full max-w-md p-6 shadow-xl max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg text-[#2E2620]">Invite codes</h3>
          <button onClick={onClose} className="text-[#7A6B60] hover:text-[#2E2620] p-1 -mr-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#FAF6F0] rounded-xl p-4 mb-5">
          <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide mb-3">Create invite</p>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Note (e.g. for whom)"
            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#A89A8E] focus:outline-none focus:border-[#4A7C59] transition-colors mb-3"
          />
          <label className="flex items-center gap-2 text-sm text-[#4A3F38] mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newIsSteward}
              onChange={(e) => setNewIsSteward(e.target.checked)}
              className="rounded accent-[#4A7C59]"
            />
            <ShieldCheck className="w-3.5 h-3.5 text-[#4A7C59]" />
            Grant steward role
          </label>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Creating…" : "Generate code"}
          </button>
        </div>

        {error && <p className="text-sm text-[#C7613B] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[#7A6B60] text-center py-4">Loading…</p>
        ) : (
          <>
            {unused.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide mb-2">Unused</p>
                {unused.map((inv) => (
                  <InviteRow
                    key={inv.id}
                    invite={inv}
                    copied={copiedId === inv.id}
                    onCopy={() => copyCode(inv)}
                    onRevoke={() => handleRevoke(inv.id)}
                  />
                ))}
              </div>
            )}
            {used.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide mb-2">Used</p>
                {used.map((inv) => (
                  <InviteRow key={inv.id} invite={inv} copied={false} onCopy={() => {}} onRevoke={() => {}} isUsed />
                ))}
              </div>
            )}
            {invites.length === 0 && (
              <p className="text-sm text-[#7A6B60] text-center py-4">No invites yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InviteRow({ invite, copied, onCopy, onRevoke, isUsed }: {
  invite: NurseryInvite;
  copied: boolean;
  onCopy: () => void;
  onRevoke: () => void;
  isUsed?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl border ${isUsed ? "border-[#E4D9CC] opacity-60" : "border-[#B8D9C3] bg-[#F7FCF8]"}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-medium text-[#2E2620] tracking-wider">{invite.code}</span>
          {invite.isStewardInvite && (
            <ShieldCheck className="w-3 h-3 text-[#4A7C59] flex-shrink-0" />
          )}
        </div>
        {invite.note && <p className="text-xs text-[#7A6B60] truncate">{invite.note}</p>}
        {invite.usedByProducerName && (
          <p className="text-xs text-[#A89A8E]">Used by {invite.usedByProducerName}</p>
        )}
      </div>
      {!isUsed && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onCopy} className="p-1.5 rounded-lg hover:bg-[#EBF3EE] text-[#4A7C59] transition-colors" title="Copy">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onRevoke} className="p-1.5 rounded-lg hover:bg-[#FEF3EE] text-[#C7613B] transition-colors" title="Revoke">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
