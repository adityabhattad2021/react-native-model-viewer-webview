export type ModelSource =
  | string
  | number
  | {
      localUri?: null | string;
      uri?: null | string;
    };

export declare function resolveModelSourceUri(modelSource: ModelSource): string;
