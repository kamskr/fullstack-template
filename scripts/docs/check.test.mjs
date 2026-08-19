import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { checkDocs, listCanonicalDocs } from './lib.mjs';

const FRONTMATTER = `---
summary: A test doc.
read_when:
  - Testing.
---

`;

async function makeRepo(build) {
  const rootDir = mkdtempSync(join(tmpdir(), 'docs-check-'));
  try {
    build(rootDir);
    return await checkDocs(rootDir);
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

test('checkDocs passes a valid canonical doc with a resolvable link', async () => {
  const result = await makeRepo((rootDir) => {
    mkdirSync(join(rootDir, 'docs/shared'), { recursive: true });
    writeFileSync(join(rootDir, 'docs/shared/a.md'), FRONTMATTER + '# A\n');
    writeFileSync(
      join(rootDir, 'docs/README.md'),
      FRONTMATTER + '# Index\n\n[a](shared/a.md)\n',
    );
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.canonicalCount, 2);
  assert.equal(result.linkCount, 1);
});

test('checkDocs flags missing frontmatter, empty read_when, and broken links with line numbers', async () => {
  const result = await makeRepo((rootDir) => {
    mkdirSync(join(rootDir, 'docs'), { recursive: true });
    writeFileSync(join(rootDir, 'docs/no-frontmatter.md'), '# Doc\n');
    writeFileSync(
      join(rootDir, 'docs/empty-read-when.md'),
      '---\nsummary: x\nread_when:\n---\n# Doc\n',
    );
    writeFileSync(
      join(rootDir, 'README.md'),
      '# Root\n\n[missing](docs/missing.md)\n',
    );
  });
  assert.equal(result.errors.length, 3);
  const joined = result.errors.join('\n');
  assert.match(joined, /empty-read-when\.md: frontmatter read_when must contain at least one item/);
  assert.match(joined, /no-frontmatter\.md: missing YAML frontmatter/);
  assert.match(joined, /README\.md:3: link target does not exist: docs\/missing\.md/);
});

test('checkDocs ignores links inside fenced code and inline code', async () => {
  const result = await makeRepo((rootDir) => {
    writeFileSync(
      join(rootDir, 'README.md'),
      ['# Root', '', '````md', '[fenced](./nope.md)', '````', '', 'and `[inline](./nope-too.md)` code'].join('\n'),
    );
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.linkCount, 0);
});

test('checkDocs does not require frontmatter outside canonical dirs and skips ignored dirs', async () => {
  const result = await makeRepo((rootDir) => {
    mkdirSync(join(rootDir, 'apps/api'), { recursive: true });
    writeFileSync(join(rootDir, 'apps/api/README.md'), '# App readme, no frontmatter\n');
    mkdirSync(join(rootDir, 'node_modules/pkg'), { recursive: true });
    writeFileSync(
      join(rootDir, 'node_modules/pkg/README.md'),
      '[broken](./nope.md)\n',
    );
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.fileCount, 1);
});

test('listCanonicalDocs returns paths with summaries', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'docs-list-'));
  try {
    mkdirSync(join(rootDir, 'docs'), { recursive: true });
    writeFileSync(join(rootDir, 'docs/a.md'), FRONTMATTER + '# A\n');
    const docs = listCanonicalDocs(rootDir);
    assert.deepEqual(docs, [{ path: 'docs/a.md', summary: 'A test doc.' }]);
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
});
