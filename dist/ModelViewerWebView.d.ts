import type { ReactElement } from "react";
import type { WebViewMessageEvent, WebViewProps } from "react-native-webview";

import type { ModelViewerHtmlOptions, ModelViewerStatus } from "./model-viewer-html";
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

export declare function ModelViewerWebView(
  props: ModelViewerWebViewProps,
): ReactElement;
