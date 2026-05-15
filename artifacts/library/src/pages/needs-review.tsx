import { useState } from "react";
import { Link } from "wouter";
import { useListNeedsReview, useUpdateLibraryEntry, getListNeedsReviewQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Globe, File as FileIcon, ExternalLink, Link2, AlertTriangle, Clock, Wifi } from "lucide-react";
import { format } from "date-fns";
import { errMessage } from "@/lib/utils";
import { getOwnerToken } from "@/lib/ownerAuth";
import { useSignedAssetUrl } from "@/hooks/useSignedAssetUrl";
import { type LibraryEntry } from "@workspace/api-client-react";

interface LinkCheckResult {
  total: number;
  passed: number;
  failed: number;
  timedOut: number;
  fetchErrors: number;
  blocked: number;
  flagged: { id: string; title: string; url: string; reason: string; httpStatus: number | null }[];
}

interface NeedsReviewRowProps {
  entry: LibraryEntry;
  processingId: string | null;
  failedImages: Set<string>;
  onApprove: (id: string) => void;
  onImageError: (id: string) => void;
}

function NeedsReviewRow({ entry, processingId, failedImages, onApprove, onImageError }: NeedsReviewRowProps) {
  const assetUrl = useSignedAssetUrl(entry);

  let TypeIcon = FileText;
  if (entry.kind === "web_source") TypeIcon = Globe;
  else if (entry.fileType) TypeIcon = FileIcon;

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-48 bg-muted border-r border-border shrink-0 flex items-center justify-center relative overflow-hidden">
          {assetUrl && (entry.fileType === "image" || entry.kind === "web_source") && !failedImages.has(entry.id) ? (
            <img
              src={assetUrl}
              alt={entry.title}
              className="object-cover w-full h-full"
              onError={() => onImageError(entry.id)}
            />
          ) : (
            <TypeIcon className="h-12 w-12 text-muted-foreground opacity-20" />
          )}
        </div>

        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <TypeIcon className="h-3.5 w-3.5" />
                <span>{entry.kind === "web_source" ? "Web Source" : entry.fileType?.toUpperCase() || "File"}</span>
                <span>•</span>
                <span>{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
                {entry.contributor && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-foreground">Added by {entry.contributor.name}</span>
                  </>
                )}
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-1">
                {entry.title}
              </h3>
              {entry.producer && (
                <p className="text-sm font-medium text-secondary mb-3">{entry.producer.name}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(entry.id)}
                disabled={processingId === entry.id}
                className="gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
              <Link href={`/entries/${entry.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Review
                </Button>
              </Link>
            </div>
          </div>

          {entry.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4">
              {entry.summary}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-auto pt-4">
            {entry.subjects.map(subject => (
              <Badge key={subject.slug} variant="outline" className="bg-background/50 font-normal">
                {subject.name}
              </Badge>
            ))}
            {entry.buckets.map(bucket => (
              <Badge key={bucket.slug} variant="outline" className="bg-background/50 font-normal">
                {bucket.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function NeedsReview() {
  const { data: entries, isLoading } = useListNeedsReview();
  const updateEntry = useUpdateLibraryEntry();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [linkCheckRunning, setLinkCheckRunning] = useState(false);
  const [linkCheckResult, setLinkCheckResult] = useState<LinkCheckResult | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await updateEntry.mutateAsync({
        id,
        data: { status: "published" }
      });
      
      queryClient.invalidateQueries({ queryKey: getListNeedsReviewQueryKey() });
      toast({
        title: "Entry Approved",
        description: "The entry has been published to the library.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: errMessage(err, "Could not approve the entry."),
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleLinkCheck = async () => {
    setLinkCheckRunning(true);
    setLinkCheckResult(null);
    try {
      const token = getOwnerToken();
      const res = await fetch("/api/library/link-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
      }
      const result: LinkCheckResult = await res.json();
      setLinkCheckResult(result);
      if (result.flagged.length > 0) {
        queryClient.invalidateQueries({ queryKey: getListNeedsReviewQueryKey() });
        toast({
          title: "Link Check Complete",
          description: `${result.flagged.length} dead link${result.flagged.length === 1 ? "" : "s"} flagged for review.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Link Check Complete",
          description: `All ${result.passed} link${result.passed === 1 ? "" : "s"} are reachable.`,
        });
      }
    } catch (err) {
      toast({
        title: "Link Check Failed",
        description: errMessage(err, "Could not run the link check."),
        variant: "destructive",
      });
    } finally {
      setLinkCheckRunning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Review Queue</h1>
          <p className="text-muted-foreground">Approve entries submitted by contributors via share links.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLinkCheck}
          disabled={linkCheckRunning}
          className="gap-2 shrink-0"
        >
          <Link2 className={`h-4 w-4 ${linkCheckRunning ? "animate-pulse" : ""}`} />
          {linkCheckRunning ? "Checking links…" : "Run Link Check"}
        </Button>
      </div>

      {linkCheckResult && (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Link Check Results
              <span className="text-xs font-normal text-muted-foreground ml-auto">
                {linkCheckResult.total} URL{linkCheckResult.total === 1 ? "" : "s"} checked
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">{linkCheckResult.passed} passed</span>
              </div>
              {linkCheckResult.failed > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-600">{linkCheckResult.failed} error status</span>
                </div>
              )}
              {linkCheckResult.timedOut > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-amber-600">{linkCheckResult.timedOut} timed out</span>
                </div>
              )}
              {linkCheckResult.fetchErrors > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Wifi className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-orange-600">{linkCheckResult.fetchErrors} unreachable</span>
                </div>
              )}
              {linkCheckResult.blocked > 0 && (
                <div className="flex items-center gap-1.5 text-sm" title="URLs that resolve to private/internal network addresses — skipped for security, not moved to review queue">
                  <AlertTriangle className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-500">{linkCheckResult.blocked} blocked (internal URL)</span>
                </div>
              )}
            </div>

            {linkCheckResult.flagged.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Flagged entries moved to review queue</p>
                <div className="space-y-1.5">
                  {linkCheckResult.flagged.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 text-sm rounded-md bg-red-50 border border-red-100 px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium text-foreground">{item.title}</span>
                        <span className="text-muted-foreground mx-1.5">·</span>
                        <span className="text-xs text-muted-foreground truncate block">
                          {item.url}
                          {item.httpStatus && (
                            <Badge variant="outline" className="ml-2 text-xs text-red-600 border-red-200 bg-red-50">
                              HTTP {item.httpStatus}
                            </Badge>
                          )}
                          {item.reason === "timeout" && (
                            <Badge variant="outline" className="ml-2 text-xs text-amber-600 border-amber-200 bg-amber-50">
                              Timed out
                            </Badge>
                          )}
                          {item.reason === "fetch_error" && (
                            <Badge variant="outline" className="ml-2 text-xs text-orange-600 border-orange-200 bg-orange-50">
                              Unreachable
                            </Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-green-700 font-medium">All external links are reachable — no entries flagged.</p>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : entries?.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <h3 className="text-lg font-serif font-medium text-foreground mb-1">Queue is empty</h3>
          <p className="text-muted-foreground">All caught up! No entries waiting for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries?.map((entry) => (
            <NeedsReviewRow
              key={entry.id}
              entry={entry}
              processingId={processingId}
              failedImages={failedImages}
              onApprove={handleApprove}
              onImageError={(id) => setFailedImages(prev => new Set([...prev, id]))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
