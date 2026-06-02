const assert = require("node:assert/strict");
const test = require("node:test");

const pkg = require("../dist");

test("package entry exports utility APIs without requiring React Native peers", () => {
  assert.equal(typeof pkg.buildModelViewerHtml, "function");
  assert.equal(typeof pkg.parseModelViewerMessage, "function");
  assert.equal(typeof pkg.resolveModelSourceUri, "function");
  assert.equal(pkg.BUNDLED_MODEL_VIEWER_VERSION, "4.2.0");
  assert.equal(pkg.DEFAULT_MODEL_VIEWER_SCRIPT_URL, pkg.MODEL_VIEWER_CDN_SCRIPT_URL);
  assert.match(pkg.MODEL_VIEWER_CDN_SCRIPT_URL, /model-viewer\/4\.2\.0\/model-viewer\.min\.js/);
});

test("ModelViewerWebView export stays lazy until consumers access the component", () => {
  const descriptor = Object.getOwnPropertyDescriptor(pkg, "ModelViewerWebView");

  assert.equal(typeof descriptor.get, "function");
});
