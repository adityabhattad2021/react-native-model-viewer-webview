const React = require("react");
const { WebView } = require("react-native-webview");

const {
  buildModelViewerHtml,
  isModelViewerErrorStatus,
  MODEL_VIEWER_LOADED_EVENT,
  parseModelViewerMessage,
} = require("./model-viewer-html");
const { resolveModelSourceUri } = require("./model-source");

function ModelViewerWebView({
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
}) {
  const resolvedModelUri = React.useMemo(() => {
    if (modelSource !== undefined) {
      return resolveModelSourceUri(modelSource);
    }

    if (modelUri !== undefined) {
      return modelUri;
    }

    throw new Error("ModelViewerWebView requires modelSource or modelUri.");
  }, [modelSource, modelUri]);

  const html = React.useMemo(
    () =>
      buildModelViewerHtml({
        ...htmlOptions,
        modelUri: resolvedModelUri,
      }),
    [htmlOptions, resolvedModelUri],
  );

  function handleMessage(event) {
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

  return React.createElement(WebView, {
    allowFileAccess,
    allowFileAccessFromFileURLs,
    allowUniversalAccessFromFileURLs,
    androidLayerType,
    bounces,
    domStorageEnabled,
    javaScriptEnabled,
    mixedContentMode,
    onMessage: handleMessage,
    originWhitelist,
    scrollEnabled,
    setSupportMultipleWindows,
    source: {
      baseUrl: webViewBaseUrl,
      html,
    },
    ...webViewProps,
  });
}

exports.ModelViewerWebView = ModelViewerWebView;
