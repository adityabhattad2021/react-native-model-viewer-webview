# Vendored model-viewer Runtime

This directory vendors @google/model-viewer@4.2.0 so the default
`ModelViewerWebView` runtime can load inside a React Native WebView without
fetching Google's CDN script at render time.

## Source

- Package: `@google/model-viewer@4.2.0`
- npm: <https://www.npmjs.com/package/@google/model-viewer/v/4.2.0>
- Repository: <https://github.com/google/model-viewer>
- Source file: `dist/model-viewer.min.js`
- Package tarball SHA-256: `dd3dc1611a74561ebc2ea4340970ecbafbe8d98266d106aad15a1b62d95b0331`
- Source file SHA-256: `17d80ab747f51ce00c6b8ed757847443f9e4fba575ebee599a422df30af09fcf`
- Source file bytes: `1041839`

## Generated Files

- `runtime.js` embeds `dist/model-viewer.min.js` as a CommonJS string export.
- `runtime.d.ts` exposes the generated runtime constants to TypeScript.
- `LICENSE` contains the upstream Apache-2.0 license text.
- `VERSION` records the exact upstream package version.

Regenerate these files with:

```bash
npm run generate:model-viewer-runtime
```
