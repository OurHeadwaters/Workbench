import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Trash2, Loader2, Upload, ImagePlus } from "lucide-react";
import {
  useListSnaps,
  getListSnapsQueryKey,
  useCreateSnap,
  useUpdateSnap,
  useDeleteSnap,
  type Snap,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Kind = "photo" | "review_screenshot";

const MAX_EDGE = 1400;

async function resizeImageToDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("image decode failed"));
    i.src = dataUrl;
  });
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas ctx");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function AdminSnaps() {
  const qc = useQueryClient();
  const { data: snaps, isLoading } = useListSnaps();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListSnapsQueryKey() });
  const create = useCreateSnap({ mutation: { onSuccess: invalidate } });
  const update = useUpdateSnap({ mutation: { onSuccess: invalidate } });
  const del = useDeleteSnap({ mutation: { onSuccess: invalidate } });

  const [pendingKind, setPendingKind] = useState<Kind>("photo");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoading || !snaps) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const imageData = await resizeImageToDataUrl(file);
        await create.mutateAsync({
          data: {
            kind: pendingKind,
            imageData,
            caption: "",
            featured: true,
            sortOrder: snaps?.length ?? 0,
          },
        });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><Camera /> Staff Room</h2>
        <p className="text-muted-foreground max-w-3xl">
          Snap a photo of a happy customer or a positive Facebook comment — it goes straight to the website. No editor, no developer, no email chain. Mark <span className="font-semibold">Featured</span> to show it on the landing page.
        </p>
      </div>

      <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">What's this snap?</Label>
              <Select value={pendingKind} onValueChange={(v) => setPendingKind(v as Kind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Happy customer / food shot</SelectItem>
                  <SelectItem value="review_screenshot">Screenshot of a Facebook review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Button
                size="lg"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="w-full md:w-auto"
              >
                {uploading ? <><Loader2 className="animate-spin mr-2" size={18} /> Uploading…</> : <><Upload className="mr-2" size={18} /> Snap & publish</>}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: from your phone, "Snap &amp; publish" opens the camera directly. Images are auto-resized — no need to worry about file size.
          </p>
        </CardContent>
      </Card>

      {snaps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-md">
          <ImagePlus className="mx-auto mb-3 opacity-40" size={48} />
          <p>No snaps yet. Use the panel above to upload the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {snaps.map((s) => (
            <SnapCard
              key={s.id}
              item={s}
              onSave={(patch) => update.mutate({ id: s.id, data: { ...s, ...patch } })}
              onDelete={() => del.mutate({ id: s.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SnapCard({ item, onSave, onDelete }: { item: Snap; onSave: (p: Partial<Snap>) => void; onDelete: () => void }) {
  const [caption, setCaption] = useState(item.caption);
  return (
    <Card className="overflow-hidden group relative">
      <div className="aspect-square bg-muted">
        <img src={item.imageData} alt={item.caption || "Staff snap"} className="w-full h-full object-cover" />
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
        onClick={onDelete}
      >
        <Trash2 size={16} />
      </Button>
      <CardContent className="p-4 space-y-3">
        <Input
          placeholder="Add a caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={() => caption !== item.caption && onSave({ caption })}
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {item.kind === "review_screenshot" ? "FB Review" : "Photo"}
          </span>
          <div className="flex items-center gap-2">
            <Switch checked={item.featured} onCheckedChange={(v) => onSave({ featured: v })} />
            <Label className="text-xs">Featured</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
