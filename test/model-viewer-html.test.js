const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildModelViewerHtml,
  DEFAULT_MODEL_VIEWER_SCRIPT_URL,
  isModelViewerErrorStatus,
  MODEL_VIEWER_CDN_SCRIPT_URL,
  MODEL_VIEWER_LOADED_EVENT,
  MODEL_VIEWER_PAGE_ERROR_EVENT,
  parseModelViewerMessage,
} = require("../dist");

test("legacy default script URL is an alias for the CDN override URL", () => {
  assert.equal(DEFAULT_MODEL_VIEWER_SCRIPT_URL, MODEL_VIEWER_CDN_SCRIPT_URL);
});

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

  assert.match(html, /@google\/model-viewer 4\.2\.0 bundled runtime/);
  assert.doesNotMatch(html, new RegExp(escapeRegExp(MODEL_VIEWER_CDN_SCRIPT_URL)));
  const modelViewerTag = getModelViewerTag(html);
  assert.match(modelViewerTag, /<model-viewer/);
  assert.match(modelViewerTag, /camera-controls/);
  assert.match(modelViewerTag, /auto-rotate/);
  assert.match(modelViewerTag, /disable-pan/);
  assert.match(modelViewerTag, /ar-modes="webxr scene-viewer"/);
  assert.match(modelViewerTag, /data-label="A&amp;B&quot;&lt;car&gt;"/);
  assert.match(
    modelViewerTag,
    /src="https:\/\/example\.com\/car\.glb\?trim=A&amp;B=&quot;&lt;SUV&gt;&quot;"/,
  );
  assert.doesNotMatch(modelViewerTag, /bad attr/);
});

test("buildModelViewerHtml allows opting into a custom model-viewer script URL", () => {
  const html = buildModelViewerHtml({
    modelUri: "car.glb",
    modelViewerScriptUrl: MODEL_VIEWER_CDN_SCRIPT_URL,
  });

  assert.match(html, new RegExp(escapeRegExp(MODEL_VIEWER_CDN_SCRIPT_URL)));
  assert.doesNotMatch(html, /@google\/model-viewer 4\.2\.0 bundled runtime/);
});

test("buildModelViewerHtml omits false booleans and sanitizes unsafe CSS colors", () => {
  const html = buildModelViewerHtml({
    autoRotate: false,
    backgroundColor: "red;background:url(https://example.com/bad)",
    cameraControls: false,
    modelUri: "car.glb",
  });

  const modelViewerTag = getModelViewerTag(html);
  assert.doesNotMatch(modelViewerTag, /camera-controls/);
  assert.doesNotMatch(modelViewerTag, /auto-rotate/);
  assert.match(html, /background: #ffffff;/);
});

test("buildModelViewerHtml supports inline model-viewer scripts without leaking closing script tags", () => {
  const html = buildModelViewerHtml({
    modelUri: "car.glb",
    modelViewerScript:
      "customElements.define('model-viewer', class extends HTMLElement {});</script><script>bad()</script>",
  });

  assert.match(html, /customElements\.define/);
  assert.doesNotMatch(html, new RegExp(escapeRegExp(MODEL_VIEWER_CDN_SCRIPT_URL)));
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

function getModelViewerTag(html) {
  const matches = [...html.matchAll(/<model-viewer[^>]*>/g)];
  assert.ok(matches.length > 0);
  return matches[matches.length - 1][0];
}
