const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildModelViewerHtml,
  DEFAULT_MODEL_VIEWER_SCRIPT_URL,
  isModelViewerErrorStatus,
  MODEL_VIEWER_LOADED_EVENT,
  MODEL_VIEWER_PAGE_ERROR_EVENT,
  parseModelViewerMessage,
} = require("../dist");

test("buildModelViewerHtml emits default script and safe model-viewer attributes", () => {
  const html = buildModelViewerHtml({
    additionalAttributes: {
      "ar-modes": "webxr scene-viewer",
      "bad attr": "should-not-render",
      "data-label": 'A&B"<car>',
    },
    autoRotate: true,
    disablePan: true,
    modelUri: 'https://example.com/car.glb?trim=A&B="<SUV>"',
  });

  assert.match(html, new RegExp(escapeRegExp(DEFAULT_MODEL_VIEWER_SCRIPT_URL)));
  assert.match(html, /<model-viewer/);
  assert.match(html, /camera-controls/);
  assert.match(html, /auto-rotate/);
  assert.match(html, /disable-pan/);
  assert.match(html, /ar-modes="webxr scene-viewer"/);
  assert.match(html, /data-label="A&amp;B&quot;&lt;car&gt;"/);
  assert.match(
    html,
    /src="https:\/\/example\.com\/car\.glb\?trim=A&amp;B=&quot;&lt;SUV&gt;&quot;"/,
  );
  assert.doesNotMatch(html, /bad attr/);
});

test("buildModelViewerHtml omits false booleans and sanitizes unsafe CSS colors", () => {
  const html = buildModelViewerHtml({
    autoRotate: false,
    backgroundColor: "red;background:url(https://example.com/bad)",
    cameraControls: false,
    modelUri: "car.glb",
  });

  assert.doesNotMatch(html, /camera-controls/);
  assert.doesNotMatch(html, /auto-rotate/);
  assert.match(html, /background: #ffffff;/);
});

test("buildModelViewerHtml supports inline model-viewer scripts without leaking closing script tags", () => {
  const html = buildModelViewerHtml({
    modelUri: "car.glb",
    modelViewerScript:
      "customElements.define('model-viewer', class extends HTMLElement {});</script><script>bad()</script>",
  });

  assert.match(html, /customElements\.define/);
  assert.doesNotMatch(html, new RegExp(escapeRegExp(DEFAULT_MODEL_VIEWER_SCRIPT_URL)));
  assert.doesNotMatch(html, /<\/script><script>bad/);
  assert.match(html, /<\\\/script><script>bad/);
});

test("parseModelViewerMessage parses JSON status messages", () => {
  const status = parseModelViewerMessage(
    JSON.stringify({ type: MODEL_VIEWER_LOADED_EVENT, message: "ready" }),
  );

  assert.equal(status.type, MODEL_VIEWER_LOADED_EVENT);
  assert.equal(status.message, "ready");
  assert.equal(isModelViewerErrorStatus(status), false);
});

test("parseModelViewerMessage turns raw WebView messages into page errors", () => {
  const status = parseModelViewerMessage("plain WebView failure");

  assert.equal(status.type, MODEL_VIEWER_PAGE_ERROR_EVENT);
  assert.equal(status.message, "plain WebView failure");
  assert.equal(status.rawData, "plain WebView failure");
  assert.equal(isModelViewerErrorStatus(status), true);
});

test("parseModelViewerMessage treats malformed JSON shapes as page errors", () => {
  const status = parseModelViewerMessage(JSON.stringify({ message: "missing type" }));

  assert.equal(status.type, MODEL_VIEWER_PAGE_ERROR_EVENT);
  assert.match(status.message, /missing type/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
