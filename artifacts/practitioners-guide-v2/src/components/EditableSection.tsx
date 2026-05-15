/**
 * EditableSection — wraps any narrative text block with an AI rewrite button.
 *
 * Usage:
 *   <EditableSection id="contracts.how-it-works" label="How the contract works">
 *     <p>Original hardcoded text...</p>
 *   </EditableSection>
 *
 * When an override exists it renders instead of children. The override is
 * persisted to localStorage so it survives page reloads.
 *
 * The pencil button appears on hover. Clicking it opens a modal where the
 * founder describes what changed; the AI rewrites the section in-place.
 *
 * A flag button also appears on hover. Flagged sections show an amber badge
 * so stale content can be tracked from the dashboard.
 */

import { useState, useRef, type ReactNode } from "react";
import { Pencil, X, Loader2, RotateCcw, Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSectionOverride } from "@/hooks/useSectionOverride";
import { useSectionFlag } from "@/hooks/useSectionFlag";
import { Label } from "@/components/ui/label";

interface EditableSectionProps {
  id: string;
  label: string;
  children: ReactNode;
}

export function EditableSection({ id, label, children }: EditableSectionProps) {
  const { override, setOverride, clearOverride } = useSectionOverride(id);
  const { flagged, setFlagged, clearFlag } = useSectionFlag(id, label);
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagNote, setFlagNote] = useState("");

  function currentText(): string {
    if (override) return override;
    const el = document.getElementById(`editable-section-content-${id}`);
    return el?.innerText ?? label;
  }

  async function handleRewrite() {
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const res = await fetch("/api/pgv2/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: id,
          currentText: currentText(),
          instruction,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { rewritten: string };
      setPreview(data.rewritten);
    } catch {
      setError("Rewrite failed — try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (preview) {
      setOverride(preview);
      setOpen(false);
      setInstruction("");
      setPreview(null);
    }
  }

  function handleClose() {
    setOpen(false);
    setInstruction("");
    setPreview(null);
    setError(null);
  }

  return (
    <div className="group relative">
      <div id={`editable-section-content-${id}`}>
        {override
          ? override
              .split("\n\n")
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-2 last:mb-0">
                  {para}
                </p>
              ))
          : children}
      </div>

      <div className="absolute top-0 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {override && (
          <button
            onClick={clearOverride}
            title="Restore original"
            className="p-1 rounded text-muted-foreground hover:text-rust hover:bg-cream transition-colors"
            style={{ color: "#b85a3e" }}
          >
            <RotateCcw size={12} />
          </button>
        )}
        <button
          onClick={() => {
            if (flagged) {
              clearFlag();
            } else {
              setFlagNote("");
              setFlagDialogOpen(true);
            }
          }}
          title={flagged ? "Remove outdated flag" : "Flag as outdated"}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors"
          style={{
            background: flagged ? "#d9770622" : "#78350f11",
            color: flagged ? "#d97706" : "#78350f",
          }}
        >
          <Flag size={11} fill={flagged ? "#d97706" : "none"} />
        </button>
        <button
          onClick={() => setOpen(true)}
          title="Edit with AI"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors"
          style={{
            background: override ? "#b85a3e22" : "#1f3d2e22",
            color: override ? "#b85a3e" : "#1f3d2e",
          }}
        >
          <Pencil size={11} />
          {override ? "Re-edit" : "Edit"}
        </button>
      </div>

      {(override || flagged) && (
        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          {override && (
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: "#1f3d2e22", color: "#1f3d2e" }}
            >
              Edited
            </span>
          )}
          {flagged && (
            <span
              className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
            >
              <Flag size={10} fill="#d97706" className="text-amber-600" />
              Outdated
            </span>
          )}
        </div>
      )}

      <Dialog open={flagDialogOpen} onOpenChange={(v) => { if (!v) { setFlagDialogOpen(false); setFlagNote(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold" style={{ color: "#92400e" }}>
              Flag as outdated
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor={`flag-note-${id}`} className="text-xs text-muted-foreground">
                Why is this stale? <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Textarea
                id={`flag-note-${id}`}
                value={flagNote}
                onChange={(e) => setFlagNote(e.target.value)}
                placeholder='e.g. "Rate changed to $185/hr"'
                rows={2}
                className="text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    setFlagged(flagNote);
                    setFlagDialogOpen(false);
                    setFlagNote("");
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setFlagDialogOpen(false); setFlagNote(""); }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setFlagged(flagNote);
                  setFlagDialogOpen(false);
                  setFlagNote("");
                }}
                style={{ background: "#d97706", color: "#fff" }}
              >
                <Flag size={12} className="mr-1.5" />
                Flag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold" style={{ color: "#1f3d2e" }}>
              Edit: {label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {!preview ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Describe what changed — the AI will rewrite the section for you.
                  </p>
                  <Textarea
                    ref={textareaRef}
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={'e.g. \u201cThe Northern Band contract is now signed as of June 1 at $185/hr instead of $175.\u201d'}
                    rows={3}
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && instruction.trim()) {
                        void handleRewrite();
                      }
                    }}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!instruction.trim() || loading}
                    onClick={() => void handleRewrite()}
                    style={{ background: "#1f3d2e", color: "#f4ede0" }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={13} className="animate-spin mr-1.5" />
                        Rewriting…
                      </>
                    ) : (
                      "Rewrite with AI"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Preview</p>
                  <div
                    className="rounded-md p-3 text-sm space-y-2 border"
                    style={{ background: "#f4ede0", borderColor: "#1f3d2e33" }}
                  >
                    {preview.split("\n\n").filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreview(null)}
                  >
                    <X size={13} className="mr-1" /> Try again
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApply}
                      style={{ background: "#1f3d2e", color: "#f4ede0" }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
