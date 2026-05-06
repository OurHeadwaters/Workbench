import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export type PaperFormat = "letter" | "tabloid" | [number, number];

export interface PdfOptions {
  format?: PaperFormat;
  orientation?: "portrait" | "landscape";
}

export async function downloadAsPdf(
  elementId: string,
  filename: string,
  options: PdfOptions = {},
): Promise<void> {
  const { format = "letter", orientation = "portrait" } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`pdf-target element #${elementId} not found`);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation,
    unit: "in",
    format: Array.isArray(format) ? format : format,
  });

  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
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
  pdf.save(filename);
}
