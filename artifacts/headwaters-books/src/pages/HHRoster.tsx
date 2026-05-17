import { useState } from "react";
import { useGetHhMembers, useCreateHhMember, useUpdateHhMember, getGetHhMembersQueryKey } from "@workspace/api-client-react";
import { useGetBookkeeperMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, AlertTriangle, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Tier = "full_time" | "casual" | "task_based";

const TIER_LABELS: Record<Tier, string> = {
  full_time: "Full-Time",
  casual: "Casual",
  task_based: "Task-Based",
};

const TIER_COLORS: Record<Tier, string> = {
  full_time: "bg-violet-100 text-violet-800 border-0",
  casual: "bg-blue-100 text-blue-800 border-0",
  task_based: "bg-slate-100 text-slate-700 border-0",
};

function tierBadge(tier: string) {
  const t = tier as Tier;
  return <Badge className={`text-xs ${TIER_COLORS[t] ?? ""}`}>{TIER_LABELS[t] ?? tier}</Badge>;
}

export default function HHRoster() {
  const qc = useQueryClient();
  const { data: me } = useGetBookkeeperMe();
  const isAdmin = me?.role === "owner" || me?.role === "ops_manager";

  const { data: members, isLoading } = useGetHhMembers();
  const createMember = useCreateHhMember();
  const updateMember = useUpdateHhMember();

  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", tier: "task_based" as Tier });

  function handleAdd() {
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Fill in all fields");
      return;
    }
    createMember.mutate(
      { data: { ...form } },
      {
        onSuccess: () => {
          toast.success(`${form.firstName} ${form.lastName} added to the roster`);
          setForm({ firstName: "", lastName: "", email: "", tier: "task_based" });
          setShowAdd(false);
          qc.invalidateQueries({ queryKey: getGetHhMembersQueryKey() });
        },
        onError: (e: Error) => toast.error(e.message || "Could not add member"),
      },
    );
  }

  function handleTierChange(id: string, tier: Tier) {
    updateMember.mutate(
      { id, data: { tier } },
      {
        onSuccess: () => {
          toast.success("Tier updated");
          qc.invalidateQueries({ queryKey: getGetHhMembersQueryKey() });
        },
        onError: (e: Error) => toast.error(e.message || "Could not update"),
      },
    );
  }

  function handleDismissFlag(id: string) {
    updateMember.mutate(
      { id, data: { flaggedForDemotion: false, missedShiftCount: 0 } },
      {
        onSuccess: () => {
          toast.success("Flag cleared");
          qc.invalidateQueries({ queryKey: getGetHhMembersQueryKey() });
        },
        onError: (e: Error) => toast.error(e.message || "Could not clear flag"),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const flagged = (members ?? []).filter((m) => m.flaggedForDemotion);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Member Roster</h1>
          <p className="text-muted-foreground mt-1">Track everyone's tier, earnings, and reliability.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "outline" : "default"} className="shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add member
          </Button>
        )}
      </div>

      {/* Add member form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-foreground">Add a member</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>First name</Label>
              <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="Sarah" />
            </div>
            <div className="space-y-1">
              <Label>Last name</Label>
              <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Cardinal" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="sarah@example.com" />
            </div>
            <div className="space-y-1">
              <Label>Starting tier</Label>
              <select
                value={form.tier}
                onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as Tier }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="task_based">Task-Based</option>
                <option value="casual">Casual</option>
                <option value="full_time">Full-Time</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={createMember.isPending}>
              {createMember.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to roster"}
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Flagged members banner */}
      {flagged.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-medium">
            <AlertTriangle className="w-4 h-4" />
            {flagged.length} member{flagged.length > 1 ? "s" : ""} flagged for demotion
          </div>
          {flagged.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-red-700">{m.firstName} {m.lastName} — {m.missedShiftCount} missed shifts</span>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleTierChange(m.id, "casual")}>
                    Move to Casual
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDismissFlag(m.id)}>
                    Clear flag
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tier key */}
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Tiers:</span>
        <span><Badge className="bg-violet-100 text-violet-800 border-0 text-xs mr-1">Full-Time</Badge> Regular scheduled shifts</span>
        <span><Badge className="bg-blue-100 text-blue-800 border-0 text-xs mr-1">Casual</Badge> Flexible availability</span>
        <span><Badge className="bg-slate-100 text-slate-700 border-0 text-xs mr-1">Task-Based</Badge> Picks tasks as they want</span>
      </div>

      {/* Member list */}
      {!members?.length ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No members yet. Add the first one.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => {
            const isExpanded = expandedId === m.id;
            return (
              <div key={m.id} className={`bg-card border rounded-lg overflow-hidden transition-all ${m.flaggedForDemotion ? "border-red-300" : "border-border"}`}>
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : m.id)}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {m.firstName} {m.lastName}
                      </span>
                      {m.flaggedForDemotion && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {tierBadge(m.tier)}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4 bg-muted/10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Confirmed shifts</p>
                        <p className="font-medium text-emerald-700">{m.completedShiftCount ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Total earned (token)</p>
                        <p className="font-medium text-foreground">{parseFloat(m.totalEarnedToken).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Total earned (XRP)</p>
                        <p className="font-medium text-foreground">{parseFloat(m.totalEarnedXrp).toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Missed shifts</p>
                        <p className={`font-medium ${m.missedShiftCount > 0 ? "text-red-600" : "text-foreground"}`}>
                          {m.missedShiftCount}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground mb-0.5">XRPL wallet</p>
                        <p className="font-mono text-xs text-foreground truncate">{m.xrplAddress ?? "Not connected"}</p>
                      </div>
                    </div>

                    {m.didRef && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Identity record (DID)</p>
                        <p className="font-mono text-xs text-muted-foreground break-all">{m.didRef}</p>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Change tier:</span>
                          {(["full_time", "casual", "task_based"] as Tier[]).filter((t) => t !== m.tier).map((t) => (
                            <Button
                              key={t}
                              size="sm"
                              variant="outline"
                              onClick={() => handleTierChange(m.id, t)}
                              disabled={updateMember.isPending}
                            >
                              {TIER_LABELS[t]}
                            </Button>
                          ))}
                        </div>
                        {m.flaggedForDemotion && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissFlag(m.id)}
                            className="text-muted-foreground"
                          >
                            <UserCheck className="w-3 h-3 mr-1" /> Clear flag
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
