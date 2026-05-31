# Contributing

Thanks for helping improve `react-native-model-viewer-webview`.

This package has a deliberately small scope: show GLB/glTF assets in React
Native through WebView-backed `<model-viewer>` ergonomics. It should stay small,
honest, and easy to reason about.

## Ground Rules

- Do not position this package as a replacement for Filament, React Three Fiber,
  Three.js, or Expo GLView.
- Keep the public API boring and explicit.
- Prefer compatibility and clear failure modes over clever abstractions.
- Add tests for utility behavior before changing implementation.
- Keep `src` and `dist` in sync.
- Document platform limitations instead of hiding them.

## Local Checks

From the package directory:

```bash
npm install
npm run check
```

The package tests run against `dist`, because `dist` is what npm consumers load.
If you change `src`, update `dist` before running tests.

From the app directory:

```bash
cd ../../mobile
npm install
npx tsc --noEmit
npm run lint
```

The mobile checks verify the local `file:` dependency and Metro/TypeScript
integration used by this repository's Expo app.

## Test Coverage Expectations

Required for changes to:

- HTML generation: escaping, attributes, script loading, and safe defaults.
- Model source resolution: string URLs, data/file URLs, `localUri`, `uri`, and
  React Native asset module numbers.
- Status parsing: load events, error events, malformed payloads, and raw WebView
  messages.
- Public exports: avoid requiring React Native peers when a consumer imports only
  utility functions.

Component rendering tests are intentionally not faked with shallow mocks right
now. WebView rendering confidence should come from real device smoke tests.

## Pull Request Checklist

- [ ] README updated when public behavior changes.
- [ ] `docs/COMPATIBILITY.md` updated when peer ranges or platform claims change.
- [ ] `CHANGELOG.md` updated under `Unreleased`.
- [ ] `npm test` passes in the package.
- [ ] `npm run typecheck` passes in the package after installing package deps.
- [ ] `npm run pack:dry-run` shows only intended files.
- [ ] Mobile integration checks pass from `mobile`.
- [ ] Android device smoke test completed for rendering changes.
- [ ] iOS device smoke test completed before claiming iOS support.

## Release Contributions

Release PRs should include:

- version bump in `package.json`
- `CHANGELOG.md` entry moved from `Unreleased` to the release version
- fresh package dry-run output reviewed
- Git tag created only after CI is green

See [`docs/RELEASE.md`](./docs/RELEASE.md) for the full release procedure.
