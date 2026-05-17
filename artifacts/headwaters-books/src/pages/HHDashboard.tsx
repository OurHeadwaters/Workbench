import { useGetHhDashboard, useConfirmHhTask, getGetHhDashboardQueryKey, getGetHhTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { CheckCircle2, Clock, Users, AlertTriangle, Loader2, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function statusBadge(status: string) {
  switch (status) {
    case "available": return <Badge className="bg-emerald-100 text-emerald-800 border-0">Open</Badge>;
    case "claimed": return <Badge className="bg-blue-100 text-blue-800 border-0">In progress</Badge>;
    case "completed": return <Badge className="bg-amber-100 text-amber-800 border-0">Needs review</Badge>;
    case "confirmed": return <Badge className="bg-slate-100 text-slate-700 border-0">Paid</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

export default function HHDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetHhDashboard();
  const confirm = useConfirmHhTask();

  function handleConfirm(taskId: string, title: string) {
    confirm.mutate({ id: taskId }, {
      onSuccess: () => {
        toast.success(`Payment released for "${title}"`);
        qc.invalidateQueries({ queryKey: getGetHhDashboardQueryKey() });
        qc.invalidateQueries({ queryKey: getGetHhTasksQueryKey() });
      },
      onError: (e: Error) => toast.error(e.message || "Could not confirm"),
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

  return (
    <div className="space-y-8">
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
      </div>

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
