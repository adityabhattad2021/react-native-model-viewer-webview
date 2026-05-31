function resolveModelSourceUri(modelSource) {
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

  const { Image } = require("react-native");
  const resolved = Image.resolveAssetSource(modelSource);
  if (resolved?.uri) {
    return resolved.uri;
  }

  throw new Error("Unable to resolve model source URI.");
}

exports.resolveModelSourceUri = resolveModelSourceUri;
