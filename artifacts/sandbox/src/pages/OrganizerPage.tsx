import { useState, useEffect, useCallback } from "react";
import { api, type SandboxHousehold, type SandboxRole, type SandboxStandbyEvent, type SandboxBucket, type SandboxInvite } from "@/lib/api";
import { Shield, Plus, Trash2, Play, Square, Copy, Check, Pencil, Sprout, Inbox } from "lucide-react";

interface OrganizerPageProps {
  household: SandboxHousehold;
}

type Tab = "standby" | "roles" | "buckets" | "invites" | "prompt" | "households";

export function OrganizerPage({ household }: OrganizerPageProps) {
  const [households, setHouseholds] = useState<SandboxHousehold[]>([]);
  const [roles, setRoles] = useState<SandboxRole[]>([]);
  const [standby, setStandby] = useState<SandboxStandbyEvent | null>(null);
  const [invites, setInvites] = useState<SandboxInvite[]>([]);
  const [buckets, setBuckets] = useState<SandboxBucket[]>([]);
  const [gatherBucket, setGatherBucket] = useState<SandboxBucket | null>(null);
  const [tab, setTab] = useState<Tab>("standby");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Buckets
  const [newBucketLabel, setNewBucketLabel] = useState("");
  const [bucketSubmitting, setBucketSubmitting] = useState(false);
  const [showAddBucket, setShowAddBucket] = useState(false);
  const [editingBucket, setEditingBucket] = useState<{ id: string; label: string } | null>(null);

  // Standby
  const [standbyName, setStandbyName] = useState("");
  const [standbySubmitting, setStandbySubmitting] = useState(false);

  // Roles
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [roleHouseholdId, setRoleHouseholdId] = useState("");
  const [roleSubmitting, setRoleSubmitting] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);

  // Invites
  const [inviteNote, setInviteNote] = useState("");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [showAddInvite, setShowAddInvite] = useState(false);

  // Gather Round prompt
  const [promptText, setPromptText] = useState("");
  const [promptSubmitting, setPromptSubmitting] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);

  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [h, r, ev, inv, bkts] = await Promise.all([
      api.listHouseholds(),
      api.listRoles(),
      api.getActiveStandby(),
      api.listInvites(),
      api.listBuckets(),
    ]);
    setHouseholds(h);
    setRoles(r);
    setStandby(ev);
    setInvites(inv);
    setBuckets(bkts);
    const gr = bkts.find((b) => b.isGatherRound) ?? null;
    setGatherBucket(gr);
    if (gr) setPromptText(gr.promptText ?? "");
  }, []);

  useEffect(() => { load(); }, [load]);

  // Standby
  async function handleDeclare(e: React.FormEvent) {
    e.preventDefault();
    if (!standbyName.trim()) return;
    setStandbySubmitting(true);
    setError("");
    try {
      const ev = await api.declareStandby(standbyName.trim());
      setStandby(ev);
      setStandbyName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not declare standby");
    } finally {
      setStandbySubmitting(false);
    }
  }

  async function handleEndStandby() {
    if (!standby) return;
    try {
      await api.endStandby(standby.id);
      setStandby(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not end standby");
    }
  }

  // Roles
  async function handleAddRole(e: React.FormEvent) {
    e.preventDefault();
    if (!roleName.trim()) return;
    setRoleSubmitting(true);
    setRoleError("");
    try {
      const role = await api.createRole(roleName.trim(), roleDesc.trim());
      if (roleHouseholdId) {
        const updated = await api.updateRole(role.id, { householdId: roleHouseholdId });
        setRoles((r) => [...r, updated]);
      } else {
        setRoles((r) => [...r, role]);
      }
      setRoleName("");
      setRoleDesc("");
      setRoleHouseholdId("");
      setShowAddRole(false);
    } catch (err) {
      setRoleError(err instanceof Error ? err.message : "Could not add role");
    } finally {
      setRoleSubmitting(false);
    }
  }

  async function togglePublic(role: SandboxRole) {
    const updated = await api.updateRole(role.id, { isPublic: !role.isPublic });
    setRoles((r) => r.map((x) => (x.id === role.id ? updated : x)));
  }

  async function handleDeleteRole(id: string) {
    await api.deleteRole(id);
    setRoles((r) => r.filter((x) => x.id !== id));
  }

  // Buckets
  async function handleAddBucket(e: React.FormEvent) {
    e.preventDefault();
    if (!newBucketLabel.trim()) return;
    setBucketSubmitting(true);
    try {
      const created = await api.createBucket(newBucketLabel.trim());
      setBuckets((prev) => [...prev, created]);
      setNewBucketLabel("");
      setShowAddBucket(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create bucket");
    } finally {
      setBucketSubmitting(false);
    }
  }

  async function handleSaveBucketLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBucket || !editingBucket.label.trim()) return;
    setBucketSubmitting(true);
    try {
      const updated = await api.updateBucket(editingBucket.id, { label: editingBucket.label.trim() });
      setBuckets((prev) => prev.map((b) => (b.id === editingBucket.id ? updated : b)));
      setEditingBucket(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not rename bucket");
    } finally {
      setBucketSubmitting(false);
    }
  }

  // Invites
  async function handleCreateInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteSubmitting(true);
    try {
      const invite = await api.createInvite(inviteNote.trim() || undefined);
      setInvites((prev) => [invite, ...prev]);
      setInviteNote("");
      setShowAddInvite(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create invite");
    } finally {
      setInviteSubmitting(false);
    }
  }

  async function handleRevokeInvite(id: string) {
    await api.revokeInvite(id);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  // Gather Round prompt
  async function handleSavePrompt(e: React.FormEvent) {
    e.preventDefault();
    if (!gatherBucket) return;
    setPromptSubmitting(true);
    setPromptSaved(false);
    try {
      const updated = await api.updateBucket(gatherBucket.id, { promptText: promptText.trim() || null });
      setGatherBucket(updated);
      setPromptSaved(true);
      setTimeout(() => setPromptSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save prompt");
    } finally {
      setPromptSubmitting(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "standby", label: "Standby" },
    { id: "roles", label: "Roles" },
    { id: "buckets", label: "Buckets" },
    { id: "invites", label: "Invites" },
    { id: "prompt", label: "Prompt" },
    { id: "households", label: "Members" },
  ];

  return (
    <div className="min-h-dvh bg-[#FAF6F0]">
      <header className="sticky top-0 bg-[#FAF6F0] border-b border-[#E4D9CC] px-4 py-4 pt-safe-top z-10">
        <h1 className="text-xl text-[#2E2620]">Organizer</h1>
        <p className="text-xs text-[#7A6B60]">Community management tools</p>

        <div className="flex gap-1 mt-3 overflow-x-auto pb-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[36px] ${
                tab === t.id
                  ? "bg-[#4A6741] text-white"
                  : "bg-[#F0E9DF] text-[#7A6B60]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {error && (
          <p className="text-sm text-[#C7613B] bg-[#FEF3EE] rounded-xl px-4 py-3 border border-[#F5C9B3]">
            {error}
          </p>
        )}

        {/* ── Standby ── */}
        {tab === "standby" && (
          <div className="space-y-4">
            {standby ? (
              <div className="bg-[#F5EAE4] rounded-2xl border border-[#C7613B] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C7613B]" />
                  <p className="text-sm font-medium text-[#2E2620]">Active: {standby.name}</p>
                </div>
                <button
                  onClick={handleEndStandby}
                  className="w-full flex items-center justify-center gap-2 bg-[#FFFDF9] border border-[#C7613B] text-[#C7613B] py-3 rounded-xl text-sm font-medium min-h-[48px] active:scale-95 transition-all"
                >
                  <Square className="w-4 h-4" />
                  End standby event
                </button>
              </div>
            ) : (
              <form onSubmit={handleDeclare} className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-4 space-y-3">
                <p className="text-sm font-medium text-[#2E2620]">Declare a standby event</p>
                <input
                  type="text"
                  value={standbyName}
                  onChange={(e) => setStandbyName(e.target.value)}
                  placeholder="e.g. Winter storm watch — Jan 14"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#C7613B]"
                  required
                />
                <button
                  type="submit"
                  disabled={standbySubmitting || !standbyName.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#C7613B] text-white py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 min-h-[48px] active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4" />
                  {standbySubmitting ? "Declaring…" : "Declare standby"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Roles ── */}
        {tab === "roles" && (
          <div className="space-y-3">
            {!showAddRole ? (
              <button
                onClick={() => setShowAddRole(true)}
                className="w-full flex items-center gap-3 bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] px-4 py-3 min-h-[52px] text-[#7A6B60] hover:border-[#4A6741] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#4A6741]" />
                <span className="text-sm">Add a community role…</span>
              </button>
            ) : (
              <form onSubmit={handleAddRole} className="bg-[#FFFDF9] rounded-2xl border border-[#4A6741]/50 p-4 space-y-3">
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide">New role</p>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. First-aid kit holder"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A6741]"
                  required
                />
                <input
                  type="text"
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  placeholder="Brief description (optional)"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A6741]"
                />
                <select
                  value={roleHouseholdId}
                  onChange={(e) => setRoleHouseholdId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] focus:outline-none focus:border-[#4A6741]"
                >
                  <option value="">Assign to household (optional)</option>
                  {households.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                {roleError && <p className="text-xs text-[#C7613B]">{roleError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddRole(false); setRoleName(""); setRoleDesc(""); setRoleHouseholdId(""); }}
                    className="flex-1 py-3 border border-[#E4D9CC] rounded-xl text-sm text-[#7A6B60] min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={roleSubmitting || !roleName.trim()}
                    className="flex-1 py-3 bg-[#4A6741] text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px] active:scale-95 transition-all"
                  >
                    {roleSubmitting ? "Adding…" : "Add role"}
                  </button>
                </div>
              </form>
            )}

            {roles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#7A6B60] text-sm">No community roles defined yet.</p>
              </div>
            )}

            {roles.map((role) => (
              <div key={role.id} className="bg-[#FFFDF9] rounded-xl border border-[#E4D9CC] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2E2620]">{role.roleName}</p>
                    {role.description && <p className="text-xs text-[#7A6B60] mt-0.5">{role.description}</p>}
                    <p className="text-xs text-[#7A6B60] mt-1">
                      {role.householdName ? `Assigned to ${role.householdName}` : "Unassigned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => togglePublic(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] transition-colors ${
                        role.isPublic ? "bg-[#4A6741] text-white" : "bg-[#F0E9DF] text-[#7A6B60]"
                      }`}
                      title={role.isPublic ? "Public — click to make private" : "Private — click to make public"}
                    >
                      {role.isPublic ? "Public" : "Private"}
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-[#7A6B60] hover:text-[#C7613B] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Buckets ── */}
        {tab === "buckets" && (
          <div className="space-y-3">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#E4D9CC] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Inbox className="w-4 h-4 text-[#4A6741]" />
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide">Board buckets</p>
              </div>
              <p className="text-xs text-[#7A6B60]">
                Built-in buckets cannot be renamed. Custom buckets can be renamed or removed.
              </p>
            </div>

            {!showAddBucket ? (
              <button
                onClick={() => setShowAddBucket(true)}
                className="w-full flex items-center gap-3 bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] px-4 py-3 min-h-[52px] text-[#7A6B60] hover:border-[#4A6741] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#4A6741]" />
                <span className="text-sm">Add a bucket…</span>
              </button>
            ) : (
              <form onSubmit={handleAddBucket} className="bg-[#FFFDF9] rounded-2xl border border-[#4A6741]/50 p-4 space-y-3">
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide">New bucket</p>
                <input
                  type="text"
                  value={newBucketLabel}
                  onChange={(e) => setNewBucketLabel(e.target.value)}
                  placeholder="e.g. Seed swaps"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A6741]"
                  maxLength={50}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddBucket(false); setNewBucketLabel(""); }}
                    className="flex-1 py-3 border border-[#E4D9CC] rounded-xl text-sm text-[#7A6B60] min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bucketSubmitting || !newBucketLabel.trim()}
                    className="flex-1 py-3 bg-[#4A6741] text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px] active:scale-95 transition-all"
                  >
                    {bucketSubmitting ? "Creating…" : "Create"}
                  </button>
                </div>
              </form>
            )}

            {buckets.map((bucket) => (
              <div key={bucket.id} className="bg-[#FFFDF9] rounded-xl border border-[#E4D9CC] p-4">
                {editingBucket?.id === bucket.id ? (
                  <form onSubmit={handleSaveBucketLabel} className="flex gap-2">
                    <input
                      type="text"
                      value={editingBucket.label}
                      onChange={(e) => setEditingBucket({ ...editingBucket, label: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#4A6741] rounded-lg text-sm text-[#2E2620] focus:outline-none"
                      maxLength={50}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setEditingBucket(null)}
                      className="px-3 py-2 border border-[#E4D9CC] rounded-lg text-xs text-[#7A6B60] min-h-[40px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bucketSubmitting}
                      className="px-3 py-2 bg-[#4A6741] text-white rounded-lg text-xs font-medium disabled:opacity-50 min-h-[40px]"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#2E2620]">{bucket.label}</p>
                      <p className="text-xs text-[#7A6B60] mt-0.5">
                        {bucket.isBuiltIn ? "Built-in" : "Custom"}
                        {bucket.isHeadsUp ? " · 72h auto-expire" : ""}
                        {bucket.isGatherRound ? " · Monthly prompt" : ""}
                      </p>
                    </div>
                    {!bucket.isBuiltIn && (
                      <button
                        onClick={() => setEditingBucket({ id: bucket.id, label: bucket.label })}
                        className="p-2 text-[#7A6B60] hover:text-[#4A6741] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Rename bucket"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Invites ── */}
        {tab === "invites" && (
          <div className="space-y-3">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#E4D9CC] p-4">
              <p className="text-xs text-[#7A6B60] leading-relaxed">
                Create a one-time invite code for each new household. Share the code privately — it can only be used once.
              </p>
            </div>

            {!showAddInvite ? (
              <button
                onClick={() => setShowAddInvite(true)}
                className="w-full flex items-center gap-3 bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] px-4 py-3 min-h-[52px] text-[#7A6B60] hover:border-[#4A6741] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#4A6741]" />
                <span className="text-sm">Create invite…</span>
              </button>
            ) : (
              <form onSubmit={handleCreateInvite} className="bg-[#FFFDF9] rounded-2xl border border-[#4A6741]/50 p-4 space-y-3">
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide">New invite</p>
                <input
                  type="text"
                  value={inviteNote}
                  onChange={(e) => setInviteNote(e.target.value)}
                  placeholder="For: The Walsh family (optional note)"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A6741]"
                  maxLength={100}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddInvite(false); setInviteNote(""); }}
                    className="flex-1 py-3 border border-[#E4D9CC] rounded-xl text-sm text-[#7A6B60] min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteSubmitting}
                    className="flex-1 py-3 bg-[#4A6741] text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px] active:scale-95 transition-all"
                  >
                    {inviteSubmitting ? "Generating…" : "Generate code"}
                  </button>
                </div>
              </form>
            )}

            {invites.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#7A6B60] text-sm">No invite codes yet.</p>
              </div>
            )}

            {invites.map((invite) => (
              <div key={invite.id} className={`bg-[#FFFDF9] rounded-xl border p-4 ${invite.usedAt ? "border-[#E4D9CC] opacity-60" : "border-[#4A6741]/30"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-[#2E2620] tracking-widest">{invite.code}</span>
                      {invite.usedAt ? (
                        <span className="text-xs bg-[#F0E9DF] text-[#7A6B60] px-2 py-0.5 rounded-full">Used</span>
                      ) : (
                        <span className="text-xs bg-[#EBF2EA] text-[#4A6741] px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    {invite.note && <p className="text-xs text-[#7A6B60] mt-0.5">{invite.note}</p>}
                    {invite.usedByHouseholdName && (
                      <p className="text-xs text-[#7A6B60] mt-0.5">Used by {invite.usedByHouseholdName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!invite.usedAt && (
                      <>
                        <button
                          onClick={() => copyCode(invite.code)}
                          className="p-2 text-[#7A6B60] hover:text-[#4A6741] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Copy invite code"
                        >
                          {copiedCode === invite.code ? <Check className="w-4 h-4 text-[#4A6741]" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleRevokeInvite(invite.id)}
                          className="p-2 text-[#7A6B60] hover:text-[#C7613B] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Revoke invite"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Gather Round Prompt ── */}
        {tab === "prompt" && (
          <div className="space-y-4">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#E4D9CC] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="w-4 h-4 text-[#4A6741]" />
                <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide">Monthly Gather Round prompt</p>
              </div>
              <p className="text-xs text-[#7A6B60] leading-relaxed">
                Set this month's neighbourhood readiness question. All households see this prompt on the Gather Round page and respond to it.
              </p>
            </div>

            <form onSubmit={handleSavePrompt} className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-4 space-y-3">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="What does your household have this month? What do you need? What can you offer?"
                className="w-full bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl p-3 text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A6741] resize-none min-h-[100px]"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={promptSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#4A6741] text-white py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 min-h-[48px] active:scale-95 transition-all"
              >
                {promptSaved ? (
                  <><Check className="w-4 h-4" /> Saved</>
                ) : (
                  <><Pencil className="w-4 h-4" /> {promptSubmitting ? "Saving…" : "Save prompt"}</>
                )}
              </button>
            </form>

            <div className="bg-[#FAF6F0] rounded-xl border border-[#E4D9CC] p-4">
              <p className="text-xs font-medium text-[#4A3F38] mb-2 uppercase tracking-wide">Preview</p>
              <p className="text-sm text-[#2E2620] leading-relaxed" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
                {promptText.trim() || "What does your household have this month? What do you need? What can you offer?"}
              </p>
            </div>
          </div>
        )}

        {/* ── Households ── */}
        {tab === "households" && (
          <div className="space-y-2">
            {households.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#7A6B60] text-sm">No households have joined yet.</p>
              </div>
            )}
            {households.map((h) => (
              <div key={h.id} className="bg-[#FFFDF9] rounded-xl border border-[#E4D9CC] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#2E2620]">{h.name}</p>
                  <p className="text-xs text-[#7A6B60]">Joined {new Date(h.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {h.isOrganizer && (
                    <span className="text-xs bg-[#4A6741] text-white px-2 py-1 rounded-full">Organizer</span>
                  )}
                  {h.gatherRoundParticipated && (
                    <span className="text-xs bg-[#EBF2EA] text-[#4A6741] px-2 py-1 rounded-full">
                      Gathered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
