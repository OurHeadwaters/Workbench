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
  const { previewing, setPreviewing } = usePreview();

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

  return (
    <div className="screen-nav">
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
  );
}
