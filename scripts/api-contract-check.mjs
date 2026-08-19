#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..");
const generatedPaths = [
  "apps/api/docs/openapi.json",
  "packages/api-client/src/generated",
];

run(process.platform === "win32" ? "pnpm.cmd" : "pnpm", [
  "api-contract:generate",
]);

const diff = run("git", ["diff", "--exit-code", "--", ...generatedPaths], {
  allowFailure: true,
});
const untracked = run(
  "git",
  ["ls-files", "--others", "--exclude-standard", "--", ...generatedPaths],
  { allowFailure: true, captureOutput: true },
);

if (diff.status !== 0 && diff.status !== 1) process.exit(diff.status ?? 1);
if (untracked.status !== 0) process.exit(untracked.status ?? 1);

if (diff.status !== 0 || untracked.stdout.trim()) {
  if (untracked.stdout.trim()) {
    console.error("Untracked generated contract files:");
    console.error(untracked.stdout.trim());
  }
  console.error(
    "\nAPI contract is stale. Run `pnpm api-contract:generate` and commit the generated changes.",
  );
  process.exit(1);
}

console.log("API contract is current.");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: options.captureOutput ? ["inherit", "pipe", "inherit"] : "inherit",
  });

  if (result.error) throw result.error;
  if (!options.allowFailure && result.status !== 0)
    process.exit(result.status ?? 1);
  return result;
}
