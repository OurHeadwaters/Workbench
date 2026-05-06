import { Link } from "wouter";
import { useState } from "react";
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

  async function handlePdf() {
    setLoading(true);
    try {
      await downloadAsPdf(targetId, filename, { format, orientation });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="no-print screen-nav">
      <Link href="/">← Back to suite</Link>
      <button className="btn-print" onClick={handlePdf} disabled={loading}>
        {loading ? "⏳ Generating PDF…" : "⬇ Download PDF"}
      </button>
    </div>
  );
}
