# react-native-model-viewer-webview

A tiny React Native and Expo wrapper around Google's `<model-viewer>` web
component, rendered inside `react-native-webview`.

It is for simple GLB/glTF previews, not for building a native 3D engine.

## Why This Exists

Use this package when your product requirement sounds like:

> "Show this `.glb` in a React Native screen with orbit controls, auto-rotate,
> lighting, and load/error callbacks."

For that job, setting up Filament, Three.js, React Three Fiber, render loops,
lights, cameras, loaders, and Metro asset details can be more machinery than the
screen deserves. This package gives you the WebView version of the web
`<model-viewer>` ergonomics.

## When To Use It

- Product cards or vehicle previews.
- Marketplace listings with one inspectable 3D asset.
- Expo demos and prototypes where WebView rendering is acceptable.
- Apps that already use `<model-viewer>` on the web and want similar mobile
  behavior.
- Teams that want a small dependency and do not need full scene control.

## When Not To Use It

Use a native 3D stack instead when you need:

- native GPU rendering as the core experience
- custom materials, shaders, lights, or post-processing
- physics, collision, skeletal animation control, or multi-object scenes
- precise frame timing or heavy interaction
- AR or game-like rendering

Good alternatives:

- [`react-native-filament`](https://margelo.github.io/react-native-filament/)
  for a native mobile rendering engine.
- [`@react-three/fiber/native`](https://r3f.docs.pmnd.rs/getting-started/installation#react-native)
  for the Three.js ecosystem on React Native.
- Expo [`GLView`](https://docs.expo.dev/versions/latest/sdk/gl-view/) when you
  want lower-level WebGL control.

## Install

Expo:

```bash
npx expo install react-native-model-viewer-webview react-native-webview
```

Bare React Native:

```bash
npm install react-native-model-viewer-webview react-native-webview
```

If your app already has a compatible `react-native-webview`, install only
`react-native-model-viewer-webview`. Bare React Native apps should follow
`react-native-webview`'s native setup instructions.

## Quick Start

```tsx
import { ModelViewerWebView } from "react-native-model-viewer-webview";

export function CarPreview() {
  return (
    <ModelViewerWebView
      modelSource="https://example.com/car.glb"
      style={{ height: 320 }}
      htmlOptions={{
        autoRotate: true,
        cameraControls: true,
        cameraOrbit: "35deg 66deg 6.2m",
        disablePan: true,
        exposure: 1.05,
        shadowIntensity: 0.35,
      }}
      onModelLoaded={(status) => {
        console.log(status.message);
      }}
      onModelError={(status) => {
        console.warn(status.message);
      }}
    />
  );
}
```

## Model Sources

`modelSource` accepts:

- a remote URL
- a `data:` URI
- a `file:` URI
- a React Native static asset module number from `require(...)`
- an object with `localUri` and/or `uri`, such as an Expo asset

```tsx
<ModelViewerWebView
  modelSource={require("./assets/car.glb")}
  style={{ height: 320 }}
/>
```

```tsx
import { Asset } from "expo-asset";
import { ModelViewerWebView } from "react-native-model-viewer-webview";

const carModel = Asset.fromModule(require("./assets/car.glb"));
await carModel.downloadAsync();

<ModelViewerWebView modelSource={carModel} style={{ height: 320 }} />;
```

`localUri` is preferred over `uri` when both exist. `modelUri` is still accepted
as a string-only compatibility prop.

For Android Expo Go, direct `file:` loading from WebView can be unreliable. The
verified local-asset path is to read the Expo asset as base64 and pass a GLB
data URI:

```tsx
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { ModelViewerWebView } from "react-native-model-viewer-webview";

const model = Asset.fromModule(require("./assets/model.glb"));
await model.downloadAsync();

const localUri = model.localUri ?? model.uri;
const base64 = await FileSystem.readAsStringAsync(localUri, {
  encoding: FileSystem.EncodingType.Base64,
});
const modelSource = `data:model/gltf-binary;base64,${base64}`;

<ModelViewerWebView modelSource={modelSource} style={{ height: 320 }} />;
```

This data-URI path was smoke-tested on Android Expo Go with a local Khronos
`Box.glb` asset. Use `file:` URIs only after testing them on your target
WebView/device matrix.

## Metro Setup For Local GLB Files

If your app imports `.glb` files, add `glb` to Metro's asset extensions.

Expo example:

```js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "glb",
  "gltf",
];

module.exports = config;
```

## Troubleshooting Local Package Development

If you test this package through `file:../path`, `npm link`, or a monorepo
symlink, make sure Metro resolves peer dependencies from the app, not from this
package's local `node_modules`.

Duplicate React copies can cause this error:

```text
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

In that setup, alias `react`, `react-native`, and `react-native-webview` to the
app's `node_modules`, and exclude any package-local dev copies of those peers
from Metro's file map.

## Offline Script Loading

By default, the generated WebView HTML inlines a vendored copy of
`@google/model-viewer` 4.2.0. That means the viewer runtime does not need a CDN
request, and local `.glb` previews can work offline when the model asset is also
available locally.

This makes the npm package larger, but keeps runtime behavior deterministic and
offline-friendly. The Apache-2.0 license for the bundled runtime is included in
[`vendor/model-viewer/LICENSE`](./vendor/model-viewer/LICENSE), with a summary in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md). The exact source package,
file hash, and generated runtime details are recorded in
[`vendor/model-viewer/SOURCE.md`](./vendor/model-viewer/SOURCE.md).

If you prefer a custom or CDN-hosted runtime, pass your own script URL:

```tsx
import { MODEL_VIEWER_CDN_SCRIPT_URL } from "react-native-model-viewer-webview";

<ModelViewerWebView
  modelSource="https://example.com/car.glb"
  htmlOptions={{
    modelViewerScriptUrl: MODEL_VIEWER_CDN_SCRIPT_URL,
  }}
/>
```

Or pass an inline module script if your build already bundles the source:

```tsx
<ModelViewerWebView
  modelSource="https://example.com/car.glb"
  htmlOptions={{
    modelViewerScript: bundledModelViewerSource,
  }}
/>
```

## Verified Smoke Tests

| Platform | App runtime | Model source | Result |
| --- | --- | --- | --- |
| Android 16 physical device | Expo Go, Expo SDK 56 tester app | Remote GLB URL | Verified |
| Android 16 physical device | Expo Go, Expo SDK 56 tester app | Local Khronos `Box.glb` as `data:model/gltf-binary;base64,...` | Verified |
| Android 16 physical device | Expo Go, Expo SDK 56 tester app | Local Khronos `Box.glb` as direct `file:` URI | Not reliable in this smoke test |
| iOS WKWebView | Not yet tested | Any model source | Not yet verified |

## Props

`ModelViewerWebView` accepts all `react-native-webview` props except `source` and
`onMessage`, which are managed by the package.

Important props:

| Prop | Type | Description |
| --- | --- | --- |
| `modelSource` | `string \| number \| { localUri?: string; uri?: string }` | Preferred model input. |
| `modelUri` | `string` | String-only compatibility input. |
| `htmlOptions` | `ModelViewerHtmlOptions` | Controls `<model-viewer>` attributes and script loading. |
| `onStatus` | `(status, event) => void` | Receives every status message from the WebView. |
| `onModelLoaded` | `(status, event) => void` | Fires when `<model-viewer>` emits `load`. |
| `onModelError` | `(status, event) => void` | Fires when page or model loading fails. |
| `webViewBaseUrl` | `string` | Base URL used for the generated HTML. Defaults to `https://localhost/`. |

Useful `htmlOptions`:

| Option | Description |
| --- | --- |
| `autoRotate` | Adds `auto-rotate`. |
| `cameraControls` | Adds `camera-controls`; defaults to `true`. |
| `cameraOrbit` | Sets the initial orbit. |
| `minCameraOrbit` / `maxCameraOrbit` | Bounds zoom/orbit. |
| `disablePan` | Adds `disable-pan`. |
| `exposure` / `shadowIntensity` | Basic visual tuning. |
| `backgroundColor` / `posterColor` | Controls the WebView and poster background. |
| `additionalAttributes` | Adds extra `<model-viewer>` attributes. |
| `modelViewerScriptUrl` | Overrides the bundled runtime with a custom `<model-viewer>` script URL. |
| `modelViewerScript` | Overrides the bundled runtime with a custom inline module script. |

## Example

See [`example/App.tsx`](./example/App.tsx) for a minimal Expo screen.

## More Documentation

- [Public docs site](https://adityabhattad2021.github.io/react-native-model-viewer-webview/)
- [How it works](./docs/HOW_IT_WORKS.md)
- [Compatibility and support policy](./docs/COMPATIBILITY.md)
- [AI agent usage](./docs/AGENT_USAGE.md)
- [Release and maintenance guide](./docs/RELEASE.md)
- [Contributing](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

## AI Agent Support

The package includes agent-facing docs so coding agents can integrate it without
guessing:

- [`AGENTS.md`](./AGENTS.md) for package-level agent instructions
- [`llms.txt`](./llms.txt) as a compact docs index
- [`agent-skills/react-native-model-viewer-webview/SKILL.md`](./agent-skills/react-native-model-viewer-webview/SKILL.md)
  for skills-compatible agents

Claude Code can use the skill after copying it to
`~/.claude/skills/react-native-model-viewer-webview/SKILL.md` or a project-local
`.claude/skills/react-native-model-viewer-webview/SKILL.md`.
Installing from npm does not automatically install a skill into an agent client.
See [AI agent usage](./docs/AGENT_USAGE.md) for copy/symlink instructions.

## Development

```bash
npm test
npm run typecheck
npm run pack:dry-run
```

The test suite runs against `dist` because that is the code npm consumers load.
When changing `src`, keep `dist` in sync before running the package tests.

## Tradeoffs

This package renders through WebView, so it inherits WebView tradeoffs:

- startup cost is higher than a plain native view
- WebView memory use can matter in long lists
- native gestures and WebView gestures may need tuning in complex screens
- rendering behavior follows the platform WebView

The upside is simplicity. For many product preview surfaces, that is the whole
point.

## Pre-Publish Checklist

Before publishing a release:

- test a remote `.glb` on Android
- test a bundled `.glb` on Android
- test at least one iOS physical device if iOS support is claimed
- test a no-network/offline script setup if documenting offline support
- run `npm pack --dry-run`
- keep the README positioning honest: this is not a Filament/R3F replacement

## License

MIT
