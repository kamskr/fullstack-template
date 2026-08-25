import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { checkDocs } from './lib.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { errors, fileCount, canonicalCount, linkCount } = await checkDocs(rootDir);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR ${error}`);
  console.error(`\ndocs:check failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log(
  `docs:check OK: ${fileCount} Markdown files, ${canonicalCount} canonical docs, ${linkCount} local links`,
);
