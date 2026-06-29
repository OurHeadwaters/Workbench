import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { downloadAsPdf, type PaperFormat } from "@/lib/pdf";
import { usePreview } from "@/context/PreviewContext";

interface Section {
  label: string;
  getText: () => string;
}

interface PrintNavProps {
  targetId: string;
  filename: string;
  format?: PaperFormat;
  orientation?: "portrait" | "landscape";
  paginate?: boolean;
  pdfApiPath?: string;
  onCopyPlainText?: () => string;
  sections?: Section[];
}

export function PrintNav({
  targetId,
  filename,
  format = "letter",
  orientation = "portrait",
  paginate = false,
  pdfApiPath,
  onCopyPlainText,
  sections,
}: PrintNavProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedInModal, setCopiedInModal] = useState(false);
  const [overflowCount, setOverflowCount] = useState(0);
  const { previewing, setPreviewing } = usePreview();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!previewing) {
      setOverflowCount(0);
      return;
    }
    function checkOverflow() {
      const pages = document.querySelectorAll<HTMLElement>(".page-letter, .page-letter-landscape");
      let count = 0;
      pages.forEach((page) => {
        if (page.scrollHeight > page.clientHeight + 2) count++;
      });
      setOverflowCount(count);
    }
    checkOverflow();
    const resizeObs = new ResizeObserver(checkOverflow);
    document.querySelectorAll<HTMLElement>(".page-letter, .page-letter-landscape").forEach((p) => resizeObs.observe(p));
    const mutationObs = new MutationObserver(checkOverflow);
    mutationObs.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => {
      resizeObs.disconnect();
      mutationObs.disconnect();
    };
  }, [previewing]);

  function closeModal() {
    setPreviewText(null);
    setActiveSection(null);
    setCopiedSection(null);
    setCopiedInModal(false);
  }

  useEffect(() => {
    if (previewText === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [previewText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
    }
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
      await downloadAsPdf(targetId, filename, { format, orientation, paginate });
    } finally {
      setLoading(false);
    }
  }

  function handleCopyPlain() {
    if (!onCopyPlainText) return;
    const text = onCopyPlainText();
    setCopiedInModal(false);
    setCopiedSection(null);
    setActiveSection(sections && sections.length > 0 ? sections[sections.length - 1].label : null);
    setPreviewText(text);
    setOriginalText(text);
  }

  function handleReset() {
    if (originalText !== null) setPreviewText(originalText);
    setCopiedInModal(false);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSectionClick(section: Section) {
    const text = section.getText();
    setActiveSection(section.label);
    setPreviewText(text);
    setOriginalText(text);
    setCopiedInModal(false);
    const ok = await copyText(text);
    if (ok) {
      setCopiedSection(section.label);
      setTimeout(() => setCopiedSection(null), 1800);
    } else {
      prompt(`Copy this text to paste into the submission portal (${section.label}):`, text);
    }
  }

  async function handleModalCopy() {
    if (previewText === null) return;
    const ok = await copyText(previewText);
    if (ok) {
      setCopiedInModal(true);
      setCopiedPlain(true);
      setTimeout(() => {
        setCopiedPlain(false);
        closeModal();
      }, 1800);
    } else {
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

  const hasSections = sections && sections.length > 0;

  return (
    <>
    {previewText !== null && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Plain text preview"
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
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
          {/* Modal header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem 0.6rem",
            borderBottom: hasSections ? "none" : "1px solid rgba(31,61,46,0.12)",
            background: "var(--evergreen, #1f3d2e)",
          }}>
            <span style={{
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--cream, #f4ede0)",
            }}>
              Plain text — paste into the TSP portal
            </span>
            <button
              onClick={() => closeModal()}
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

          {/* Section buttons */}
          {hasSections && (
            <div style={{
              display: "flex",
              gap: "0.35rem",
              padding: "0.5rem 1rem",
              background: "var(--evergreen, #1f3d2e)",
              borderBottom: "1px solid rgba(31,61,46,0.22)",
              flexWrap: "wrap",
            }}>
              {sections.map((s) => {
                const isActive = activeSection === s.label;
                const wasCopied = copiedSection === s.label;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSectionClick(s)}
                    aria-pressed={isActive}
                    style={{
                      background: isActive
                        ? "var(--rust, #b0391e)"
                        : "rgba(244,237,224,0.12)",
                      color: "var(--cream, #f4ede0)",
                      border: isActive
                        ? "1px solid var(--rust, #b0391e)"
                        : "1px solid rgba(244,237,224,0.28)",
                      borderRadius: 4,
                      padding: "0.22rem 0.7rem",
                      fontSize: "0.76rem",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans, sans-serif)",
                      transition: "background 0.15s, border-color 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {wasCopied ? `✓ Copied` : s.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
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

          {/* Modal footer */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.6rem",
            padding: "0.65rem 1rem",
            borderTop: "1px solid rgba(31,61,46,0.12)",
            background: "rgba(31,61,46,0.04)",
          }}>
            <button
              onClick={() => closeModal()}
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
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link href="/" className="no-print">← Back to suite</Link>
          <Link
            href="/ecosystem-guide"
            className="no-print"
            style={{
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.75)",
              textDecoration: "none",
            }}
          >
            → Ecosystem Guide
          </Link>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            className={`btn-preview${previewing ? " btn-preview--active" : ""}`}
            onClick={() => setPreviewing(!previewing)}
            aria-pressed={previewing}
          >
            {previewing ? "✕ Exit preview" : "🖨 Preview print layout"}
          </button>
          {previewing && overflowCount > 0 && (
            <span
              title={`${overflowCount} page${overflowCount > 1 ? "s have" : " has"} content that overflows the letter boundary and will be clipped when printed.`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                background: "#7a2e0e",
                color: "#fef3c7",
                borderRadius: 4,
                padding: "0.22rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "var(--font-sans, sans-serif)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              ⚠ {overflowCount} page{overflowCount > 1 ? "s" : ""} overflow
            </span>
          )}
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
