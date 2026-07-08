---
summary: pnpm and Expo traps when adding the first native module and switching from Expo Go to a development build.
read_when:
  - Adding a dependency with native code (nitro modules, Skia, anything that needs expo prebuild).
  - Debugging a red screen or Metro crash right after adding a native dependency or a babel config.
---

# Native modules and development builds

The template runs in Expo Go with no native setup. The first library with native code (`react-native-nitro-modules`, `@shopify/react-native-skia`, anything that needs `expo prebuild`) forces a switch to a development build: add `expo-dev-client` and run `expo run:ios` or `expo run:android`. Four things go wrong at that point, and each one produces an error that points somewhere else.

## pnpm blocks install scripts

pnpm does not run a dependency's `postinstall` unless the package is listed under `pnpm.onlyBuiltDependencies` in the root `package.json`. Libraries that download prebuilt binaries at install time (Skia does this) look installed but are broken. `pod install` then fails. Worse, if an earlier build succeeded, the app keeps running with stale pods and crashes at JS init with an unrelated error such as `ReferenceError: Property 'MessageQueue' doesn't exist`. If a fresh native build behaves impossibly, confirm `pod install` succeeds before debugging JS.

## A custom babel.config.js needs babel-preset-expo

Without a babel config, Expo resolves the preset itself. Once you create `babel.config.js` (for Unistyles or any other babel plugin), add `babel-preset-expo` to the app's devDependencies. Otherwise Metro's transformer dies at startup with `Cannot read properties of undefined (reading 'transformFile')`. The real error, `Cannot find module 'babel-preset-expo'`, only shows in the Metro server log, not on the device.

## Do not add the reanimated plugin by hand

`babel-preset-expo` already includes the reanimated/worklets plugin. A manual `react-native-reanimated/plugin` entry breaks bridgeless JS init on SDK 56 and later.

## Host tools

nitro-based pods need `cmake`: `brew install cmake`.

## Read the Metro log first

When the device shows a red screen, the on-device error is usually a downstream symptom. The cause is in the Metro server log.
