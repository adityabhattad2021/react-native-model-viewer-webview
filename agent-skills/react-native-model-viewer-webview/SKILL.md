---
name: react-native-model-viewer-webview
description: Use when adding, configuring, debugging, or reviewing react-native-model-viewer-webview in a React Native or Expo app, especially for simple GLB/glTF model previews rendered with WebView instead of Filament, React Three Fiber, Three.js, or Expo GLView.
---

# React Native Model Viewer WebView

Use this skill to help users integrate `react-native-model-viewer-webview`.

## First Decision

Confirm the package is the right tool:

- Use it for simple GLB/glTF product previews, vehicle previews, marketplace cards, and demos where WebView rendering is acceptable.
- Recommend `react-native-filament`, `@react-three/fiber/native`, Three.js, or Expo GLView when the user needs native GPU rendering, custom shaders/materials, physics, AR, many scene objects, or game-like interaction.

Do not describe this package as a native 3D engine.

## Install

Expo:

```bash
npx expo install react-native-model-viewer-webview react-native-webview
```

Bare React Native:

```bash
npm install react-native-model-viewer-webview react-native-webview
```

If the app already has a compatible `react-native-webview`, install only
`react-native-model-viewer-webview`. For bare React Native apps, follow
`react-native-webview` native setup.

## Basic Usage

```tsx
import { ModelViewerWebView } from "react-native-model-viewer-webview";

export function ProductModel() {
  return (
    <ModelViewerWebView
      modelSource="https://example.com/model.glb"
      style={{ height: 320 }}
      htmlOptions={{
        autoRotate: true,
        cameraControls: true,
        exposure: 1.05,
        shadowIntensity: 0.35,
      }}
    />
  );
}
```

## Local GLB Files

If the user imports local `.glb` or `.gltf` files, tell them to add those
extensions to Metro asset extensions.

Expo `metro.config.js`:

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

Then:

```tsx
<ModelViewerWebView modelSource={require("./assets/model.glb")} />
```

## Expo Asset Objects

```tsx
import { Asset } from "expo-asset";
import { ModelViewerWebView } from "react-native-model-viewer-webview";

const model = Asset.fromModule(require("./assets/model.glb"));
await model.downloadAsync();

<ModelViewerWebView modelSource={model} />;
```

## Offline Apps

By default, the package inlines its bundled `@google/model-viewer` runtime, so
local model assets can render without a CDN request. If the user wants to provide
a custom runtime, use:

```tsx
<ModelViewerWebView
  modelSource={require("./assets/model.glb")}
  htmlOptions={{
    modelViewerScriptUrl: "file:///path/to/model-viewer.min.js",
  }}
/>
```

or:

```tsx
<ModelViewerWebView
  modelSource="https://example.com/model.glb"
  htmlOptions={{
    modelViewerScript: bundledModelViewerSource,
  }}
/>
```

## Debugging Checklist

When the model does not render:

1. Verify the app has `react-native-webview` installed.
2. For local files, verify Metro includes `glb` and `gltf`.
3. Check whether `onModelError` receives a page or model error.
4. Try a known remote GLB to separate asset-loading problems from WebView problems.
5. Test on a real Android or iOS device before claiming platform support.
6. If native rendering quality or performance is the issue, recommend Filament or React Three Fiber Native instead.

## References

Read `references/api.md` when you need the package API surface.
