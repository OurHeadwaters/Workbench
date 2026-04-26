import { useRoute } from "wouter";
import {
  useGetShareLinkByToken,
  getGetShareLinkByTokenQueryKey,
} from "@workspace/api-client-react";
import WhyStoresFailPage from "@/pages/why-stores-fail";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function PublicWhyStoresFail() {
  const [, params] = useRoute("/share/:token/why-stores-fail");
  const token = params?.token || "";

  const { data: shareLink, isLoading, error } = useGetShareLinkByToken(token, {
    query: {
      enabled: !!token,
      queryKey: getGetShareLinkByTokenQueryKey(token),
      retry: false,
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-muted/30 px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !shareLink) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-muted-foreground">
              This share link is no longer valid or has been revoked.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="font-serif text-lg text-primary font-bold">
            {shareLink.ownerLabel || "Northern Food Systems Research Library"}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Read-only share for {shareLink.contributorName}
          </div>
        </div>
        <WhyStoresFailPage readOnly />
      </div>
    </div>
  );
}
