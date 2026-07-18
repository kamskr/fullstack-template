import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { listCanonicalDocs } from './lib.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const docs = listCanonicalDocs(rootDir);
const width = Math.max(...docs.map((doc) => doc.path.length));

for (const doc of docs) {
  console.log(`${doc.path.padEnd(width)}  ${doc.summary}`);
}
console.log(`\n${docs.length} canonical docs`);
