import { Link } from "wouter";
import { useState } from "react";
import { downloadAsPdf, type PaperFormat } from "@/lib/pdf";
import { usePreview } from "@/context/PreviewContext";

interface PrintNavProps {
  targetId: string;
  filename: string;
  format?: PaperFormat;
  orientation?: "portrait" | "landscape";
  pdfApiPath?: string;
}

export function PrintNav({
  targetId,
  filename,
  format = "letter",
  orientation = "portrait",
  pdfApiPath,
}: PrintNavProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { previewing, setPreviewing } = usePreview();

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
  );
}
