import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// DEFAULT PRINT SIZE: 8.5 × 11 in (letter).
// All programmatic PDF exports use "letter" (8.5 × 11 in) by default.
// Pass a custom format only for pieces that explicitly require a different size
// (e.g. the 4 × 9 rack card).

export type PaperFormat = "letter" | "tabloid" | [number, number];

export interface PdfOptions {
  format?: PaperFormat;
  orientation?: "portrait" | "landscape";
  paginate?: boolean;
}

// Resolves the element to capture:
// - If the element itself carries .page-letter or .page-letter-landscape, use it directly.
// - Otherwise, find the first such descendant.
// - If neither, fall back to the element itself.
function findPageElement(el: HTMLElement): HTMLElement {
  if (
    el.classList.contains("page-letter") ||
    el.classList.contains("page-letter-landscape")
  ) {
    return el;
  }
  const child = el.querySelector(
    ".page-letter, .page-letter-landscape"
  ) as HTMLElement | null;
  return child ?? el;
}

async function renderPageToPdf(
  pdf: jsPDF,
  el: HTMLElement,
  pdfW: number,
  pdfH: number,
): Promise<void> {
  // Always capture just the .page-letter element — not a wrapper div with
  // surrounding chrome, padding, or grey backgrounds.
  const pageEl = findPageElement(el);

  const canvas = await html2canvas(pageEl, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: null,
    // Use the element's own dimensions as the simulated viewport so layout
    // is computed at print-page width (816 px for 8.5 in at 96 dpi), not
    // the browser window width.
    windowWidth: pageEl.scrollWidth,
    windowHeight: pageEl.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");

  // Draw edge-to-edge — fills the full PDF page with no padding, no centering,
  // and no letterboxing. Header/footer bands that extend to the element edge
  // therefore extend to the PDF edge, which is equivalent to full bleed.
  pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
}

export async function downloadAsPdf(
  elementId: string,
  filename: string,
  options: PdfOptions = {},
): Promise<void> {
  const { format = "letter", orientation = "portrait", paginate = false } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`pdf-target element #${elementId} not found`);
    return;
  }

  const pdf = new jsPDF({
    orientation,
    unit: "in",
    format: Array.isArray(format) ? format : format,
  });

  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  if (paginate) {
    // Each direct child of the target is treated as one PDF page.
    // findPageElement inside renderPageToPdf resolves to the .page-letter
    // div within each child (or the child itself if it already is one).
    const pages = Array.from(element.children) as HTMLElement[];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      await renderPageToPdf(pdf, pages[i], pdfW, pdfH);
    }
  } else {
    // Single-page download — capture just the .page-letter descendant so
    // the surrounding grey wrapper div is never included in the output.
    await renderPageToPdf(pdf, element, pdfW, pdfH);
  }

  pdf.save(filename);
}
