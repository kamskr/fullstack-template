import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  findMarkdownFiles,
  findMarkdownLinkTargets,
  parseFrontMatter,
  validateLinkTarget,
} from "./markdown.mjs";

test("parses required documentation frontmatter", () => {
  const block = parseFrontMatter(`---
summary: "API behavior # overview"
read_when:
  - Changing API behavior
  - 'Debugging local setup'
---
# API
`);
  assert.deepEqual(block, {
    summary: "API behavior # overview",
    readWhen: ["Changing API behavior", "Debugging local setup"],
    errors: [],
  });

  const inline = parseFrontMatter(`---
summary: Monorepo workflow
read_when: [Changing packages, "Updating scripts"]
---
`);
  assert.deepEqual(inline.errors, []);
  assert.deepEqual(inline.readWhen, ["Changing packages", "Updating scripts"]);
});

test("reports missing and malformed required frontmatter", () => {
  assert.deepEqual(parseFrontMatter("# No metadata\n").errors, [
    "missing YAML frontmatter",
  ]);

  const malformed = parseFrontMatter(`---
summary: "
read_when: []
---
`);
  assert.ok(
    malformed.errors.includes(
      "frontmatter summary must be a non-empty single-line value",
    ),
  );
  assert.ok(
    malformed.errors.includes(
      "frontmatter read_when must contain at least one item",
    ),
  );
});

test("finds Markdown destinations outside comments and code", () => {
  const targets = findMarkdownLinkTargets(`
[inline](../README.md#setup)
[spaced](<reference files/guide.md>)
[reference]: ./architecture.md "Architecture"
\`[code](ignored.md)\`
\\[escaped](ignored.md)
<!-- [comment](ignored.md) -->
\`\`\`
[fence](ignored.md)
\`\`\`
`);

  assert.deepEqual(
    targets.map(({ target }) => target),
    ["../README.md#setup", "reference files/guide.md", "./architecture.md"],
  );
});

test("validates local Markdown destinations", async (context) => {
  const repoRoot = await mkdtemp(join(tmpdir(), "docs-check-"));
  const docsDirectory = join(repoRoot, "docs");
  const nestedDirectory = join(docsDirectory, "nested");
  const documentPath = join(nestedDirectory, "page.md");
  await mkdir(nestedDirectory, { recursive: true });
  await writeFile(join(repoRoot, "README.md"), "# Readme\n");
  await writeFile(join(docsDirectory, "a file.md"), "# File\n");
  await writeFile(documentPath, "# Page\n");
  context.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(repoRoot, { recursive: true, force: true });
  });

  assert.equal(
    await validateLinkTarget({
      documentPath,
      repoRoot,
      target: "../../README.md#setup",
    }),
    null,
  );
  assert.equal(
    await validateLinkTarget({
      documentPath,
      repoRoot,
      target: "../a%20file.md",
    }),
    null,
  );
  assert.equal(
    await validateLinkTarget({
      documentPath,
      repoRoot,
      target: "https://example.com/docs",
    }),
    null,
  );
  assert.match(
    await validateLinkTarget({ documentPath, repoRoot, target: "missing.md" }),
    /does not exist/u,
  );
  assert.match(
    await validateLinkTarget({
      documentPath,
      repoRoot,
      target: "../../../outside.md",
    }),
    /escapes the repository/u,
  );
});

test("finds nested Markdown files in stable order", async (context) => {
  const docsDirectory = await mkdtemp(join(tmpdir(), "docs-list-"));
  await mkdir(join(docsDirectory, "z"));
  await writeFile(join(docsDirectory, "b.md"), "");
  await writeFile(join(docsDirectory, "a.md"), "");
  await writeFile(join(docsDirectory, "z", "nested.md"), "");
  await writeFile(join(docsDirectory, "ignored.txt"), "");
  context.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(docsDirectory, { recursive: true, force: true });
  });

  const files = await findMarkdownFiles(docsDirectory);
  assert.deepEqual(
    files.map((path) => path.slice(docsDirectory.length + 1)),
    ["a.md", "b.md", join("z", "nested.md")],
  );
});
