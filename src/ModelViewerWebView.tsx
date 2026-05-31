import { useMemo } from "react";

import { WebView } from "react-native-webview";
import type { WebViewMessageEvent, WebViewProps } from "react-native-webview";

import {
  buildModelViewerHtml,
  isModelViewerErrorStatus,
  MODEL_VIEWER_LOADED_EVENT,
  parseModelViewerMessage,
} from "./model-viewer-html";
import type { ModelViewerHtmlOptions, ModelViewerStatus } from "./model-viewer-html";
import { resolveModelSourceUri } from "./model-source";
import type { ModelSource } from "./model-source";

export type ModelViewerWebViewProps = Omit<WebViewProps, "onMessage" | "source"> & {
  htmlOptions?: Omit<ModelViewerHtmlOptions, "modelUri">;
  modelSource?: ModelSource;
  modelUri?: string;
  onModelError?: (status: ModelViewerStatus, event: WebViewMessageEvent) => void;
  onModelLoaded?: (status: ModelViewerStatus, event: WebViewMessageEvent) => void;
  onStatus?: (status: ModelViewerStatus, event: WebViewMessageEvent) => void;
  webViewBaseUrl?: string;
};

export function ModelViewerWebView({
  allowFileAccess = true,
  allowFileAccessFromFileURLs = true,
  allowUniversalAccessFromFileURLs = true,
  androidLayerType = "hardware",
  bounces = false,
  domStorageEnabled = true,
  htmlOptions,
  javaScriptEnabled = true,
  mixedContentMode = "always",
  modelSource,
  modelUri,
  onModelError,
  onModelLoaded,
  onStatus,
  originWhitelist = ["*"],
  scrollEnabled = false,
  setSupportMultipleWindows = false,
  webViewBaseUrl = "https://localhost/",
  ...webViewProps
}: ModelViewerWebViewProps) {
  const resolvedModelUri = useMemo(() => {
    if (modelSource !== undefined) {
      return resolveModelSourceUri(modelSource);
    }

    if (modelUri !== undefined) {
      return modelUri;
    }

    throw new Error("ModelViewerWebView requires modelSource or modelUri.");
  }, [modelSource, modelUri]);
  const html = useMemo(
    () =>
      buildModelViewerHtml({
        ...htmlOptions,
        modelUri: resolvedModelUri,
      }),
    [htmlOptions, resolvedModelUri],
  );

  function handleMessage(event: WebViewMessageEvent) {
    const status = parseModelViewerMessage(event.nativeEvent.data);

    onStatus?.(status, event);

    if (status.type === MODEL_VIEWER_LOADED_EVENT) {
      onModelLoaded?.(status, event);
      return;
    }

    if (isModelViewerErrorStatus(status)) {
      onModelError?.(status, event);
    }
  }

  return (
    <WebView
      allowFileAccess={allowFileAccess}
      allowFileAccessFromFileURLs={allowFileAccessFromFileURLs}
      allowUniversalAccessFromFileURLs={allowUniversalAccessFromFileURLs}
      androidLayerType={androidLayerType}
      bounces={bounces}
      domStorageEnabled={domStorageEnabled}
      javaScriptEnabled={javaScriptEnabled}
      mixedContentMode={mixedContentMode}
      onMessage={handleMessage}
      originWhitelist={originWhitelist}
      scrollEnabled={scrollEnabled}
      setSupportMultipleWindows={setSupportMultipleWindows}
      source={{
        baseUrl: webViewBaseUrl,
        html,
      }}
      {...webViewProps}
    />
  );
}
