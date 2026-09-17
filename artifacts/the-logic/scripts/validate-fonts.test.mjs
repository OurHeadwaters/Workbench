import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const validator = resolve(import.meta.dirname, 'validate-fonts.mjs');

function fixture({ source = '', builtUrl = '/logic/fonts/local.woff2', emitPath = 'fonts/local.woff2' } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'the-logic-fonts-'));
  mkdirSync(join(root, 'src'), { recursive: true });
  mkdirSync(join(root, 'dist/public/assets'), { recursive: true });
  writeFileSync(join(root, 'index.html'), '<html></html>');
  writeFileSync(join(root, 'src/index.css'), source);
  writeFileSync(
    join(root, 'dist/public/index.html'),
    '<script type="module" src="/logic/assets/index.js"></script>',
  );
  writeFileSync(
    join(root, 'dist/public/assets/index.css'),
    `@font-face { font-family: Local; src: url("${builtUrl}"); }`,
  );
  if (emitPath) {
    const emittedFile = join(root, 'dist/public', emitPath);
    mkdirSync(resolve(emittedFile, '..'), { recursive: true });
    writeFileSync(emittedFile, 'font');
  }
  return root;
}

function run(root, ...args) {
  return spawnSync(process.execPath, [validator, ...args], {
    env: { ...process.env, FONT_VALIDATOR_PROJECT_ROOT: root },
    encoding: 'utf8',
  });
}

test('accepts a local font emitted at its exact build path', (t) => {
  const root = fixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(run(root).status, 0);
});

for (const remoteUrl of ['https://cdn.example/font?id=123', '//cdn.example/font?id=123']) {
  test(`rejects remote @font-face URL ${remoteUrl}`, (t) => {
    const root = fixture({
      source: `@font-face { font-family: Remote; src: url("${remoteUrl}"); }`,
    });
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const result = run(root, '--source-only');
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /external font URL in @font-face/);
  });
}

test('rejects a protocol-relative external stylesheet', (t) => {
  const root = fixture({ source: '@import url("//fonts.example/styles.css");' });
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const result = run(root, '--source-only');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /external font stylesheet/);
});

test('rejects a font missing from its exact emitted path', (t) => {
  const root = fixture({
    builtUrl: '/logic/fonts/local.woff2',
    emitPath: 'other/local.woff2',
  });
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /declared local font is missing from build output/);
});