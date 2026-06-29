import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, Star } from "lucide-react";
import {
  useListReviews,
  getListReviewsQueryKey,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  type Review,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Source = "facebook" | "instagram" | "google" | "other";

export default function AdminReviews() {
  const qc = useQueryClient();
  const { data: reviews, isLoading } = useListReviews();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListReviewsQueryKey() });
  const create = useCreateReview({ mutation: { onSuccess: invalidate } });
  const update = useUpdateReview({ mutation: { onSuccess: invalidate } });
  const del = useDeleteReview({ mutation: { onSuccess: invalidate } });

  if (isLoading || !reviews) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2">Reviews</h2>
        <p className="text-muted-foreground max-w-2xl">
          Curate the social proof that shows on the landing page. Paste comments from Facebook, Instagram, or Google. Toggle <span className="font-semibold">Featured</span> to control which appear on the site. Drag-style sort by setting the order number.
        </p>
      </div>

      <div className="rounded-md border border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-sm">
        <p className="font-semibold mb-1">Why is this manual?</p>
        <p className="text-muted-foreground">
          Facebook's API requires the page owner to authorize a developer app and pass Meta's app review — a 1–3 week process. Until that's set up, you (or staff) paste the best ones in here. It takes ~30 seconds per review and gives you full editorial control.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <ReviewRow
            key={r.id}
            item={r}
            onSave={(patch) => update.mutate({ id: r.id, data: { ...r, ...patch } })}
            onDelete={() => del.mutate({ id: r.id })}
          />
        ))}
        <Button
          variant="outline"
          className="w-full border-dashed h-14"
          onClick={() => create.mutate({ data: { authorName: "New reviewer", body: "Paste the review text here.", source: "facebook", featured: true, sortOrder: reviews.length } })}
        >
          <Plus size={16} className="mr-2" /> Add review
        </Button>
      </div>
    </div>
  );
}

function ReviewRow({ item, onSave, onDelete }: { item: Review; onSave: (p: Partial<Review>) => void; onDelete: () => void }) {
  const [authorName, setAuthorName] = useState(item.authorName);
  const [authorLocation, setAuthorLocation] = useState(item.authorLocation);
  const [body, setBody] = useState(item.body);
  const [source, setSource] = useState<Source>(item.source as Source);
  const [sourceUrl, setSourceUrl] = useState(item.sourceUrl);
  const [sortOrder, setSortOrder] = useState(item.sortOrder);

  useEffect(() => {
    setAuthorName(item.authorName);
    setAuthorLocation(item.authorLocation);
    setBody(item.body);
    setSource(item.source as Source);
    setSourceUrl(item.sourceUrl);
    setSortOrder(item.sortOrder);
  }, [item.id]);

  return (
    <Card className="relative group">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-destructive z-10" onClick={onDelete}>
        <Trash2 size={16} />
      </Button>
      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
            <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} onBlur={() => onSave({ authorName })} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Location</Label>
            <Input placeholder="Dryden, ON" value={authorLocation} onChange={(e) => setAuthorLocation(e.target.value)} onBlur={() => onSave({ authorLocation })} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Source</Label>
            <Select value={source} onValueChange={(v) => { setSource(v as Source); onSave({ source: v as Source }); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Review</Label>
          <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} onBlur={() => onSave({ body })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Source URL (optional)</Label>
            <Input placeholder="https://facebook.com/..." value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} onBlur={() => onSave({ sourceUrl })} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sort order</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} onBlur={() => onSave({ sortOrder })} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3">
            <Switch checked={item.featured} onCheckedChange={(v) => onSave({ featured: v })} />
            <Label className="font-bold">Featured on landing page</Label>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => onSave({ rating: i + 1 })}>
                <Star size={16} className={i < (item.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"} />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
