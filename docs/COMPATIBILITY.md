# Compatibility And Support Policy

This package is a WebView bridge. Compatibility depends on:

- React
- React Native
- `react-native-webview`
- the Android System WebView or iOS WKWebView
- the bundled `@google/model-viewer` runtime
- how the consuming app bundles `.glb` and `.gltf` files

## Supported Peer Ranges

```json
{
  "react": ">=18",
  "react-native": ">=0.72",
  "react-native-webview": ">=13"
}
```

These ranges describe the intended support window, not a claim that every patch
release has been manually device-tested.

## Tested In This Repository

Current local integration target:

- Expo SDK 54
- React 19.1
- React Native 0.81
- `react-native-webview` 13.15
- `@google/model-viewer` 4.2.0
- TypeScript 5.9

Automated checks validate:

- package utility behavior with Node's built-in test runner
- package source typechecking when package dependencies are installed
- package tarball contents with `npm pack --dry-run`
- integration with this repository's Expo app through TypeScript and Expo lint

## Device Smoke Tests

These results are manual smoke tests, not a blanket support matrix.

| Date | Platform | App runtime | Model source | Result |
| --- | --- | --- | --- | --- |
| 2026-06-30 | Android 16 physical device | Expo Go, Expo SDK 56 tester app | Remote GLB URL | Verified |
| 2026-06-30 | Android 16 physical device | Expo Go, Expo SDK 56 tester app | Local Khronos `Box.glb` as `data:model/gltf-binary;base64,...` | Verified |
| 2026-06-30 | Android 16 physical device | Expo Go, Expo SDK 56 tester app | Local Khronos `Box.glb` as direct `file:` URI | Not reliable in this smoke test |
| Not yet tested | iOS WKWebView | Not yet tested | Any model source | Not yet verified |

The local Android test used `expo-asset` to resolve a bundled `.glb`, then
`expo-file-system` to read the local file as base64 before passing a
`data:model/gltf-binary;base64,...` URI to `ModelViewerWebView`. This avoids the
Android WebView file-access path that failed in the direct `file:` smoke test.

## Not Guaranteed

The package does not claim blanket support for all React Native versions.

Explicit limitations:

- React Native below `0.72` is unsupported.
- WebView bugs in specific Android System WebView or iOS versions may affect
  rendering.
- Local `.glb` bundling depends on the consuming app's Metro config.
- On Android Expo Go, direct WebView loading from a local `file:` GLB URI was
  not reliable in the 2026-06-30 smoke test. Prefer a GLB data URI for local
  Expo assets unless your target app/device matrix proves direct file loading.
- Device rendering is not fully proven by unit tests.
- AR behavior is not a supported package guarantee.
- Long lists of many WebViews may have memory/performance problems.

## Compatibility Review Checklist

Before expanding peer ranges or claiming support for a platform/version:

- install the package in a clean Expo app
- render a remote `.glb`
- render a bundled `.glb`
- verify `onModelLoaded`
- verify a failed model URL triggers `onModelError`
- test Android physical device or emulator
- test iOS physical device or simulator if claiming iOS support
- update this document with the tested versions

## Recommended Consumer Setup

For Expo apps:

```bash
npx expo install react-native-model-viewer-webview react-native-webview
```

For bare React Native apps:

```bash
npm install react-native-model-viewer-webview react-native-webview
```

For local `.glb` imports, add `glb` and `gltf` to Metro's asset extensions.
See the package README for an example.

## Local Symlink And `file:` Dependency Setup

When developing this package from a local checkout, avoid letting Metro load
peer dependencies from the package's own `node_modules`.

This package keeps `react`, `react-native`, and `react-native-webview` as peer
dependencies. A published npm install does not include this package's
development `node_modules`, but a local symlink or `file:../package` install can
expose them to Metro. If Metro bundles a package-local copy of React, the app
can fail with an invalid hook call even when both copies have the same version.

For local development, configure the consuming app's Metro setup to:

- watch the local package folder
- resolve `react`, `react-native`, and `react-native-webview` from the app's
  `node_modules`
- exclude package-local dev copies of those peer dependencies from Metro's file
  map

## Dependency Update Policy

- Keep `react-native-webview` peer range broad unless a real incompatibility is
  found.
- Keep dev dependencies pinned to one known-good React Native stack.
- Use CI and device smoke tests before raising support claims.
- If `<model-viewer>` changes behavior, update README examples, vendor metadata,
  third-party notices, and tests before changing the bundled runtime version.
