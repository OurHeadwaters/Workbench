import { useGetHhDashboard, useConfirmHhTask, useExpireOverdueHhTasks, getGetHhDashboardQueryKey, getGetHhTasksQueryKey, getGetHhMembersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Link } from "wouter";
import { CheckCircle2, Clock, Users, AlertTriangle, Loader2, Coins, RefreshCw, Star, Trophy, Wallet, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WalletRevealOverlay from "@/components/WalletRevealOverlay";

function statusBadge(status: string) {
  switch (status) {
    case "available": return <Badge className="bg-emerald-100 text-emerald-800 border-0">Open</Badge>;
    case "claimed": return <Badge className="bg-blue-100 text-blue-800 border-0">In progress</Badge>;
    case "completed": return <Badge className="bg-amber-100 text-amber-800 border-0">Needs review</Badge>;
    case "confirmed": return <Badge className="bg-slate-100 text-slate-700 border-0">Paid</Badge>;
    case "missed": return <Badge className="bg-red-100 text-red-700 border-0">Missed</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

const RANK_COLORS = [
  "bg-amber-400 text-amber-900",
  "bg-slate-300 text-slate-800",
  "bg-amber-600/70 text-amber-950",
  "bg-muted text-muted-foreground",
  "bg-muted text-muted-foreground",
];

export default function HHDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetHhDashboard();
  const confirm = useConfirmHhTask();
  const expireOverdue = useExpireOverdueHhTasks();

  function handleConfirm(taskId: string, title: string) {
    confirm.mutate({ id: taskId }, {
      onSuccess: (result) => {
        toast.success(`Payment released for "${title}"`);
        if (result.bonusAwarded) {
          const b = result.bonusAwarded;
          const name = `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim();
          const amount = parseFloat(b.amount).toLocaleString(undefined, { maximumFractionDigits: 2 });
          const label = b.currency === "xrp" ? "XRP" : "tokens";
          setTimeout(() => {
            toast.success(
              `Reliability bonus! ${name} hit ${b.milestone} confirmed shifts — +${amount} ${label} awarded`,
              { duration: 6000, icon: "🏆" },
            );
          }, 400);
        }
        qc.invalidateQueries({ queryKey: getGetHhDashboardQueryKey() });
        qc.invalidateQueries({ queryKey: getGetHhTasksQueryKey() });
        qc.invalidateQueries({ queryKey: getGetHhMembersQueryKey() });
      },
      onError: (e: Error) => toast.error(e.message || "Could not confirm"),
    });
  }

  function handleExpireOverdue() {
    expireOverdue.mutate(undefined, {
      onSuccess: (result) => {
        toast.success(result.message);
        qc.invalidateQueries({ queryKey: getGetHhDashboardQueryKey() });
        qc.invalidateQueries({ queryKey: getGetHhTasksQueryKey() });
        qc.invalidateQueries({ queryKey: getGetHhMembersQueryKey() });
      },
      onError: (e: Error) => toast.error(e.message || "Could not run check"),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const d = data!;
  const topContributors = d.topContributors ?? [];

  return (
    <div className="space-y-8">
      <WalletRevealOverlay />
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Helping Hands</h1>
        <p className="text-muted-foreground mt-1">Today's workforce overview for your band.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open today", value: d.todayAvailable, icon: Coins, color: "text-emerald-600" },
          { label: "In progress", value: d.todayClaimed, icon: Clock, color: "text-blue-600" },
          { label: "Needs review", value: d.pendingConfirmation, icon: CheckCircle2, color: "text-amber-600" },
          { label: "Members flagged", value: d.flaggedMembers, icon: AlertTriangle, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-5 flex flex-col gap-2">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions shortcut */}
      <div className="flex flex-wrap gap-3">
        <Link href="/helping-hands/tasks/new">
          <Button>Post a new task</Button>
        </Link>
        <Link href="/helping-hands/tasks">
          <Button variant="outline">See all tasks</Button>
        </Link>
        <Link href="/helping-hands/roster">
          <Button variant="outline">
            <Users className="w-4 h-4 mr-1" /> Roster ({d.totalMembers})
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleExpireOverdue}
          disabled={expireOverdue.isPending}
          title="Mark overdue claimed tasks as missed and update Full-Time member shift counts"
        >
          {expireOverdue.isPending
            ? <Loader2 className="w-4 h-4 animate-spin mr-1" />
            : <RefreshCw className="w-4 h-4 mr-1" />}
          Run missed-shift check
        </Button>
        <Link href="/helping-hands/envelopes">
          <Button variant="outline">
            <Wallet className="w-4 h-4 mr-1" /> My envelopes
          </Button>
        </Link>
        <Link href="/helping-hands/merchants">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-1" /> Stores
          </Button>
        </Link>
      </div>

      {/* Top contributors — shown first, 10× more prominent than the flags section */}
      {topContributors.filter((m) => m.completedShiftCount > 0).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-foreground">Top Contributors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topContributors
              .filter((m) => m.completedShiftCount > 0)
              .map((m, i) => (
                <div
                  key={m.id}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${RANK_COLORS[i] ?? RANK_COLORS[4]}`}>
                    {i === 0 ? <Star className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.completedShiftCount} confirmed shift{m.completedShiftCount !== 1 ? "s" : ""}
                      {" · "}
                      {parseFloat(m.totalEarnedToken) > 0
                        ? `${parseFloat(m.totalEarnedToken).toFixed(2)} tokens`
                        : `${parseFloat(m.totalEarnedXrp).toFixed(4)} XRP`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Envelope summary */}
      <EnvelopeSummary />

      {/* Tasks needing confirmation */}
      {d.pendingConfirmation > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Tasks waiting for your review</h2>
          <div className="space-y-2">
            {(d.recentTasks ?? [])
              .filter((t) => t.status === "completed")
              .map((task) => (
                <div key={task.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Done by <span className="font-medium">{task.claimedByName ?? "Unknown"}</span>
                      {" · "}{task.payAmount} {task.payCurrency === "token" ? "tokens" : "XRP"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConfirm(task.id, task.title)}
                    disabled={confirm.isPending}
                  >
                    {confirm.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm & pay"}
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Recent activity</h2>
        {(d.recentTasks ?? []).length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks yet. Post one to get started.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            {(d.recentTasks ?? []).slice(0, 6).map((task, i, arr) => (
              <div key={task.id} className={`flex items-center gap-4 p-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.payAmount} {task.payCurrency === "token" ? "tokens" : "XRP"}
                    {task.claimedByName ? ` · ${task.claimedByName}` : ""}
                  </p>
                </div>
                {statusBadge(task.status)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* XRPL note */}
      <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">How payment works:</strong> When you post a task, the pay is locked in a secure hold (XRPL escrow).
        When you confirm the task is done, the payment goes directly to the member's wallet — instantly and automatically.
        No bank transfers, no waiting.
      </div>
    </div>
  );
}

// ── Envelope summary widget ─────────────────────────────────────────
interface Envelope {
  id: string;
  label: string;
  icon: string;
  monthlyBudget: string;
  spentThisMonth: string;
}

interface HealthData {
  score: number;
  tier: string;
  message: string;
}

function EnvelopeSummary() {
  const { data: envelopes } = useQuery<Envelope[]>({
    queryKey: ["hh-envelopes"],
    queryFn: () => customFetch<Envelope[]>("/helping-hands/my/envelopes", {}),
  });
  const { data: health } = useQuery<HealthData>({
    queryKey: ["hh-health"],
    queryFn: () => customFetch<HealthData>("/helping-hands/my/health", {}),
  });

  if (!envelopes || envelopes.length === 0) return null;

  const tierColor = (tier: string) => {
    switch (tier) {
      case "strong": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "steady": return "text-blue-700 bg-blue-50 border-blue-200";
      case "building": return "text-amber-700 bg-amber-50 border-amber-200";
      default: return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">My envelope budgets</h2>
        <Link href="/helping-hands/envelopes">
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Manage &rarr;
          </button>
        </Link>
      </div>

      {health && (
        <div className={`rounded-lg border px-4 py-3 mb-3 text-sm flex items-center justify-between gap-3 ${tierColor(health.tier)}`}>
          <span>{health.message}</span>
          <span className="font-bold text-base shrink-0">{health.score}<span className="font-normal text-xs">/100</span></span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {envelopes.slice(0, 4).map((env) => {
          const budget = parseFloat(env.monthlyBudget);
          const spent = parseFloat(env.spentThisMonth);
          const p = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          return (
            <div key={env.id} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs font-medium text-foreground truncate">{env.label}</p>
              <p className="text-sm font-bold text-foreground mt-1">{spent.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground">of {budget.toFixed(2)}</p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${p >= 90 ? "bg-red-500" : p >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
