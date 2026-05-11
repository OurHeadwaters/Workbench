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

async function renderPageToPdf(
  pdf: jsPDF,
  el: HTMLElement,
  pdfW: number,
  pdfH: number,
) {
  const canvas = await html2canvas(el, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: null,
    windowWidth: el.offsetWidth,
    windowHeight: el.offsetHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgRatio = canvas.width / canvas.height;

  let drawW = pdfW;
  let drawH = pdfW / imgRatio;
  if (drawH > pdfH) {
    drawH = pdfH;
    drawW = pdfH * imgRatio;
  }

  const x = (pdfW - drawW) / 2;
  const y = (pdfH - drawH) / 2;
  pdf.addImage(imgData, "PNG", x, y, drawW, drawH);
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
    const pages = Array.from(element.children) as HTMLElement[];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      await renderPageToPdf(pdf, pages[i], pdfW, pdfH);
    }
  } else {
    await renderPageToPdf(pdf, element, pdfW, pdfH);
  }

  pdf.save(filename);
}
