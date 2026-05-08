import { Link } from "wouter";
import { useState, useEffect } from "react";
import { downloadAsPdf, type PaperFormat } from "@/lib/pdf";
import { usePreview } from "@/context/PreviewContext";

interface PrintNavProps {
  targetId: string;
  filename: string;
  format?: PaperFormat;
  orientation?: "portrait" | "landscape";
  pdfApiPath?: string;
  onCopyPlainText?: () => string;
}

export function PrintNav({
  targetId,
  filename,
  format = "letter",
  orientation = "portrait",
  pdfApiPath,
  onCopyPlainText,
}: PrintNavProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [copiedInModal, setCopiedInModal] = useState(false);
  const { previewing, setPreviewing } = usePreview();

  useEffect(() => {
    if (previewText === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewText(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [previewText]);

  const directUrl = pdfApiPath
    ? `${window.location.origin}${pdfApiPath}`
    : null;

  async function handlePdf() {
    if (pdfApiPath) {
      setLoading(true);
      try {
        const response = await fetch(pdfApiPath);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("PDF download failed:", err);
        alert("PDF generation failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await downloadAsPdf(targetId, filename, { format, orientation });
    } finally {
      setLoading(false);
    }
  }

  function handleCopyPlain() {
    if (!onCopyPlainText) return;
    const text = onCopyPlainText();
    setCopiedInModal(false);
    setPreviewText(text);
    setOriginalText(text);
  }

  function handleReset() {
    if (originalText !== null) setPreviewText(originalText);
    setCopiedInModal(false);
  }

  async function handleModalCopy() {
    if (previewText === null) return;
    try {
      await navigator.clipboard.writeText(previewText);
      setCopiedInModal(true);
      setCopiedPlain(true);
      setTimeout(() => {
        setCopiedPlain(false);
        setPreviewText(null);
        setCopiedInModal(false);
      }, 1800);
    } catch {
      prompt("Copy this text to paste into the submission portal:", previewText);
    }
  }

  async function handleCopyLink() {
    if (!directUrl) return;
    try {
      await navigator.clipboard.writeText(directUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("Copy this link to share the PDF directly:", directUrl);
    }
  }

  return (
    <>
    {previewText !== null && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Plain text preview"
        onClick={(e) => { if (e.target === e.currentTarget) setPreviewText(null); }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            background: "var(--cream, #f4ede0)",
            borderRadius: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            width: "min(680px, 100%)",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid rgba(31,61,46,0.18)",
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem 0.6rem",
            borderBottom: "1px solid rgba(31,61,46,0.12)",
            background: "var(--evergreen, #1f3d2e)",
          }}>
            <span style={{
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--cream, #f4ede0)",
            }}>
              Plain text preview — paste into the TSP portal
            </span>
            <button
              onClick={() => setPreviewText(null)}
              aria-label="Close preview"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(244,237,224,0.7)",
                fontSize: "1.1rem",
                cursor: "pointer",
                lineHeight: 1,
                padding: "0.1rem 0.2rem",
              }}
            >
              ✕
            </button>
          </div>
          <textarea
            value={previewText}
            onChange={(e) => { setPreviewText(e.target.value); setCopiedInModal(false); }}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              padding: "0.9rem 1rem",
              fontFamily: "var(--font-mono, 'Courier New', monospace)",
              fontSize: "0.72rem",
              lineHeight: 1.65,
              color: "var(--ink, #1a1a1a)",
              background: "var(--cream, #f4ede0)",
              overflowY: "auto",
              minHeight: "200px",
            }}
          />
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.6rem",
            padding: "0.65rem 1rem",
            borderTop: "1px solid rgba(31,61,46,0.12)",
            background: "rgba(31,61,46,0.04)",
          }}>
            <button
              onClick={() => setPreviewText(null)}
              style={{
                background: "transparent",
                color: "var(--muted, #666)",
                border: "1px solid rgba(31,61,46,0.25)",
                borderRadius: 4,
                padding: "0.32rem 0.9rem",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              Dismiss
            </button>
            <button
              onClick={handleReset}
              disabled={previewText === originalText}
              style={{
                background: "transparent",
                color: "var(--evergreen, #1f3d2e)",
                border: "1px solid var(--evergreen, #1f3d2e)",
                borderRadius: 4,
                padding: "0.32rem 0.9rem",
                fontSize: "0.8rem",
                cursor: previewText === originalText ? "default" : "pointer",
                fontFamily: "var(--font-sans, sans-serif)",
                opacity: previewText === originalText ? 0.4 : 1,
                transition: "opacity 0.15s",
              }}
            >
              Reset
            </button>
            <button
              onClick={handleModalCopy}
              style={{
                background: copiedInModal ? "var(--rust, #b0391e)" : "var(--evergreen, #1f3d2e)",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "0.32rem 1.1rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans, sans-serif)",
                transition: "background 0.15s",
              }}
            >
              {copiedInModal ? "✓ Copied!" : "📋 Copy to clipboard"}
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="screen-nav" style={{ flexDirection: "column", gap: "0.5rem", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" className="no-print">← Back to suite</Link>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            className={`btn-preview${previewing ? " btn-preview--active" : ""}`}
            onClick={() => setPreviewing(!previewing)}
            aria-pressed={previewing}
          >
            {previewing ? "✕ Exit preview" : "🖨 Preview print layout"}
          </button>
          {onCopyPlainText && (
            <button
              className="no-print"
              onClick={handleCopyPlain}
              style={{
                background: copiedPlain ? "var(--evergreen, #1f3d2e)" : "transparent",
                color: copiedPlain ? "white" : "var(--evergreen, #1f3d2e)",
                border: "1px solid var(--evergreen, #1f3d2e)",
                borderRadius: 4,
                padding: "0.28rem 0.75rem",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "var(--font-sans, sans-serif)",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {copiedPlain ? "✓ Copied plain text" : "📋 Copy plain text"}
            </button>
          )}
          <button className="btn-print no-print" onClick={handlePdf} disabled={loading}>
            {loading ? "⏳ Generating PDF…" : "⬇ Download PDF"}
          </button>
        </div>
      </div>
      {directUrl && (
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(31,61,46,0.06)",
            border: "1px solid rgba(31,61,46,0.14)",
            borderRadius: 6,
            padding: "0.38rem 0.7rem",
            fontSize: "0.78rem",
            fontFamily: "var(--font-sans, monospace)",
          }}
        >
          <span style={{ color: "var(--muted, #666)", whiteSpace: "nowrap", flexShrink: 0 }}>
            Direct link:
          </span>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--evergreen, #1f3d2e)",
              textDecoration: "underline",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              minWidth: 0,
            }}
          >
            {directUrl}
          </a>
          <button
            onClick={handleCopyLink}
            style={{
              flexShrink: 0,
              background: copied ? "var(--evergreen, #1f3d2e)" : "transparent",
              color: copied ? "white" : "var(--evergreen, #1f3d2e)",
              border: "1px solid var(--evergreen, #1f3d2e)",
              borderRadius: 4,
              padding: "0.18rem 0.55rem",
              fontSize: "0.72rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans, sans-serif)",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
    </>
  );
}
