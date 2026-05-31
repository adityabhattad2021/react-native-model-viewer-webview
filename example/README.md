# Example

This folder contains a minimal Expo screen for smoke-testing the package with a
remote GLB.

```bash
npx create-expo-app model-viewer-example
cd model-viewer-example
npx expo install react-native-model-viewer-webview react-native-webview
```

Replace the generated `App.tsx` with this folder's `App.tsx`, then run:

```bash
npx expo start
```

## Testing Bundled GLB Files

For local `.glb` imports, configure Metro:

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

Then use:

```tsx
<ModelViewerWebView modelSource={require("./assets/car.glb")} />
```

Always test bundled assets on a real Android or iOS device before publishing a
release that claims bundled model support.
