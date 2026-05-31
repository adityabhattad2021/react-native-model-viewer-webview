const assert = require("node:assert/strict");
const Module = require("node:module");
const test = require("node:test");

const { resolveModelSourceUri } = require("../dist");

test("resolveModelSourceUri returns string model sources unchanged", () => {
  assert.equal(resolveModelSourceUri("https://example.com/car.glb"), "https://example.com/car.glb");
});

test("resolveModelSourceUri prefers localUri over uri for asset-like objects", () => {
  assert.equal(
    resolveModelSourceUri({
      localUri: "file:///cache/car.glb",
      uri: "https://example.com/car.glb",
    }),
    "file:///cache/car.glb",
  );
});

test("resolveModelSourceUri falls back to uri when localUri is missing", () => {
  assert.equal(
    resolveModelSourceUri({
      uri: "https://example.com/car.glb",
    }),
    "https://example.com/car.glb",
  );
});

test("resolveModelSourceUri resolves React Native asset module numbers", () => {
  withReactNativeImageMock(
    {
      resolveAssetSource(source) {
        assert.equal(source, 42);
        return { uri: "asset:///car.glb" };
      },
    },
    () => {
      assert.equal(resolveModelSourceUri(42), "asset:///car.glb");
    },
  );
});

test("resolveModelSourceUri throws when React Native cannot resolve a source", () => {
  withReactNativeImageMock(
    {
      resolveAssetSource() {
        return null;
      },
    },
    () => {
      assert.throws(
        () => resolveModelSourceUri(99),
        /Unable to resolve model source URI/,
      );
    },
  );
});

function withReactNativeImageMock(imageMock, callback) {
  const originalLoad = Module._load;

  Module._load = function load(request, parent, isMain) {
    if (request === "react-native") {
      return { Image: imageMock };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    callback();
  } finally {
    Module._load = originalLoad;
  }
}
