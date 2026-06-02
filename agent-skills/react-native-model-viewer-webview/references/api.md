# API Reference For Agents

## Component

```tsx
<ModelViewerWebView
  modelSource={source}
  modelUri="https://example.com/model.glb"
  htmlOptions={options}
  onStatus={(status, event) => {}}
  onModelLoaded={(status, event) => {}}
  onModelError={(status, event) => {}}
  webViewBaseUrl="https://localhost/"
/>
```

`ModelViewerWebView` accepts all `react-native-webview` props except `source`
and `onMessage`.

Prefer `modelSource` over `modelUri`.

## ModelSource

```ts
type ModelSource =
  | string
  | number
  | {
      localUri?: null | string;
      uri?: null | string;
    };
```

Use:

- remote URL: `"https://example.com/model.glb"`
- data URI: `"data:model/gltf-binary;base64,..."`
- file URI: `"file:///.../model.glb"`
- static asset: `require("./assets/model.glb")`
- Expo asset object: `Asset.fromModule(require("./assets/model.glb"))`

## HTML Options

```ts
type ModelViewerHtmlOptions = {
  additionalAttributes?: Record<string, boolean | number | string | null | undefined>;
  autoRotate?: boolean;
  autoRotateDelay?: number | string;
  backgroundColor?: string;
  cameraControls?: boolean;
  cameraOrbit?: string;
  disablePan?: boolean;
  exposure?: number | string;
  interactionPrompt?: "auto" | "none";
  maxCameraOrbit?: string;
  minCameraOrbit?: string;
  modelUri: string;
  modelViewerScript?: string;
  modelViewerScriptUrl?: string;
  posterColor?: string;
  rotationPerSecond?: string;
  shadowIntensity?: number | string;
};
```

Consumers pass `htmlOptions` without `modelUri`; the component injects it.
The package inlines bundled `@google/model-viewer` 4.2.0 by default.
`modelViewerScriptUrl` and `modelViewerScript` override that bundled runtime.

## Utility Functions

```ts
BUNDLED_MODEL_VIEWER_VERSION
MODEL_VIEWER_CDN_SCRIPT_URL
buildModelViewerHtml(options)
parseModelViewerMessage(data)
isModelViewerErrorStatus(status)
resolveModelSourceUri(modelSource)
```

Use utilities for tests or custom wrappers. Most apps should use the component.

## Event Types

- `dom-ready`
- `model-loaded`
- `model-error`
- `page-error`

Statuses ending in `error` trigger `onModelError`.
