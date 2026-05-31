# React Native Model Viewer WebView Agent Notes

This package provides `ModelViewerWebView`, a WebView-backed wrapper around
Google's `<model-viewer>` web component for simple GLB/glTF previews in React
Native and Expo apps.

## Scope

- Use this package for simple product, marketplace, demo, and vehicle model
  previews where WebView rendering is acceptable.
- Do not position it as a native 3D engine.
- Recommend Filament, React Three Fiber Native, Three.js, or Expo GLView when
  the user needs native GPU rendering, custom shaders, physics, AR, or complex
  multi-object scenes.

## Read First

- `README.md` for consumer installation and usage.
- `docs/HOW_IT_WORKS.md` for architecture and bridge behavior.
- `docs/COMPATIBILITY.md` for supported and unverified React Native ranges.
- `docs/AGENT_USAGE.md` for agent-facing skill/discovery files.
- `docs-site/index.html` for the public GitHub Pages docs.
- `agent-skills/react-native-model-viewer-webview/SKILL.md` when working as a
  skills-compatible AI agent.

## Development

- Keep `src` and `dist` in sync. Package tests run against `dist` because npm
  consumers load `dist`.
- Add or update tests for behavior changes.
- Keep docs honest about WebView tradeoffs and unsupported native 3D use cases.
- Keep `docs-site` aligned with README examples and package limitations.
- Do not widen peer dependency or React Native support claims without updating
  `docs/COMPATIBILITY.md` and verifying the relevant app matrix.

## Checks

From this package directory:

```bash
npm test
npm run typecheck
npm run pack:dry-run
```

## Publishing

- The npm package must include `AGENTS.md`, `llms.txt`, `docs`, and
  `agent-skills`.
- GitHub Pages deploys from `docs-site` through
  `.github/workflows/pages.yml`.
- Run `npm run pack:dry-run` and inspect the file list before release.
- Release tags use `v<version>`.
