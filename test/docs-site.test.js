const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const packageRoot = path.resolve(__dirname, "..");
function read(...parts) {
  return fs.readFileSync(path.join(...parts), "utf8");
}

test("docs site contains complete package guidance", () => {
  const html = read(packageRoot, "docs-site", "index.html");
  const css = read(packageRoot, "docs-site", "styles.css");

  assert.match(html, /react-native-model-viewer-webview/);
  assert.match(html, /npx expo install react-native-model-viewer-webview react-native-webview/);
  assert.match(html, /npm install react-native-model-viewer-webview react-native-webview/);
  assert.match(html, /Quick start/);
  assert.match(html, /Remote GLB/);
  assert.match(html, /Local GLB/);
  assert.match(html, /Expo Asset/);
  assert.match(html, /Offline script loading/);
  assert.match(html, /Events and errors/);
  assert.match(html, /AI agent support/);
  assert.match(html, /Claude Code/);
  assert.match(html, /Use-case ideas/);
  assert.match(html, /Vehicle inspection/);
  assert.match(html, /Furniture and home decor/);
  assert.match(html, /Limitations/);
  assert.match(html, /github\.com/);

  assert.match(html, /<model-viewer/);
  assert.match(html, /JetBrains\+Mono/);
  assert.doesNotMatch(html, /cars-24-hackathon/);
  assert.doesNotMatch(html, /Inspection Copilot/);
  assert.doesNotMatch(html, /mobile integration/i);
  assert.match(html, /class="docs-shell"/);
  assert.match(html, /class="docs-sidebar"/);
  assert.match(html, /class="docs-main"/);
  assert.match(html, /class="toc-panel"/);
  assert.doesNotMatch(html, /hero-actions/);
  assert.doesNotMatch(html, /Get started/);
  assert.doesNotMatch(html, /Check fit/);
  assert.match(css, /\.docs-shell/);
  assert.match(css, /\.docs-sidebar/);
  assert.match(css, /\.use-case-grid/);
  assert.match(css, /--background: #F6F7F2/);
  assert.match(css, /--camera: #101820/);
  assert.match(css, /--ai: #D7F85C/);
  assert.match(css, /JetBrains Mono/);
});

test("docs site CSS guards against mobile horizontal overflow", () => {
  const css = read(packageRoot, "docs-site", "styles.css");

  assert.match(css, /body\s*{[^}]*overflow-x: hidden;/s);
  assert.match(css, /\.brand\s*{[^}]*min-width: 0;/s);
  assert.match(css, /\.brand span:last-child\s*{[^}]*overflow-wrap: anywhere;/s);
  assert.match(css, /pre\s*{[^}]*max-width: 100%;/s);
  assert.match(css, /pre code\s*{[^}]*white-space: pre-wrap;/s);
  assert.match(css, /\.docs-main\s*{[^}]*min-width: 0;/s);
  assert.match(css, /\.preview-example\s*{[^}]*min-width: 0;/s);
  assert.match(css, /\.use-case-grid article\s*{[^}]*min-width: 0;/s);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*\.site-nav a\s*{[^}]*font-size: 0\.82rem;/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*h1\s*{[^}]*font-size: clamp\(1\.75rem, 10vw, 2\.25rem\);/);
});

test("docs site includes SEO and answer-engine metadata", () => {
  const html = read(packageRoot, "docs-site", "index.html");
  const robots = read(packageRoot, "docs-site", "robots.txt");
  const sitemap = read(packageRoot, "docs-site", "sitemap.xml");

  assert.match(
    html,
    /<title>React Native Model Viewer WebView \| GLB\/glTF previews for Expo<\/title>/,
  );
  assert.match(html, /<link rel="canonical" href="https:\/\/adityabhattad\.github\.io\/react-native-model-viewer-webview\/" \/>/);
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/);
  assert.match(html, /<meta property="og:title" content="React Native Model Viewer WebView" \/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/adityabhattad\.github\.io\/react-native-model-viewer-webview\/og-image\.svg" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /"@type": "SoftwareApplication"/);
  assert.match(html, /"@type": "SoftwareSourceCode"/);
  assert.match(html, /"@type": "FAQPage"/);
  assert.match(html, /"name": "How do I install react-native-model-viewer-webview\?"/);
  assert.match(html, /id="answers"/);
  assert.match(html, /Direct answers/);

  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/adityabhattad\.github\.io\/react-native-model-viewer-webview\/sitemap\.xml/);

  assert.match(sitemap, /<loc>https:\/\/adityabhattad\.github\.io\/react-native-model-viewer-webview\/<\/loc>/);
  assert.match(sitemap, /<lastmod>2026-05-31<\/lastmod>/);
});

test("github pages workflow deploys the docs site with official pages actions", () => {
  const workflow = read(
    packageRoot,
    ".github",
    "workflows",
    "pages.yml",
  );

  assert.match(workflow, /name: Deploy react-native-model-viewer-webview docs/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /docs-site/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
});
