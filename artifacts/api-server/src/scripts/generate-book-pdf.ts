/**
 * Generates the customer-facing, download-only PDF edition of the Headwaters book.
 * Run with:
 *   pnpm exec tsx artifacts/api-server/src/scripts/generate-book-pdf.ts
 */

import { execSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const workspaceRoot = process.cwd();
const manuscriptPath = path.join(workspaceRoot, "exports/codetry-book-full.md");
const coverPath = path.join(
  workspaceRoot,
  "artifacts/north-star/public/headwaters-book-cover-art.png",
);
const outputPath = path.join(
  workspaceRoot,
  "artifacts/api-server/public/digital/headwaters-how-a-community-runs-its-own-economy.pdf",
);

function chromiumPath(): string {
  const result = execSync(
    "which chromium || which chromium-browser || which google-chrome",
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")[0];

  if (!result) throw new Error("Chromium is required to generate the book PDF.");
  return result;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let quote: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listItems.length > 0) {
      html.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
  };
  const flushQuote = () => {
    if (quote.length > 0) {
      html.push(`<blockquote>${inlineMarkdown(quote.join(" "))}</blockquote>`);
      quote = [];
    }
  };
  const flushCode = () => {
    if (codeLines.length > 0) {
      html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      codeLines = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const [index, line] of lines.entries()) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushAll();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (index === 0 && line.startsWith("# ")) continue;
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      flushAll();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushAll();
      html.push("<hr />");
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quote.push(line.slice(2));
      continue;
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      listItems.push(line.replace(/^\s*[-*+]\s+/, ""));
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      listItems.push(line.replace(/^\s*\d+\.\s+/, ""));
      continue;
    }
    if (line.trim() === "") {
      flushAll();
      continue;
    }
    flushList();
    flushQuote();
    paragraph.push(line.trim());
  }

  flushAll();
  if (inCodeBlock) flushCode();
  return html.join("\n");
}

async function main(): Promise<void> {
  const [manuscript, cover] = await Promise.all([
    readFile(manuscriptPath, "utf8"),
    readFile(coverPath),
  ]);
  const coverDataUrl = `data:image/png;base64,${cover.toString("base64")}`;
  const body = renderMarkdown(manuscript);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Headwaters: How a Community Runs Its Own Economy</title>
    <style>
      @page { size: Letter; margin: 18mm 18mm 20mm; }
      @page :first { margin: 0; }
      * { box-sizing: border-box; }
      body { color: #1b1a16; font-family: Georgia, "Times New Roman", serif; font-size: 10.8pt; line-height: 1.62; margin: 0; }
      .cover { align-items: flex-start; background: linear-gradient(180deg, rgba(9,9,6,.06), rgba(9,9,6,.68)), url("${coverDataUrl}") center/cover no-repeat; color: #fffdf4; display: flex; flex-direction: column; height: 11in; justify-content: flex-end; padding: 0.78in; page-break-after: always; }
      .cover__eyebrow { border-top: 1px solid rgba(255,255,255,.7); font-family: Arial, sans-serif; font-size: 9pt; letter-spacing: .18em; margin: 0 0 .3in; padding-top: .14in; text-transform: uppercase; width: 100%; }
      .cover h1 { color: #fffdf4; font-size: 38pt; font-weight: 400; letter-spacing: -.035em; line-height: 1.02; margin: 0; max-width: 6in; }
      .cover__subtitle { font-family: Arial, sans-serif; font-size: 14pt; letter-spacing: .02em; line-height: 1.45; margin: .32in 0 0; max-width: 4.5in; }
      main { padding: 0; }
      h2, h3, h4, h5 { color: #25251e; font-weight: 400; line-height: 1.15; page-break-after: avoid; }
      h2 { border-top: 2px solid #988148; font-size: 24pt; margin: .65in 0 .24in; padding-top: .16in; }
      h3 { color: #4d442a; font-size: 17pt; margin: .42in 0 .16in; }
      h4 { color: #665a37; font-size: 13pt; margin: .32in 0 .11in; }
      h5 { color: #665a37; font-family: Arial, sans-serif; font-size: 10pt; font-weight: 700; letter-spacing: .05em; margin: .25in 0 .08in; text-transform: uppercase; }
      p { margin: 0 0 .14in; orphans: 3; widows: 3; }
      ul { margin: 0 0 .18in; padding-left: .28in; }
      li { margin-bottom: .07in; }
      blockquote { border-left: 3px solid #a99358; color: #383426; font-size: 12pt; font-style: italic; line-height: 1.55; margin: .25in .08in .28in; padding: .02in .18in; page-break-inside: avoid; }
      code { background: #f0eee5; border-radius: 2px; font-family: "SFMono-Regular", Consolas, monospace; font-size: .86em; padding: .08em .22em; }
      pre { background: #f0eee5; overflow-wrap: anywhere; padding: .16in; white-space: pre-wrap; }
      hr { border: 0; border-top: 1px solid #cfc7af; margin: .32in 0; }
    </style>
  </head>
  <body>
    <section class="cover">
      <p class="cover__eyebrow">Headwaters · Digital Edition</p>
      <h1>How a Community Runs Its Own Economy</h1>
      <p class="cover__subtitle">A field guide to the words, relationships, and practices that keep community work rooted in the people who own it.</p>
    </section>
    <main>${body}</main>
  </body>
</html>`;

  await mkdir(path.dirname(outputPath), { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: chromiumPath(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 90_000 });
    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: false,
    });
    await writeFile(outputPath, pdf);
  } finally {
    await browser.close();
  }

  process.stdout.write(`Created ${outputPath}\n`);
}

await main();