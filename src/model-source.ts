import { Image } from "react-native";
import type { ImageSourcePropType } from "react-native";

export type ModelSource =
  | string
  | number
  | {
      localUri?: null | string;
      uri?: null | string;
    };

export function resolveModelSourceUri(modelSource: ModelSource): string {
  if (typeof modelSource === "string") {
    return modelSource;
  }

  if (
    typeof modelSource === "object" &&
    modelSource.localUri &&
    modelSource.localUri.length > 0
  ) {
    return modelSource.localUri;
  }

  if (
    typeof modelSource === "object" &&
    modelSource.uri &&
    modelSource.uri.length > 0
  ) {
    return modelSource.uri;
  }

  const resolved = Image.resolveAssetSource(modelSource as ImageSourcePropType);
  if (resolved?.uri) {
    return resolved.uri;
  }

  throw new Error("Unable to resolve model source URI.");
}
