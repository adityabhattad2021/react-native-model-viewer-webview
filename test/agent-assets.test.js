const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const packageRoot = path.resolve(__dirname, "..");
const skillRoot = path.join(
  packageRoot,
  "agent-skills",
  "react-native-model-viewer-webview",
);

function readPackageFile(...parts) {
  return fs.readFileSync(path.join(packageRoot, ...parts), "utf8");
}

function packageFileExists(...parts) {
  return fs.existsSync(path.join(packageRoot, ...parts));
}

function readSkillFile(...parts) {
  return fs.readFileSync(path.join(skillRoot, ...parts), "utf8");
}

test("package ships portable agent guidance and discovery files", () => {
  const agents = readPackageFile("AGENTS.md");
  const llms = readPackageFile("llms.txt");
  const agentUsage = readPackageFile("docs", "AGENT_USAGE.md");

  assert.match(agents, /React Native Model Viewer WebView/);
  assert.match(agents, /npm test/);
  assert.match(agents, /Keep `src` and `dist` in sync/);
  assert.doesNotMatch(agents, /mobile app/i);
  assert.doesNotMatch(agents, /mobile\//);

  assert.match(llms, /^# react-native-model-viewer-webview/m);
  assert.match(llms, /agent-skills\/react-native-model-viewer-webview\/SKILL\.md/);
  assert.match(llms, /docs\/AGENT_USAGE\.md/);

  assert.match(agentUsage, /Agent Skills/);
  assert.match(agentUsage, /AGENTS\.md/);
  assert.match(agentUsage, /llms\.txt/);
  assert.match(agentUsage, /does not automatically install/);
  assert.match(agentUsage, /~\/\.claude\/skills\/react-native-model-viewer-webview\/SKILL\.md/);
  assert.match(agentUsage, /\.claude\/skills\/react-native-model-viewer-webview\/SKILL\.md/);
  assert.match(agentUsage, /setting_sources/);
  assert.match(agentUsage, /skills="all"/);
  assert.match(agentUsage, /claude --debug/);
});

test("agent skill follows the portable SKILL.md shape", () => {
  const skill = readSkillFile("SKILL.md");
  const apiReference = readSkillFile("references", "api.md");
  const openAiMetadata = readSkillFile("agents", "openai.yaml");

  assert.match(skill, /^---\nname: react-native-model-viewer-webview/m);
  assert.match(skill, /description: .*WebView.*Filament.*React Three Fiber/s);
  assert.match(skill, /references\/api\.md/);
  assert.match(skill, /npx expo install react-native-model-viewer-webview react-native-webview/);
  assert.match(skill, /npm install react-native-model-viewer-webview react-native-webview/);
  assert.doesNotMatch(skill, /^allowed-tools:/m);

  assert.match(apiReference, /ModelViewerWebView/);
  assert.match(apiReference, /ModelSource/);
  assert.match(apiReference, /buildModelViewerHtml/);

  assert.match(openAiMetadata, /display_name: "React Native Model Viewer WebView"/);
  assert.match(
    openAiMetadata,
    /default_prompt: "Use \$react-native-model-viewer-webview/,
  );
});

test("npm package file list includes agent-facing assets", () => {
  const packageJson = JSON.parse(readPackageFile("package.json"));

  assert.ok(packageJson.files.includes("AGENTS.md"));
  assert.ok(packageJson.files.includes("llms.txt"));
  assert.ok(packageJson.files.includes("agent-skills"));
  assert.ok(packageJson.files.includes("vendor"));
  assert.ok(packageJson.files.includes("scripts"));
  assert.ok(packageJson.files.includes("THIRD_PARTY_NOTICES.md"));
});

test("vendored model-viewer runtime ships one generated copy with provenance", () => {
  const version = readPackageFile("vendor", "model-viewer", "VERSION");
  const license = readPackageFile("vendor", "model-viewer", "LICENSE");
  const source = readPackageFile("vendor", "model-viewer", "SOURCE.md");

  assert.ok(packageFileExists("vendor", "model-viewer", "runtime.js"));
  assert.ok(packageFileExists("vendor", "model-viewer", "runtime.d.ts"));
  assert.ok(packageFileExists("scripts", "generate-model-viewer-runtime.js"));
  assert.equal(packageFileExists("vendor", "model-viewer", "model-viewer.min.js"), false);
  assert.equal(packageFileExists("src", "model-viewer-runtime.ts"), false);
  assert.equal(packageFileExists("dist", "model-viewer-runtime.js"), false);
  assert.match(version, /^@google\/model-viewer 4\.2\.0$/m);
  assert.match(license, /Apache License/);
  assert.match(source, /@google\/model-viewer@4\.2\.0/);
  assert.match(source, /dist\/model-viewer\.min\.js/);
  assert.match(source, /SHA-256/);
});

test("changelog documents the current publishing release", () => {
  const packageJson = JSON.parse(readPackageFile("package.json"));
  const changelog = readPackageFile("CHANGELOG.md");

  assert.equal(packageJson.version, "0.2.0");
  assert.match(changelog, /## 0\.2\.0 - 2026-06-02/);
  assert.match(changelog, /offline-first/);
  assert.match(changelog, /@google\/model-viewer` 4\.2\.0/);
  assert.match(changelog, /## 0\.1\.0 - 2026-05-31/);
  assert.match(changelog, /Initial public release/);
  assert.match(changelog, /ModelViewerWebView/);
  assert.match(changelog, /react-native-webview` is a peer dependency/);
  assert.doesNotMatch(changelog, /## Unreleased/);
});
