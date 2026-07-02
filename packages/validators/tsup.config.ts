import { defineConfig } from 'tsup';

// Emit both ESM and CJS so every consumer works:
// - web/mobile bundlers resolve the `import` (ESM) condition
// - the NestJS API (compiled to CJS, and the ts-node OpenAPI script)
//   resolve the `require` (CJS) condition
// Bundling inlines the internal `./*.js` subpath imports, which Node cannot
// resolve against raw `.ts` source at runtime.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
});
