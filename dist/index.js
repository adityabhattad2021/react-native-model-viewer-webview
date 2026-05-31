const modelViewerHtml = require("./model-viewer-html");

Object.assign(exports, modelViewerHtml);

Object.defineProperty(exports, "ModelViewerWebView", {
  enumerable: true,
  get() {
    return require("./ModelViewerWebView").ModelViewerWebView;
  },
});

Object.defineProperty(exports, "resolveModelSourceUri", {
  enumerable: true,
  get() {
    return require("./model-source").resolveModelSourceUri;
  },
});
