export declare const DEFAULT_MODEL_VIEWER_SCRIPT_URL = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js";
export declare const MODEL_VIEWER_DOM_READY_EVENT = "dom-ready";
export declare const MODEL_VIEWER_LOADED_EVENT = "model-loaded";
export declare const MODEL_VIEWER_MODEL_ERROR_EVENT = "model-error";
export declare const MODEL_VIEWER_PAGE_ERROR_EVENT = "page-error";

export type ModelViewerStatus = {
  message?: string;
  rawData?: string;
  type: string;
};

export type ModelViewerHtmlOptions = {
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

export declare function buildModelViewerHtml(options: ModelViewerHtmlOptions): string;
export declare function parseModelViewerMessage(data: string): ModelViewerStatus;
export declare function isModelViewerErrorStatus(status: ModelViewerStatus): boolean;
