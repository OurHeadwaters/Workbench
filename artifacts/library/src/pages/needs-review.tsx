import { useState } from "react";
import { Link } from "wouter";
import { useListNeedsReview, useUpdateLibraryEntry, getListNeedsReviewQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Globe, File as FileIcon, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { entryAssetUrl, errMessage } from "@/lib/utils";

export default function NeedsReview() {
  const { data: entries, isLoading } = useListNeedsReview();
  const updateEntry = useUpdateLibraryEntry();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [processingId, setProcessingId] = useState<string | null>(null);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Review Queue</h1>
          <p className="text-muted-foreground">Approve entries submitted by contributors via share links.</p>
        </div>
      </div>

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
          {entries?.map((entry) => {
            const assetUrl = entryAssetUrl(entry);
            
            let TypeIcon = FileText;
            if (entry.kind === "web_source") TypeIcon = Globe;
            else if (entry.fileType) TypeIcon = FileIcon;

            return (
              <Card key={entry.id} className="border-border bg-card shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Left: Preview/Info */}
                  <div className="w-full md:w-48 h-48 bg-muted border-r border-border shrink-0 flex items-center justify-center relative overflow-hidden">
                    {assetUrl && (entry.fileType === "image" || entry.kind === "web_source") ? (
                      <img 
                        src={assetUrl} 
                        alt={entry.title} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <TypeIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                    )}
                  </div>
                  
                  {/* Right: Details & Actions */}
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
                          onClick={() => handleApprove(entry.id)}
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
          })}
        </div>
      )}
    </div>
  );
}
