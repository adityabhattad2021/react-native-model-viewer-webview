# TODO

## Current Context

- Latest committed package version: `0.2.0`.
- Latest release commit in this checkout: `c87c25b feat: make model-viewer runtime offline-first`.
- `@google/model-viewer` 4.2.0 is vendored into `vendor/model-viewer/runtime.js`.
- The default generated WebView HTML now uses the bundled runtime instead of the CDN.
- `MODEL_VIEWER_CDN_SCRIPT_URL` exists for explicit CDN opt-in.
- `DEFAULT_MODEL_VIEWER_SCRIPT_URL` is kept as a backwards-compatible alias.

## v0.2.1 Stability And Trust

- Smoke test Android in Expo Go with a remote `.glb`.
  - Verified on 2026-06-30 with an Android 16 physical device, Expo Go,
    Expo SDK 56 tester app.
- Smoke test Android release/dev-client build if possible.
- Confirm local `.glb` support with Expo asset config.
  - Local tester app wiring is in `../react-native/3d-asset-tester`.
  - Direct `file:` loading failed in Android Expo Go with
    `model-error: Cannot read properties of undefined (reading 'scene')`.
  - Verified local GLB rendering on 2026-06-30 by loading Khronos `Box.glb`
    through `expo-asset`, reading it with `expo-file-system`, and passing a
    `data:model/gltf-binary;base64,...` URI to `ModelViewerWebView`.
- Add a verified compatibility table to `docs/COMPATIBILITY.md` and the public docs site.
  - Added to docs; run final checks before marking complete.
- Keep iOS/WKWebView marked as not yet verified until an iOS device or simulator test is run.
- Add docs screenshots or a short GIF after a clean visual test is captured.
  - Captured Android Expo Go screenshot and MP4 into `docs-site/assets`.
  - Cropped PNG is embedded in the public docs site.

## Supply Chain And Package Surface Feedback

- Add a CI or scheduled workflow nudge for vendored `@google/model-viewer` updates.
- Compare the vendored version in `vendor/model-viewer/VERSION` against the latest npm version.
- Decide whether stale vendored runtime should fail CI, open an issue, or only warn.
- Consider trimming `package.json.files` to the runtime package surface:
  - keep `dist`
  - keep `vendor`
  - keep `README.md`
  - keep `LICENSE`
  - keep `CHANGELOG.md`
  - keep `SECURITY.md`
  - keep `THIRD_PARTY_NOTICES.md`
- Decide whether `src`, `example`, `scripts`, `tsconfig.json`, `docs`, `AGENTS.md`, `llms.txt`, and `agent-skills` should remain on npm or live only in GitHub.
- Update package-file tests after the final package surface decision.

## Later Roadmap Ideas

- Add easier local asset helpers for Expo.
- Add loading/progress callbacks and better error states.
- Add imperative ref methods like reset camera, set camera orbit, play/pause animation.
- Add hotspot/annotation support for product demos.
- Add animation and variant APIs.
