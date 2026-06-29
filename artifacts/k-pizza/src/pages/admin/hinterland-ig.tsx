import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Loader2, Upload, ImagePlus } from "lucide-react";
import {
  useListHinterlandIgGrid,
  getListHinterlandIgGridQueryKey,
  useUpdateHinterlandIgSlot,
  type HinterlandIgSlot,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

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

export default function AdminHinterlandIg() {
  const qc = useQueryClient();
  const { data: slots, isLoading } = useListHinterlandIgGrid();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListHinterlandIgGridQueryKey() });
  const updateSlot = useUpdateHinterlandIgSlot({ mutation: { onSuccess: invalidate } });

  if (isLoading || !slots) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-serif mb-2 flex items-center gap-3"><Instagram /> Instagram Grid</h2>
        <p className="text-muted-foreground max-w-3xl">
          These 6 photos appear in the Instagram section of the Hinterland website. Upload a new photo for any slot and update the alt text — changes go live immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {slots.map((slot) => (
          <SlotCard
            key={slot.slot}
            item={slot}
            onSave={(patch) =>
              updateSlot.mutate({ slot: slot.slot, data: { imageData: slot.imageData, alt: slot.alt, ...patch } })
            }
          />
        ))}
      </div>
    </div>
  );
}

function SlotCard({ item, onSave }: { item: HinterlandIgSlot; onSave: (p: Partial<{ imageData: string; alt: string }>) => void }) {
  const [alt, setAlt] = useState(item.alt);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAlt(item.alt);
  }, [item.alt]);

  async function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const imageData = await resizeImageToDataUrl(files[0]);
      onSave({ imageData });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-muted relative">
        {item.imageData ? (
          <img src={item.imageData} alt={alt || "Instagram grid photo"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ImagePlus size={36} className="opacity-30" />
            <p className="text-xs opacity-50">Slot {item.slot + 1} — no photo yet</p>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Alt text</Label>
          <Input
            placeholder="Describe the photo…"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={() => alt !== item.alt && onSave({ alt })}
          />
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full"
          >
            {uploading
              ? <><Loader2 className="animate-spin mr-2" size={14} /> Uploading…</>
              : <><Upload className="mr-2" size={14} /> {item.imageData ? "Replace photo" : "Upload photo"}</>
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
