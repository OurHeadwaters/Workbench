import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = path.join(projectRoot, 'public', 'fonts');
const sourceDir = path.join(projectRoot, 'src');

// Keep enough room for small metadata changes without allowing a major payload regression.
const FONT_PAYLOAD_BUDGET_BYTES = 325 * 1024;

const EXPECTED_FONT_FILES = [
  'crimson-pro-400-italic.woff2',
  'crimson-pro-400.woff2',
  'crimson-pro-600.woff2',
  'crimson-pro-700.woff2',
  'playfair-display-400-italic.woff2',
  'playfair-display-400.woff2',
  'playfair-display-600.woff2',
  'playfair-display-700.woff2',
];

async function findCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findCssFiles(entryPath);
      return entry.isFile() && entry.name.endsWith('.css') ? [entryPath] : [];
    }),
  );
  return files.flat();
}

const errors = [];
const fontEntries = await readdir(fontsDir, { withFileTypes: true });
const fontFiles = fontEntries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();

const heavyFontFiles = fontFiles.filter((name) => /\.(?:ttf|otf)$/i.test(name));
if (heavyFontFiles.length > 0) {
  errors.push(`TTF/OTF files are not allowed in public/fonts: ${heavyFontFiles.join(', ')}`);
}

const localFontFiles = fontFiles.filter((name) => /\.(?:woff2?|ttf|otf)$/i.test(name));
const missingFonts = EXPECTED_FONT_FILES.filter((name) => !localFontFiles.includes(name));
const unexpectedFonts = localFontFiles.filter((name) => !EXPECTED_FONT_FILES.includes(name));
if (missingFonts.length > 0) {
  errors.push(`Required local font variants are missing: ${missingFonts.join(', ')}`);
}
if (unexpectedFonts.length > 0) {
  errors.push(`Unexpected local font variants found: ${unexpectedFonts.join(', ')}`);
}

const totalFontBytes = (
  await Promise.all(localFontFiles.map(async (name) => (await stat(path.join(fontsDir, name))).size))
).reduce((total, size) => total + size, 0);
if (totalFontBytes > FONT_PAYLOAD_BUDGET_BYTES) {
  errors.push(
    `Local fonts total ${totalFontBytes.toLocaleString()} bytes, exceeding the documented ` +
      `${FONT_PAYLOAD_BUDGET_BYTES.toLocaleString()}-byte (325 KiB) budget.`,
  );
}

const cssFiles = await findCssFiles(sourceDir);
for (const cssFile of cssFiles) {
  const css = await readFile(cssFile, 'utf8');
  const remoteUrls = css.match(/(?:https?:)?\/\/[^\s"'()]+/gi) ?? [];
  if (remoteUrls.length > 0) {
    errors.push(
      `${path.relative(projectRoot, cssFile)} references remote URL(s); fonts must remain local: ` +
        remoteUrls.join(', '),
    );
  }
}

if (errors.length > 0) {
  console.error(`Font release check failed:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(
    `Font release check passed: ${EXPECTED_FONT_FILES.length} WOFF2 variants, ` +
      `${totalFontBytes.toLocaleString()} / ${FONT_PAYLOAD_BUDGET_BYTES.toLocaleString()} bytes.`,
  );
}