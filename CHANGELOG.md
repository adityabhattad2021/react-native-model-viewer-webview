# Changelog

All notable changes to this package should be documented here.

This project uses semantic versioning. Versions below `1.0.0` may still change
minor APIs when the release notes call it out clearly.

## 0.2.1 - 2026-06-30

This is a docs and confidence release. There are no runtime API changes.

### Documentation

- Add Android Expo Go smoke-test notes for remote GLB loading and local GLB
  loading.
- Document the local Expo asset path that worked in testing: resolve the
  bundled `.glb`, read it as base64, and pass a
  `data:model/gltf-binary;base64,...` URI to `ModelViewerWebView`.
- Call out that direct Android WebView loading from a local `file:` GLB URI was
  not reliable in this smoke test.
- Add a verified smoke-test table to the README and compatibility docs, with
  iOS WKWebView still marked as not yet tested.
- Add the Android local-GLB screenshot and compatibility section to the public
  docs site.

### Maintenance

- Update docs-site tests so the new local-GLB guidance and smoke-test evidence
  stay present.

## 0.2.0 - 2026-06-02

### Added

- Bundle `@google/model-viewer` 4.2.0 inside the package so the default WebView
  runtime no longer needs a CDN request.
- Add third-party notice and Apache-2.0 license metadata for the vendored
  `@google/model-viewer` runtime.
- Export `BUNDLED_MODEL_VIEWER_VERSION` so consumers can inspect the embedded
  runtime version.
- Export `MODEL_VIEWER_CDN_SCRIPT_URL` for apps that explicitly opt back into
  the Google CDN runtime.

### Changed

- Make generated model-viewer HTML offline-first by inlining the bundled
  runtime by default.
- Keep `modelViewerScriptUrl` and `modelViewerScript` as explicit overrides for
  custom CDN, local file, or app-bundled script loading.
- Keep `DEFAULT_MODEL_VIEWER_SCRIPT_URL` as a compatibility alias for
  `MODEL_VIEWER_CDN_SCRIPT_URL`.

## 0.1.0 - 2026-05-31

Initial public release of `react-native-model-viewer-webview`.

### Added

- Add `ModelViewerWebView`, a `react-native-webview` backed component for
  rendering simple GLB and glTF previews through Google's `<model-viewer>` web
  component.
- Add `modelSource` support for remote URLs, `data:` URIs, `file:` URIs, React
  Native static asset module numbers from `require(...)`, and Expo-style
  `{ localUri, uri }` asset objects.
- Keep `modelUri` as a string-only compatibility input for callers that already
  have a resolved model URL.
- Add `htmlOptions` for common `<model-viewer>` controls, including
  `cameraControls`, `autoRotate`, camera orbit bounds, exposure, shadow
  intensity, background color, poster color, and additional attributes.
- Add status callbacks for model lifecycle handling:
  `onStatus`, `onModelLoaded`, and `onModelError`.
- Add offline script loading hooks through `modelViewerScriptUrl` and
  `modelViewerScript`.
- Export utility APIs for advanced consumers and tests:
  `buildModelViewerHtml`, `parseModelViewerMessage`, and
  `resolveModelSourceUri`.

### Documentation

- Add README guidance for Expo and bare React Native installation, local GLB
  Metro setup, offline script loading, and when to choose native 3D stacks
  instead.
- Add `docs/HOW_IT_WORKS.md`, `docs/COMPATIBILITY.md`,
  `docs/AGENT_USAGE.md`, and `docs/RELEASE.md`.
- Add `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, `llms.txt`, and a portable
  Agent Skill for AI-assisted package integration.
- Add a static GitHub Pages docs site with install instructions, examples,
  direct answers for search/answer engines, use-case ideas, limitations, and
  package-fit guidance.

### Maintenance

- Add Node test coverage for model source resolution, generated model-viewer
  HTML, WebView status parsing, package exports, agent assets, docs site
  metadata, and GitHub Pages workflow configuration.
- Add TypeScript source checking and `npm pack --dry-run` verification through
  `npm run check`.
- Add GitHub Actions workflows for package CI, npm publishing, and GitHub Pages
  deployment.

### Known Limitations

- `react-native-webview` is a peer dependency and must be installed by the
  consuming app.
- This package renders through WebView; it is not a native 3D renderer and is
  not intended for shaders, physics, AR, complex scenes, or game-like
  interaction.
- React Native versions below `0.72` are unsupported.
- Local `.glb` and `.gltf` imports still depend on the consuming app's Metro
  asset configuration.
- I am yet to test this on iOS. I will mark iOS as verified after I run a
  WKWebView smoke test on an iOS device or simulator.
