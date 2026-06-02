#!/usr/bin/env node

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MODEL_VIEWER_PACKAGE = "@google/model-viewer";
const MODEL_VIEWER_VERSION = "4.2.0";
const packageRoot = path.resolve(__dirname, "..");
const vendorRoot = path.join(packageRoot, "vendor", "model-viewer");

function main() {
  const packageDir =
    process.env.MODEL_VIEWER_PACKAGE_DIR || downloadModelViewerPackage();
  const runtimeSourcePath = path.join(packageDir, "dist", "model-viewer.min.js");
  const licensePath = path.join(packageDir, "LICENSE");

  const runtimeSource = fs.readFileSync(runtimeSourcePath, "utf8");
  const license = fs.readFileSync(licensePath, "utf8");
  const runtimeHash = sha256(runtimeSource);
  const packageHash = findPackageHash(packageDir);

  fs.mkdirSync(vendorRoot, { recursive: true });
  fs.writeFileSync(
    path.join(vendorRoot, "runtime.js"),
    [
      `"use strict";`,
      "",
      `const BUNDLED_MODEL_VIEWER_VERSION = ${JSON.stringify(MODEL_VIEWER_VERSION)};`,
      `const BUNDLED_MODEL_VIEWER_SCRIPT = ${JSON.stringify(runtimeSource)};`,
      "",
      "exports.BUNDLED_MODEL_VIEWER_VERSION = BUNDLED_MODEL_VIEWER_VERSION;",
      "exports.BUNDLED_MODEL_VIEWER_SCRIPT = BUNDLED_MODEL_VIEWER_SCRIPT;",
      "",
    ].join("\n"),
  );
  fs.writeFileSync(
    path.join(vendorRoot, "runtime.d.ts"),
    [
      `export declare const BUNDLED_MODEL_VIEWER_VERSION = ${JSON.stringify(MODEL_VIEWER_VERSION)};`,
      "export declare const BUNDLED_MODEL_VIEWER_SCRIPT: string;",
      "",
    ].join("\n"),
  );
  fs.writeFileSync(path.join(vendorRoot, "LICENSE"), license);
  fs.writeFileSync(
    path.join(vendorRoot, "VERSION"),
    `${MODEL_VIEWER_PACKAGE} ${MODEL_VIEWER_VERSION}\n`,
  );
  fs.writeFileSync(
    path.join(vendorRoot, "SOURCE.md"),
    buildSourceNotice({ packageHash, runtimeHash, runtimeSource }),
  );
}

function downloadModelViewerPackage() {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "react-native-model-viewer-webview-"),
  );
  const packResult = childProcess.spawnSync(
    "npm",
    ["pack", `${MODEL_VIEWER_PACKAGE}@${MODEL_VIEWER_VERSION}`, "--pack-destination", tempDir],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );

  if (packResult.status !== 0) {
    throw new Error(packResult.stderr || packResult.stdout || "npm pack failed");
  }

  const tarballPath = fs
    .readdirSync(tempDir)
    .filter((fileName) => fileName.endsWith(".tgz"))
    .map((fileName) => path.join(tempDir, fileName))[0];

  if (!tarballPath) {
    throw new Error("npm pack did not produce a .tgz file");
  }

  const tarResult = childProcess.spawnSync(
    "tar",
    ["-xzf", tarballPath, "-C", tempDir],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );

  if (tarResult.status !== 0) {
    throw new Error(tarResult.stderr || tarResult.stdout || "tar extraction failed");
  }

  return path.join(tempDir, "package");
}

function findPackageHash(packageDir) {
  const parentDir = path.dirname(packageDir);
  const tarballPath = fs
    .readdirSync(parentDir)
    .filter((fileName) => fileName.endsWith(".tgz"))
    .map((fileName) => path.join(parentDir, fileName))[0];

  if (!tarballPath) {
    return undefined;
  }

  return sha256(fs.readFileSync(tarballPath));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function buildSourceNotice({ packageHash, runtimeHash, runtimeSource }) {
  const packageHashLine = packageHash
    ? `- Package tarball SHA-256: \`${packageHash}\``
    : "- Package tarball SHA-256: not recorded; regenerate from an npm tarball to update this value.";

  return [
    "# Vendored model-viewer Runtime",
    "",
    `This directory vendors ${MODEL_VIEWER_PACKAGE}@${MODEL_VIEWER_VERSION} so the default`,
    "`ModelViewerWebView` runtime can load inside a React Native WebView without",
    "fetching Google's CDN script at render time.",
    "",
    "## Source",
    "",
    `- Package: \`${MODEL_VIEWER_PACKAGE}@${MODEL_VIEWER_VERSION}\``,
    `- npm: <https://www.npmjs.com/package/${MODEL_VIEWER_PACKAGE}/v/${MODEL_VIEWER_VERSION}>`,
    "- Repository: <https://github.com/google/model-viewer>",
    "- Source file: `dist/model-viewer.min.js`",
    packageHashLine,
    `- Source file SHA-256: \`${runtimeHash}\``,
    `- Source file bytes: \`${Buffer.byteLength(runtimeSource, "utf8")}\``,
    "",
    "## Generated Files",
    "",
    "- `runtime.js` embeds `dist/model-viewer.min.js` as a CommonJS string export.",
    "- `runtime.d.ts` exposes the generated runtime constants to TypeScript.",
    "- `LICENSE` contains the upstream Apache-2.0 license text.",
    "- `VERSION` records the exact upstream package version.",
    "",
    "Regenerate these files with:",
    "",
    "```bash",
    "npm run generate:model-viewer-runtime",
    "```",
    "",
  ].join("\n");
}

main();
