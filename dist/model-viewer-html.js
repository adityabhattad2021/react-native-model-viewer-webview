const {
  BUNDLED_MODEL_VIEWER_SCRIPT,
  BUNDLED_MODEL_VIEWER_VERSION,
} = require("../vendor/model-viewer/runtime");

const MODEL_VIEWER_CDN_SCRIPT_URL =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js";
const DEFAULT_MODEL_VIEWER_SCRIPT_URL = MODEL_VIEWER_CDN_SCRIPT_URL;

const MODEL_VIEWER_DOM_READY_EVENT = "dom-ready";
const MODEL_VIEWER_LOADED_EVENT = "model-loaded";
const MODEL_VIEWER_MODEL_ERROR_EVENT = "model-error";
const MODEL_VIEWER_PAGE_ERROR_EVENT = "page-error";

function buildModelViewerHtml(options) {
  const backgroundColor = sanitizeCssColor(options.backgroundColor ?? "#ffffff");
  const posterColor = sanitizeCssColor(options.posterColor ?? backgroundColor);
  const modelViewerScriptTag = getModelViewerScriptTag(options);
  const attributes = [
    htmlAttribute("src", options.modelUri),
    htmlAttribute("camera-controls", options.cameraControls ?? true),
    htmlAttribute("auto-rotate", options.autoRotate ?? false),
    htmlAttribute("auto-rotate-delay", options.autoRotateDelay),
    htmlAttribute("rotation-per-second", options.rotationPerSecond),
    htmlAttribute("interaction-prompt", options.interactionPrompt ?? "none"),
    htmlAttribute("camera-orbit", options.cameraOrbit),
    htmlAttribute("min-camera-orbit", options.minCameraOrbit),
    htmlAttribute("max-camera-orbit", options.maxCameraOrbit),
    htmlAttribute("shadow-intensity", options.shadowIntensity),
    htmlAttribute("exposure", options.exposure),
    htmlAttribute("disable-pan", options.disablePan ?? false),
    ...Object.entries(options.additionalAttributes ?? {}).map(([name, value]) =>
      htmlAttribute(name, value),
    ),
  ].join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    ${modelViewerScriptTag}
    <script>
      function postStatus(type, message) {
        window.ReactNativeWebView &&
          window.ReactNativeWebView.postMessage(JSON.stringify({ type, message }));
      }

      window.addEventListener("error", function (event) {
        postStatus("${MODEL_VIEWER_PAGE_ERROR_EVENT}", event.message || "Page error");
      });

      window.addEventListener("unhandledrejection", function (event) {
        postStatus("${MODEL_VIEWER_PAGE_ERROR_EVENT}", String(event.reason || "Unhandled rejection"));
      });

      window.addEventListener("DOMContentLoaded", function () {
        var viewer = document.querySelector("model-viewer");
        postStatus("${MODEL_VIEWER_DOM_READY_EVENT}", "Model viewer DOM ready");

        if (!viewer) {
          postStatus("${MODEL_VIEWER_MODEL_ERROR_EVENT}", "model-viewer element was not created");
          return;
        }

        viewer.addEventListener("load", function () {
          postStatus("${MODEL_VIEWER_LOADED_EVENT}", "3D model loaded");
        });

        viewer.addEventListener("error", function (event) {
          var detail = event.detail || {};
          var sourceError = detail.sourceError || {};
          postStatus(
            "${MODEL_VIEWER_MODEL_ERROR_EVENT}",
            sourceError.message || detail.message || "3D model failed to load"
          );
        });
      });
    </script>
    <style>
      html,
      body {
        background: ${backgroundColor};
        height: 100%;
        margin: 0;
        overflow: hidden;
        width: 100%;
      }

      model-viewer {
        --poster-color: ${posterColor};
        background: ${backgroundColor};
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <model-viewer${attributes}></model-viewer>
  </body>
</html>`;
}

function parseModelViewerMessage(data) {
  try {
    const parsed = JSON.parse(data);

    if (parsed && typeof parsed.type === "string") {
      return {
        message: typeof parsed.message === "string" ? parsed.message : undefined,
        rawData: data,
        type: parsed.type,
      };
    }
  } catch {
    return {
      message: data,
      rawData: data,
      type: MODEL_VIEWER_PAGE_ERROR_EVENT,
    };
  }

  return {
    message: data,
    rawData: data,
    type: MODEL_VIEWER_PAGE_ERROR_EVENT,
  };
}

function isModelViewerErrorStatus(status) {
  return status.type.endsWith("error");
}

function getModelViewerScriptTag(options) {
  if (options.modelViewerScript) {
    return `<script type="module">${escapeScriptContent(options.modelViewerScript)}</script>`;
  }

  if (options.modelViewerScriptUrl) {
    return `<script type="module" src="${escapeHtmlAttribute(options.modelViewerScriptUrl)}"></script>`;
  }

  return `<script type="module">/* @google/model-viewer ${BUNDLED_MODEL_VIEWER_VERSION} bundled runtime */\n${escapeScriptContent(BUNDLED_MODEL_VIEWER_SCRIPT)}</script>`;
}

function htmlAttribute(name, value) {
  if (!isSafeAttributeName(name)) {
    return "";
  }

  if (value === false || value === null || value === undefined) {
    return "";
  }

  if (value === true) {
    return ` ${name}`;
  }

  return ` ${name}="${escapeHtmlAttribute(String(value))}"`;
}

function isSafeAttributeName(name) {
  return /^[a-zA-Z][\w:.-]*$/.test(name);
}

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeScriptContent(value) {
  return value.replace(/<\/script/gi, "<\\/script");
}

function sanitizeCssColor(value) {
  if (/^[#(),.%\w\s-]+$/.test(value)) {
    return value;
  }

  return "#ffffff";
}

exports.DEFAULT_MODEL_VIEWER_SCRIPT_URL = DEFAULT_MODEL_VIEWER_SCRIPT_URL;
exports.MODEL_VIEWER_CDN_SCRIPT_URL = MODEL_VIEWER_CDN_SCRIPT_URL;
exports.BUNDLED_MODEL_VIEWER_VERSION = BUNDLED_MODEL_VIEWER_VERSION;
exports.MODEL_VIEWER_DOM_READY_EVENT = MODEL_VIEWER_DOM_READY_EVENT;
exports.MODEL_VIEWER_LOADED_EVENT = MODEL_VIEWER_LOADED_EVENT;
exports.MODEL_VIEWER_MODEL_ERROR_EVENT = MODEL_VIEWER_MODEL_ERROR_EVENT;
exports.MODEL_VIEWER_PAGE_ERROR_EVENT = MODEL_VIEWER_PAGE_ERROR_EVENT;
exports.buildModelViewerHtml = buildModelViewerHtml;
exports.isModelViewerErrorStatus = isModelViewerErrorStatus;
exports.parseModelViewerMessage = parseModelViewerMessage;
