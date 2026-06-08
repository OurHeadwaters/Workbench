#!/usr/bin/env node
/**
 * generate-handbook.mjs
 *
 * Reads scripts/handbook-content.json and writes public/handbook-copy.html.
 * Run directly:  node scripts/generate-handbook.mjs
 * Run via npm:   pnpm --filter @workspace/print-marketing run generate-handbook
 *
 * Zone names, chunk titles, subtitles, and body text are all sourced from
 * handbook-content.json — change them there and re-run this script (or run
 * `build`) to keep the live page in sync automatically.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const source = JSON.parse(readFileSync(join(__dirname, 'handbook-content.json'), 'utf8'));
const { total, chunks } = source;

// ── helpers ──────────────────────────────────────────────────────────────────

function escapeJs(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// ── card HTML ────────────────────────────────────────────────────────────────

function renderCard(chunk, index) {
  const num = String(index + 1).padStart(2, '0');
  return `<div class="card" id="chunk-${chunk.id}">
  <div class="card-header">
    <div class="card-meta">
      <span class="chunk-num">${num} / ${String(total).padStart(2, '0')}</span>
      <h2>${chunk.title}</h2>
      <p class="sub">${chunk.sub}</p>
    </div>
    <button class="copy-btn" onclick="copyChunk('${chunk.id}')">Copy</button>
  </div>
  <textarea class="chunk-text" id="text-${chunk.id}" readonly rows="6" spellcheck="false"></textarea>
  <div class="char-count">${chunk.charInfo}</div>
</div>`;
}

// ── chunkData JS ─────────────────────────────────────────────────────────────

function renderChunkData(chunks) {
  return chunks
    .map(c => `chunkData["${c.id}"] = "${escapeJs(c.text)}";`)
    .join('\n');
}

// ── full HTML ────────────────────────────────────────────────────────────────

const cards = chunks.map((c, i) => renderCard(c, i)).join('\n\n');
const chunkJs = renderChunkData(chunks);
const totalStr = String(total).padStart(2, '0');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Codetry Handbook · Paste Chunks</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0e0e0f;
  --surface: #18181b;
  --border: #2a2a2e;
  --accent: #7c6fff;
  --accent-dim: #2d2b52;
  --green: #22c55e;
  --text: #e4e4e7;
  --muted: #71717a;
  --num: #52525b;
  --radius: 12px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}
html, body { min-height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); }
body { padding: 0 0 80px; }

.top-bar {
  position: sticky; top: 0; z-index: 10;
  background: rgba(14,14,15,0.92); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 16px 20px 14px;
}
.top-bar h1 { font-size: 15px; font-weight: 600; letter-spacing: 0.02em; }
.top-bar p { font-size: 12px; color: var(--muted); margin-top: 3px; }
.progress-bar { height: 3px; background: var(--border); margin-top: 12px; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.4s ease; width: 0%; }

.order-hint {
  margin: 20px 20px 4px;
  font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
}
.stack { display: flex; flex-direction: column; gap: 12px; padding: 0 16px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.25s;
}
.card.copied { border-color: var(--green); }

.card-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; padding: 16px 16px 12px;
}
.card-meta { flex: 1; min-width: 0; }
.chunk-num {
  display: inline-block;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
  color: var(--accent); text-transform: uppercase;
  background: var(--accent-dim); padding: 2px 8px; border-radius: 99px;
  margin-bottom: 6px;
}
.card-meta h2 { font-size: 14px; font-weight: 600; line-height: 1.35; }
.card-meta .sub { font-size: 11px; color: var(--muted); margin-top: 3px; line-height: 1.4; }

.copy-btn {
  flex-shrink: 0;
  background: var(--accent); color: #fff;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600;
  padding: 8px 18px; cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}
.copy-btn:active { transform: scale(0.95); }
.copy-btn.done { background: var(--green); }
.copy-btn.err { background: #ef4444; }

.chunk-text {
  display: block; width: 100%;
  background: #111113; color: var(--muted);
  border: none; border-top: 1px solid var(--border);
  padding: 12px 14px;
  font-family: var(--mono); font-size: 10.5px; line-height: 1.5;
  resize: vertical; outline: none;
}
.char-count {
  padding: 5px 14px 7px;
  font-size: 10px; color: var(--num); text-align: right;
}

.all-done {
  display: none; text-align: center;
  margin: 28px 20px 0;
  padding: 22px 20px;
  background: var(--surface); border: 1px solid var(--green);
  border-radius: var(--radius); color: var(--green);
  font-size: 14px; font-weight: 600; letter-spacing: 0.02em;
}
.all-done.show { display: block; }
</style>
</head>
<body>

<div class="top-bar">
  <h1>Codetry Handbook &mdash; Paste Chunks</h1>
  <p>Paste one chunk at a time into your AI. Work in order: 01 &rarr; ${totalStr}.</p>
  <div class="progress-bar"><div class="progress-fill" id="progress"></div></div>
</div>

<p class="order-hint">Paste in order &darr;</p>

<div class="stack">
${cards}
</div>

<div class="all-done" id="all-done">All ${total} chunks copied &mdash; handbook fully loaded in your AI session.</div>

<script>
var chunkData = {};
${chunkJs}

Object.keys(chunkData).forEach(function(k) {
  var el = document.getElementById("text-" + k);
  if (el) el.value = chunkData[k];
});

var copied = new Set();

function updateProgress() {
  var pct = (copied.size / ${total}) * 100;
  document.getElementById("progress").style.width = pct + "%";
  if (copied.size === ${total}) document.getElementById("all-done").classList.add("show");
}

function copyChunk(id) {
  var text = chunkData[id];
  var btn = document.querySelector("#chunk-" + id + " .copy-btn");
  var card = document.getElementById("chunk-" + id);
  if (!text || !btn) return;

  function finish(ok) {
    if (ok) {
      btn.textContent = "Copied!";
      btn.classList.add("done");
      card.classList.add("copied");
      copied.add(id);
      updateProgress();
      setTimeout(function() {
        btn.textContent = "Copy";
        btn.classList.remove("done");
      }, 2400);
    } else {
      btn.textContent = "Select All";
      btn.classList.add("err");
      var ta = document.getElementById("text-" + id);
      if (ta) { ta.select(); ta.focus(); }
      setTimeout(function() { btn.textContent = "Copy"; btn.classList.remove("err"); }, 3000);
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() { finish(true); }).catch(function() { fallback(); });
  } else { fallback(); }

  function fallback() {
    var ta = document.getElementById("text-" + id);
    if (!ta) { finish(false); return; }
    ta.select();
    try { var ok = document.execCommand("copy"); finish(ok); }
    catch(e) { finish(false); }
  }
}
</script>
</body>
</html>
`;

writeFileSync(join(root, 'public', 'handbook-copy.html'), html, 'utf8');
console.log(`handbook-copy.html generated (${chunks.length} chunks).`);
