import { useState } from "react";
import {
  useGetHhTasks,
  useClaimHhTask,
  useCompleteHhTask,
  useConfirmHhTask,
  useReleaseHhTask,
  useRepostHhTask,
  getGetHhTasksQueryKey,
  getGetHhDashboardQueryKey,
} from "@workspace/api-client-react";
import { useGetBookkeeperMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, Plus, Clock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type TaskStatus = "all" | "available" | "claimed" | "completed" | "confirmed" | "missed";

function statusBadge(status: string) {
  switch (status) {
    case "available": return <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">Open</Badge>;
    case "claimed": return <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">In progress</Badge>;
    case "completed": return <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">Needs review</Badge>;
    case "confirmed": return <Badge className="bg-slate-100 text-slate-700 border-0 text-xs">Paid</Badge>;
    case "missed": return <Badge className="bg-red-100 text-red-700 border-0 text-xs">Missed</Badge>;
    default: return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
}

function formatPay(amount: string, currency: string, tokenCode?: string) {
  const code = currency === "xrp" ? "XRP" : (tokenCode ?? "tokens");
  return `${parseFloat(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${code}`;
}

function formatMinutes(mins: number) {
  if (mins < 60) return `~${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

export default function HHTasks() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<TaskStatus>("all");
  const today = new Date().toISOString().slice(0, 10);

  const { data: me } = useGetBookkeeperMe();
  const isAdmin = me?.role === "owner" || me?.role === "ops_manager";

  const { data: tasks, isLoading } = useGetHhTasks({
    status: status === "all" ? "all" : status,
  });

  const claimTask = useClaimHhTask();
  const completeTask = useCompleteHhTask();
  const confirmTask = useConfirmHhTask();
  const releaseTask = useReleaseHhTask();
  const repostTask = useRepostHhTask();

  function invalidateTasks() {
    qc.invalidateQueries({ queryKey: getGetHhTasksQueryKey() });
    qc.invalidateQueries({ queryKey: getGetHhDashboardQueryKey() });
  }

  function doAction(
    action: "claim" | "complete" | "confirm",
    id: string,
    title: string,
  ) {
    const labels: Record<string, string> = {
      claim: "Task claimed",
      complete: "Marked as done — waiting for review",
      confirm: "Payment released",
    };

    if (action === "confirm") {
      confirmTask.mutate({ id }, {
        onSuccess: (result) => {
          toast.success(`${labels.confirm}: "${title}"`);
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
          invalidateTasks();
        },
        onError: (e: Error) => toast.error(e.message || "Something went wrong"),
      });
      return;
    }

    const mutate = action === "claim" ? claimTask : completeTask;
    mutate.mutate({ id }, {
      onSuccess: () => {
        toast.success(`${labels[action]}: "${title}"`);
        invalidateTasks();
      },
      onError: (e: Error) => toast.error(e.message || "Something went wrong"),
    });
  }

  function doRelease(id: string, title: string) {
    releaseTask.mutate({ id }, {
      onSuccess: () => {
        toast.success(`Task released back to the pool: "${title}"`);
        invalidateTasks();
      },
      onError: (e: Error) => toast.error(e.message || "Something went wrong"),
    });
  }

  function doRepost(id: string, title: string) {
    repostTask.mutate({ id }, {
      onSuccess: () => {
        toast.success(`Task reposted — open for new claims: "${title}"`);
        invalidateTasks();
      },
      onError: (e: Error) => toast.error(e.message || "Something went wrong"),
    });
  }

  const tabs: { label: string; value: TaskStatus }[] = [
    { label: "All", value: "all" },
    { label: "Open", value: "available" },
    { label: "In progress", value: "claimed" },
    { label: "Needs review", value: "completed" },
    { label: "Paid", value: "confirmed" },
    { label: "Missed", value: "missed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Post and manage tasks for your band members." : "Claim a task and get paid when it's done."}
          </p>
        </div>
        {isAdmin && (
          <Link href="/helping-hands/tasks/new">
            <Button className="shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Post task
            </Button>
          </Link>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === t.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !tasks?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-medium">No tasks here right now.</p>
          {isAdmin && (
            <Link href="/helping-hands/tasks/new">
              <Button variant="outline" className="mt-4">Post the first task</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(task.status)}
                  <span className="text-xs text-muted-foreground">{task.availableDate === today ? "Today" : task.availableDate}</span>
                </div>
                <p className="font-semibold text-foreground">{task.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                    <Coins className="w-4 h-4" />
                    {formatPay(task.payAmount, task.payCurrency)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatMinutes(task.estimatedMinutes)}
                  </span>
                  {task.claimedByName && (
                    <span className="text-xs text-muted-foreground">
                      {task.status === "confirmed" ? "Paid to" : "Claimed by"}{" "}
                      <span className="font-medium">{task.claimedByName}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                {task.status === "available" && !isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => doAction("claim", task.id, task.title)}
                    disabled={claimTask.isPending}
                  >
                    {claimTask.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim this task"}
                  </Button>
                )}
                {task.status === "claimed" && !isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => doAction("complete", task.id, task.title)}
                    disabled={completeTask.isPending}
                  >
                    {completeTask.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Mark as done"}
                  </Button>
                )}
                {task.status === "claimed" && isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-700 border-amber-200 hover:bg-amber-50"
                    onClick={() => doRelease(task.id, task.title)}
                    disabled={releaseTask.isPending}
                  >
                    {releaseTask.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Release (no-show)"}
                  </Button>
                )}
                {task.status === "completed" && isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => doAction("confirm", task.id, task.title)}
                    disabled={confirmTask.isPending}
                  >
                    {confirmTask.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm & pay"}
                  </Button>
                )}
                {task.status === "missed" && isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    onClick={() => doRepost(task.id, task.title)}
                    disabled={repostTask.isPending}
                  >
                    {repostTask.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Repost"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
