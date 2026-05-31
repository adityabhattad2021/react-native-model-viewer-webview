# Changelog

All notable changes to this package should be documented here.

This project uses semantic versioning. Versions below `1.0.0` may still change
minor APIs when the release notes call it out clearly.

## Unreleased

- Add WebView-backed `ModelViewerWebView` component.
- Add `buildModelViewerHtml`, `parseModelViewerMessage`, and
  `resolveModelSourceUri` utilities.
- Add support for URL, data URI, file URI, static asset module number, and
  `localUri`/`uri` object model sources.
- Add offline `<model-viewer>` script hooks via `modelViewerScriptUrl` and
  `modelViewerScript`.
- Add package tests, example docs, compatibility docs, and release workflow.
- Add `AGENTS.md`, `llms.txt`, and a portable Agent Skill for AI-assisted
  package integration.
- Add a static GitHub Pages documentation site with usage examples and use-case
  ideas.
- Clarify install docs so Expo users install the package and WebView peer with
  one `npx expo install` command.
