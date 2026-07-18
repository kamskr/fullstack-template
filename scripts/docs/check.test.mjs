import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  checkDocs,
  extractLocalLinks,
  listCanonicalDocs,
  parseFrontmatter,
} from './lib.mjs';

const FRONTMATTER = `---
summary: A test doc.
read_when:
  - Testing.
---

`;

function makeRepo(build) {
  const rootDir = mkdtempSync(join(tmpdir(), 'docs-check-'));
  try {
    build(rootDir);
    return checkDocs(rootDir);
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

test('parseFrontmatter reads summary and read_when list', () => {
  const data = parseFrontmatter(FRONTMATTER + '# Doc\n');
  assert.equal(data.summary, 'A test doc.');
  assert.deepEqual(data.read_when, ['Testing.']);
});

test('parseFrontmatter returns null without a frontmatter block', () => {
  assert.equal(parseFrontmatter('# Doc\n\nNo frontmatter.\n'), null);
});

test('parseFrontmatter treats a bare key as an empty list', () => {
  const data = parseFrontmatter('---\nsummary: x\nread_when:\n---\n');
  assert.deepEqual(data.read_when, []);
});

test('extractLocalLinks keeps local paths and skips URLs, anchors, and code', () => {
  const content = [
    '[local](../shared/monorepo.md)',
    '[url](https://example.com/page)',
    '[mail](mailto:a@b.c)',
    '[anchor](#section)',
    '[in-fragment](./other.md#part)',
    '```',
    '[fenced](./ignored.md)',
    '```',
    'and `[inline](./ignored-too.md)` code',
  ].join('\n');
  assert.deepEqual(extractLocalLinks(content), [
    '../shared/monorepo.md',
    './other.md#part',
  ]);
});

test('checkDocs passes a valid canonical doc with a resolvable link', () => {
  const result = makeRepo((rootDir) => {
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

test('checkDocs flags missing frontmatter, empty read_when, and broken links', () => {
  const result = makeRepo((rootDir) => {
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
  assert.match(joined, /empty-read-when\.md: frontmatter needs a non-empty "read_when"/);
  assert.match(joined, /no-frontmatter\.md: missing YAML frontmatter/);
  assert.match(joined, /README\.md: broken local link "docs\/missing\.md"/);
});

test('checkDocs does not require frontmatter outside canonical dirs and skips ignored dirs', () => {
  const result = makeRepo((rootDir) => {
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
