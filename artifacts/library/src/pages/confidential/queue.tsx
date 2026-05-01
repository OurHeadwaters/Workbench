import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Lock,
  ShieldAlert,
  FileText,
  File as FileIcon,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { errMessage } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";

type ConfidentialTier = "draft" | "under-review" | "refused" | "routed";

type QueueEntry = {
  id: string;
  title: string;
  originalFilename: string | null;
  contentType: string | null;
  fileType: string | null;
  kind: string;
  status: string;
  statusFlag: string | null;
  notes: string | null;
  fileSize: number | null;
  createdAt: string;
  updatedAt: string;
};

const TIER_LABELS: Record<ConfidentialTier, string> = {
  draft: "draft",
  "under-review": "under-review",
  refused: "refused",
  routed: "routed",
};

const TIER_COLORS: Record<ConfidentialTier, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-300",
  "under-review": "bg-amber-100 text-amber-700 border-amber-300",
  refused: "bg-red-100 text-red-700 border-red-300",
  routed: "bg-blue-100 text-blue-700 border-blue-300",
};

function getOwnerToken(): string | null {
  try {
    return window.localStorage.getItem("library:owner-token");
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getOwnerToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function fetchQueue(): Promise<QueueEntry[]> {
  const res = await fetch("/api/library/confidential/queue", {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch queue: ${res.status}`);
  return res.json();
}

async function updateTier(id: string, tier: ConfidentialTier): Promise<void> {
  const res = await fetch(`/api/library/confidential/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ tier }),
  });
  if (!res.ok) throw new Error(`Failed to update tier: ${res.status}`);
}

async function clearEntry(id: string): Promise<void> {
  const res = await fetch(`/api/library/confidential/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ action: "clear" }),
  });
  if (!res.ok) throw new Error(`Failed to clear entry: ${res.status}`);
}

async function refuseEntry(id: string, reason: string): Promise<void> {
  const res = await fetch(`/api/library/confidential/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ action: "refuse", reason }),
  });
  if (!res.ok) throw new Error(`Failed to refuse entry: ${res.status}`);
}

async function routeEntry(id: string): Promise<void> {
  const res = await fetch(`/api/library/confidential/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ action: "route" }),
  });
  if (!res.ok) throw new Error(`Failed to route entry: ${res.status}`);
}

const QUEUE_KEY = ["confidential-queue"];

export default function ConfidentialQueue() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery<QueueEntry[]>({
    queryKey: QUEUE_KEY,
    queryFn: fetchQueue,
  });

  const [refuseDialogId, setRefuseDialogId] = useState<string | null>(null);
  const [refuseReason, setRefuseReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const CONFIDENTIAL_COUNT_KEY = ["confidential-count"];
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: QUEUE_KEY });
    await queryClient.invalidateQueries({ queryKey: CONFIDENTIAL_COUNT_KEY });
  };

  const handleTierChange = async (id: string, tier: ConfidentialTier) => {
    setProcessingId(id);
    try {
      await updateTier(id, tier);
      await invalidate();
    } catch (err) {
      toast({ title: "Error", description: errMessage(err), variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleClear = async (id: string) => {
    setProcessingId(id);
    try {
      await clearEntry(id);
      await invalidate();
      toast({ title: "Cleared", description: "Entry moved to library with confidential flag." });
    } catch (err) {
      toast({ title: "Error", description: errMessage(err), variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoute = async (id: string) => {
    setProcessingId(id);
    try {
      await routeEntry(id);
      await invalidate();
      toast({ title: "Routed", description: "Entry marked for external counsel / band admin." });
    } catch (err) {
      toast({ title: "Error", description: errMessage(err), variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefuseConfirm = async () => {
    if (!refuseDialogId) return;
    const id = refuseDialogId;
    setProcessingId(id);
    setRefuseDialogId(null);
    try {
      await refuseEntry(id, refuseReason.trim());
      await invalidate();
      toast({ title: "Refused", description: "Entry stayed in quarantine with refusal note." });
    } catch (err) {
      toast({ title: "Error", description: errMessage(err), variant: "destructive" });
    } finally {
      setProcessingId(null);
      setRefuseReason("");
    }
  };

  const active = entries?.filter(
    (e) => e.statusFlag !== "refused" && e.statusFlag !== "routed",
  ) ?? [];
  const settled = entries?.filter(
    (e) => e.statusFlag === "refused" || e.statusFlag === "routed",
  ) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-6 w-6 text-rose-600" />
            <h1 className="text-3xl font-serif font-bold text-primary">
              Confidential Queue
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Files dropped into the confidential intake land here — quarantined,
            invisible to share links, and unreachable by public URLs until you
            act on them. Use the Gate&rsquo;s severity ladder to tag each item,
            then clear, refuse, or route it.
          </p>
        </div>
        <Link href="/entries/new">
          <Button variant="outline" size="sm" className="gap-2 shrink-0">
            <Lock className="h-4 w-4" />
            Drop a file
          </Button>
        </Link>
      </div>

      <Card className="bg-rose-50 border-rose-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 text-sm text-rose-800">
            <Lock className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
            <div>
              <span className="font-semibold">Access lockdown is active.</span>{" "}
              Every file in this queue is stored privately. No share link or
              public URL can reach it until you click{" "}
              <span className="font-semibold">Clear</span>. The Gate&rsquo;s
              severity ladder (draft → under-review → cleared / refused) applies
              to each item.
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : active.length === 0 && settled.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
          <h3 className="text-lg font-serif font-medium text-foreground mb-1">
            Queue is empty
          </h3>
          <p className="text-muted-foreground">
            No confidential files waiting for review. Use the confidential drop
            zone on the Add to Library page to queue a document.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Awaiting judgment ({active.length})
              </h2>
              {active.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  processing={processingId === entry.id}
                  onTierChange={(tier) => handleTierChange(entry.id, tier)}
                  onClear={() => handleClear(entry.id)}
                  onRefuse={() => {
                    setRefuseReason("");
                    setRefuseDialogId(entry.id);
                  }}
                  onRoute={() => handleRoute(entry.id)}
                />
              ))}
            </div>
          )}

          {settled.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Settled — refused or routed ({settled.length})
              </h2>
              {settled.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  processing={processingId === entry.id}
                  onTierChange={(tier) => handleTierChange(entry.id, tier)}
                  onClear={() => handleClear(entry.id)}
                  onRefuse={() => {
                    setRefuseReason("");
                    setRefuseDialogId(entry.id);
                  }}
                  onRoute={() => handleRoute(entry.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog
        open={!!refuseDialogId}
        onOpenChange={(open) => !open && setRefuseDialogId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Refuse this file</DialogTitle>
            <DialogDescription>
              The file stays in quarantine. Add a one-line reason so the record
              reflects why the Gate declined to clear it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="refuse-reason">Reason (optional)</Label>
            <Textarea
              id="refuse-reason"
              placeholder="Legal risk · no honest massity equivalent · do not publish"
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRefuseDialogId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRefuseConfirm}>
              Refuse and keep quarantined
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EntryRow({
  entry,
  processing,
  onTierChange,
  onClear,
  onRefuse,
  onRoute,
}: {
  entry: QueueEntry;
  processing: boolean;
  onTierChange: (tier: ConfidentialTier) => void;
  onClear: () => void;
  onRefuse: () => void;
  onRoute: () => void;
}) {
  const tier = (entry.statusFlag as ConfidentialTier) ?? "draft";
  const tierColor = TIER_COLORS[tier] ?? TIER_COLORS.draft;

  const isSettled = tier === "refused" || tier === "routed";

  let TypeIcon = FileText;
  if (entry.fileType === "image") TypeIcon = FileIcon;

  const droppedAt = format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a");

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-16 h-16 md:h-auto bg-rose-50 border-r border-rose-100 shrink-0 flex items-center justify-center">
          <Lock className="h-6 w-6 text-rose-400" />
        </div>

        <div className="p-4 md:p-5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">
                  {entry.originalFilename ??
                    entry.contentType ??
                    entry.fileType ??
                    "file"}
                </span>
                {entry.fileSize && (
                  <span className="text-xs text-muted-foreground">
                    · {(entry.fileSize / 1024).toFixed(0)} KB
                  </span>
                )}
              </div>
              <h3 className="font-serif font-semibold text-foreground text-base leading-tight mb-1">
                {entry.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Dropped {droppedAt}</span>
              </div>
              {entry.notes && tier === "refused" && (
                <p className="mt-2 text-sm text-rose-700 bg-rose-50 rounded px-2 py-1 border border-rose-100">
                  Refusal note: {entry.notes}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${tierColor}`}
                >
                  {TIER_LABELS[tier] ?? tier}
                </Badge>
              </div>

              <Select
                value={tier}
                onValueChange={(v) => onTierChange(v as ConfidentialTier)}
                disabled={processing || isSettled}
              >
                <SelectTrigger className="h-7 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">draft</SelectItem>
                  <SelectItem value="under-review">under-review</SelectItem>
                </SelectContent>
              </Select>

              {!isSettled && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs"
                        onClick={onClear}
                        disabled={processing}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50 h-7 text-xs"
                        onClick={onRoute}
                        disabled={processing}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Route
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-rose-700 border-rose-200 hover:bg-rose-50 h-7 text-xs"
                        onClick={onRefuse}
                        disabled={processing}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Refuse
                      </Button>
                    </>
                  )}
                </div>
              )}

              {isSettled && tier === "refused" && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    size="sm"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs"
                    onClick={onClear}
                    disabled={processing}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Override — Clear anyway
                  </Button>
                </div>
              )}
              {isSettled && tier === "routed" && (
                <p className="text-xs text-muted-foreground italic">
                  Routed — locked for external review
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
