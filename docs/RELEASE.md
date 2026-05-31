# Release And Maintenance Guide

This guide describes how to publish and maintain
`react-native-model-viewer-webview`.

The preferred release path is GitHub Actions plus npm Trusted Publishing. npm
documents Trusted Publishing as an OIDC-based flow that avoids long-lived npm
tokens and automatically generates provenance for supported public packages.

## Release Workflow Summary

1. Land changes through a PR.
2. Run package checks and manual device smoke tests.
3. Update `CHANGELOG.md`.
4. Bump `package.json` version.
5. Create a GitHub release or release tag.
6. Let GitHub Actions publish to npm through Trusted Publishing.
7. Verify the npm package page and install from a clean app.

## One-Time npm Setup

On npmjs.com, configure a trusted publisher for the package:

- Publisher: GitHub Actions
- Organization/user: the GitHub owner
- Repository: the repository name
- Workflow filename: `release.yml`
- Environment name: `npm`, if you keep the workflow environment as configured
- Allowed action: `npm publish`

Trusted Publishing requires npm CLI `11.5.1` or later and Node `22.14.0` or
later in the publishing workflow.

If Trusted Publishing cannot be used, create an npm automation token and store
it as `NPM_TOKEN`, then update the release workflow to use that token. Prefer
Trusted Publishing whenever possible.

## Versioning

Use semantic versioning:

- Patch: documentation fixes, internal test changes, bug fixes that do not
  change public behavior.
- Minor: new props, new source forms, new supported options.
- Major: breaking prop changes, changed defaults, removed APIs, peer range drops.

Before `1.0.0`, minor releases may include breaking changes, but the changelog
must say so clearly.

## Manual Pre-Release Checklist

From the package repository root:

```bash
npm install
npm run check
```

From a consuming Expo or React Native app, when validating integration:

```bash
npm install
npx tsc --noEmit
npm run lint
```

Device checks:

- remote `.glb` renders on Android
- bundled `.glb` renders on Android
- bad model URL triggers `onModelError`
- iOS render check is completed before claiming iOS support

Documentation checks:

- README examples match current API
- `docs-site/index.html` examples match current API
- `docs-site/llms.txt` links point to public docs or GitHub URLs
- `docs-site/sitemap.xml` and `docs-site/robots.txt` reference the canonical
  Pages URL
- docs-site JSON-LD matches visible content and package metadata
- Open Graph and Twitter card metadata point to `docs-site/og-image.svg`
- `docs/COMPATIBILITY.md` lists tested versions
- `CHANGELOG.md` has the release entry
- package tarball contents from `npm pack --dry-run` contain only intended files
- GitHub Pages workflow deploys from `docs-site`

## Release PR Steps

1. Move `CHANGELOG.md` entries from `Unreleased` into a version heading.
2. Update `package.json` version.
3. Run all local checks.
4. Open a PR.
5. Wait for CI.
6. Merge.

## Publishing With Tags

The release workflow listens for tags matching:

```text
v*
```

For version `0.1.0`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The workflow verifies that the tag suffix matches `package.json`'s version
before publishing.

## Publishing With workflow_dispatch

The release workflow can also be started manually from GitHub Actions.

Use this only after:

- the version bump is already merged
- CI is green
- npm Trusted Publishing is configured

## Post-Publish Verification

After publishing:

```bash
npm view react-native-model-viewer-webview version
npm view react-native-model-viewer-webview dist.integrity
```

Then install it in a clean Expo app:

```bash
npx create-expo-app model-viewer-publish-smoke
cd model-viewer-publish-smoke
npx expo install react-native-model-viewer-webview react-native-webview
```

Render the remote model from `example/App.tsx`. If the release claims bundled
asset support, also test a local `.glb`.

## Docs Site Deployment

The docs site is a dependency-free static site in `docs-site`. GitHub Pages is
deployed by `.github/workflows/pages.yml` on pushes to `main` that touch the
docs site or Pages workflow.

Before relying on the public docs link:

- enable GitHub Pages with GitHub Actions as the source in repository settings
- verify the workflow finishes successfully
- open the Pages URL and confirm the model preview loads
- check `docs-site/llms.txt` at the Pages root

## Maintenance Rhythm

Monthly or before meaningful releases:

- check latest `react-native-webview` release notes
- check Expo SDK compatibility
- rerun Android smoke tests
- review open issues for WebView/platform-specific failures
- keep README limitations honest

Do not expand compatibility claims based only on typechecks. Use real device
rendering before changing support language.
