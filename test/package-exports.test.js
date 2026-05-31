const assert = require("node:assert/strict");
const test = require("node:test");

const pkg = require("../dist");

test("package entry exports utility APIs without requiring React Native peers", () => {
  assert.equal(typeof pkg.buildModelViewerHtml, "function");
  assert.equal(typeof pkg.parseModelViewerMessage, "function");
  assert.equal(typeof pkg.resolveModelSourceUri, "function");
});

test("ModelViewerWebView export stays lazy until consumers access the component", () => {
  const descriptor = Object.getOwnPropertyDescriptor(pkg, "ModelViewerWebView");

  assert.equal(typeof descriptor.get, "function");
});
