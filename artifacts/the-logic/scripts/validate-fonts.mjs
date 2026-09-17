import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(process.env.FONT_VALIDATOR_PROJECT_ROOT ?? resolve(import.meta.dirname, '..'));
const distRoot = join(projectRoot, 'dist');
const sourceOnly = process.argv.includes('--source-only');
const textExtensions = new Set(['.css', '.html', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const ignoredDirectories = new Set(['dist', 'node_modules', '.git']);
const externalFontPatterns = [
  {
    label: 'external font stylesheet',
    pattern: /<link\b(?=[^>]*\brel\s*=\s*["'][^"']*\bstylesheet\b[^"']*["'])[^>]*\bhref\s*=\s*["'](?:https?:)?\/\/[^"']+["'][^>]*>|@import\s+(?:url\(\s*)?["']?(?:https?:)?\/\/[^"'()\s]+/gi,
  },
];

function walk(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      return ignoredDirectories.has(name) ? [] : walk(path);
    }
    return textExtensions.has(extname(name)) ? [path] : [];
  });
}

function findExternalFontReferences(files) {
  const failures = [];
  for (const file of files) {
    const contents = readFileSync(file, 'utf8');
    for (const { label, pattern } of externalFontPatterns) {
      pattern.lastIndex = 0;
      for (const match of contents.matchAll(pattern)) {
        failures.push(`${file.slice(projectRoot.length + 1)}: ${label}: ${match[0]}`);
      }
    }
    const fontFaceBlocks = contents.match(/@font-face\s*\{[^}]*\}/gi) ?? [];
    for (const block of fontFaceBlocks) {
      for (const match of block.matchAll(/url\(\s*(['"]?)((?:https?:)?\/\/[^'")\s]+)\1\s*\)/gi)) {
        failures.push(
          `${file.slice(projectRoot.length + 1)}: external font URL in @font-face: ${match[2]}`,
        );
      }
    }
  }
  return failures;
}

function findBuiltFontAssets() {
  const failures = [];
  const cssFiles = walk(distRoot).filter((file) => extname(file) === '.css');
  const builtIndexFiles = walkAll(distRoot).filter((file) => file.endsWith('/index.html'));

  if (builtIndexFiles.length !== 1) {
    failures.push(`dist: expected exactly one built index.html, found ${builtIndexFiles.length}`);
    return failures;
  }

  const outputRoot = resolve(builtIndexFiles[0], '..');
  const indexContents = readFileSync(builtIndexFiles[0], 'utf8');
  const builtAssetUrl = indexContents.match(
    /(?:src|href)=["'](\/[^"']*\/assets\/[^"']+)["']/i,
  )?.[1];
  const basePath = builtAssetUrl?.slice(0, builtAssetUrl.indexOf('/assets/') + 1) ?? '/';

  for (const file of cssFiles) {
    const contents = readFileSync(file, 'utf8');
    const fontFaceBlocks = contents.match(/@font-face\s*\{[^}]*\}/gi) ?? [];

    for (const block of fontFaceBlocks) {
      const urls = [...block.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)].map((match) => match[2]);
      if (urls.length === 0) {
        failures.push(`${file.slice(projectRoot.length + 1)}: @font-face has no font URL`);
      }

      for (const url of urls) {
        if (/^(?:https?:)?\/\//i.test(url)) continue;
        if (/^data:/i.test(url)) continue;
        const pathname = decodeURIComponent(url.split(/[?#]/, 1)[0]);
        let builtAsset;
        if (pathname.startsWith('/')) {
          if (!pathname.startsWith(basePath)) {
            failures.push(
              `${file.slice(projectRoot.length + 1)}: local font URL is outside build base ${basePath}: ${url}`,
            );
            continue;
          }
          builtAsset = join(outputRoot, pathname.slice(basePath.length));
        } else {
          builtAsset = resolve(file, '..', pathname);
        }
        if (!existsSync(builtAsset) || !statSync(builtAsset).isFile()) {
          failures.push(
            `${file.slice(projectRoot.length + 1)}: declared local font is missing from build output: ${url}`,
          );
        }
      }
    }
  }

  if (cssFiles.length === 0) {
    failures.push('dist: no built CSS files found');
  }
  return failures;
}

function walkAll(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walkAll(path) : [path];
  });
}

const sourceFiles = [join(projectRoot, 'index.html'), ...walk(join(projectRoot, 'src'))];
function validate() {
  const failures = findExternalFontReferences(sourceFiles);

  if (!sourceOnly) {
    if (!existsSync(distRoot)) {
      failures.push('dist: build output does not exist');
    } else {
      failures.push(...findExternalFontReferences(walk(distRoot)));
      failures.push(...findBuiltFontAssets());
    }
  }

  if (failures.length > 0) {
    console.error(`Font validation failed:\n- ${failures.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }

  console.log(sourceOnly ? 'Source font validation passed.' : 'Source and built font validation passed.');
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  validate();
}