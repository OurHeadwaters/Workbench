import { Link } from "wouter";
import { useState, useEffect } from "react";
import { downloadAsPdf, type PaperFormat } from "@/lib/pdf";

interface PrintNavProps {
  targetId: string;
  filename: string;
  format?: PaperFormat;
  orientation?: "portrait" | "landscape";
}

export function PrintNav({
  targetId,
  filename,
  format = "letter",
  orientation = "portrait",
}: PrintNavProps) {
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    if (previewing) {
      document.body.classList.add("print-preview");
    } else {
      document.body.classList.remove("print-preview");
    }
    return () => {
      document.body.classList.remove("print-preview");
    };
  }, [previewing]);

  async function handlePdf() {
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
          onClick={() => setPreviewing((v) => !v)}
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
