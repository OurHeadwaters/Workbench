import { useState } from "react";
import { Link, useRoute } from "wouter";
import { 
  useGetProducer, 
  getGetProducerQueryKey,
  useListLibraryEntries
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Mail, Phone, ExternalLink, ArrowLeft } from "lucide-react";
import { EntryCard } from "@/components/EntryCard";

export default function ProducerDetail() {
  const [, params] = useRoute("/producers/:slug");
  const slug = params?.slug || "";

  const { data: producer, isLoading: producerLoading } = useGetProducer(slug, {
    query: { enabled: !!slug, queryKey: getGetProducerQueryKey(slug) }
  });

  const { data: entriesData, isLoading: entriesLoading } = useListLibraryEntries({ producerSlug: slug });

  if (producerLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif mb-2">Producer not found</h2>
        <Link href="/producers">
          <Button variant="outline">Back to Producers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground mb-4 -ml-4" asChild>
          <Link href="/producers">
            <ArrowLeft className="h-4 w-4" /> Back to Producers
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">{producer.name}</h1>
              {producer.kind && (
                <Badge variant="outline" className="capitalize text-sm font-normal">
                  {producer.kind}
                </Badge>
              )}
            </div>
            {producer.description && (
              <p className="text-muted-foreground text-lg max-w-3xl">
                {producer.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {producer.websiteUrl && (
              <Button variant="outline" className="gap-2" onClick={() => window.open(producer.websiteUrl || undefined, '_blank')}>
                <Globe className="h-4 w-4" /> Website
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-muted-foreground">{producer.location || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                {producer.contactEmail ? (
                  <a href={`mailto:${producer.contactEmail}`} className="text-secondary hover:underline">
                    {producer.contactEmail}
                  </a>
                ) : (
                  <p className="text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Phone</p>
                {producer.contactPhone ? (
                  <a href={`tel:${producer.contactPhone}`} className="text-secondary hover:underline">
                    {producer.contactPhone}
                  </a>
                ) : (
                  <p className="text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-semibold text-foreground">Research & Files</h2>
          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none">
            {entriesData?.total || 0} entries
          </Badge>
        </div>

        {entriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
          </div>
        ) : entriesData?.entries.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No entries found for this producer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {entriesData?.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}