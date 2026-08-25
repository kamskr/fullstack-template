import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  findMarkdownLinkTargets,
  parseFrontMatter,
  validateLinkTarget,
} from './markdown.mjs';

// Directories whose Markdown files carry required summary/read_when frontmatter.
export const CANONICAL_DIRS = ['docs'];

// Never descend into these directories anywhere in the tree.
export const IGNORED_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.turbo',
  '.expo',
  'dist',
  'build',
  'coverage',
  'generated',
]);

export function collectMarkdownFiles(rootDir) {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIR_NAMES.has(entry.name)) walk(join(dir, entry.name));
      } else if (entry.name.toLowerCase().endsWith('.md')) {
        files.push(join(dir, entry.name));
      }
    }
  };
  walk(rootDir);
  return files.sort();
}

export function isCanonical(rootDir, filePath) {
  const rel = relative(rootDir, filePath);
  return CANONICAL_DIRS.some((dir) => rel === dir || rel.startsWith(dir + sep));
}

// Every Markdown file in the repo gets its local links checked; only canonical
// docs must carry frontmatter. Reports errors as `path[:line]: message`.
export async function checkDocs(rootDir) {
  const errors = [];
  const files = collectMarkdownFiles(rootDir);
  let canonicalCount = 0;
  let linkCount = 0;

  for (const filePath of files) {
    const rel = relative(rootDir, filePath);
    const content = readFileSync(filePath, 'utf8');

    if (isCanonical(rootDir, filePath)) {
      canonicalCount += 1;
      for (const error of parseFrontMatter(content).errors) {
        errors.push(`${rel}: ${error}`);
      }
    }

    for (const link of findMarkdownLinkTargets(content)) {
      linkCount += 1;
      const error = await validateLinkTarget({
        documentPath: filePath,
        repoRoot: rootDir,
        target: link.target,
      });
      if (error) errors.push(`${rel}:${link.line}: ${error}`);
    }
  }

  return { errors, fileCount: files.length, canonicalCount, linkCount };
}

export function listCanonicalDocs(rootDir) {
  const docs = [];
  for (const dir of CANONICAL_DIRS) {
    const base = join(rootDir, dir);
    if (!existsSync(base)) continue;
    for (const filePath of collectMarkdownFiles(base)) {
      const { summary, errors } = parseFrontMatter(readFileSync(filePath, 'utf8'));
      docs.push({
        path: relative(rootDir, filePath),
        summary: summary ?? `(${errors.join('; ')})`,
      });
    }
  }
  return docs;
}
