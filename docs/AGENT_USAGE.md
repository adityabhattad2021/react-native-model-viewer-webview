# AI Agent Usage

This package ships agent-facing context so AI coding agents can integrate it
without guessing at the API shape or overselling the package.

## What We Ship

- `AGENTS.md`: package-level instructions for coding agents working inside this
  repository or an unpacked npm tarball.
- `llms.txt`: a compact documentation index agents can read before choosing
  deeper files.
- `agent-skills/react-native-model-viewer-webview/SKILL.md`: a portable Agent
  Skill for tools that support filesystem skills.
- `agent-skills/react-native-model-viewer-webview/references/api.md`: a smaller
  API reference loaded only when the skill needs it.
- `agent-skills/react-native-model-viewer-webview/agents/openai.yaml`:
  UI-facing metadata for OpenAI/Codex-style skill lists.

## Current Conventions

Agent Skills use a directory containing `SKILL.md` with YAML frontmatter and
Markdown instructions. The public Agent Skills specification defines `name` and
`description` as required fields, plus optional resources such as `references`,
`scripts`, and `assets`. Claude Code documents the same `SKILL.md` workflow and
project/personal skill locations.

`AGENTS.md` is the cross-agent repository instruction file. It is plain Markdown
and is intended to hold build commands, test commands, code style, security
notes, and package-specific constraints.

`llms.txt` is an emerging Markdown index convention for LLM-readable docs. It is
useful because it gives agents a curated map of the docs, but it is not a W3C or
IETF standard and no package manager automatically wires it into agent clients.

Useful references:

- Agent Skills overview: https://agentskills.io/
- Agent Skills specification: https://agentskills.io/specification
- Claude Code skills docs: https://code.claude.com/docs/en/skills
- AGENTS.md format: https://agents.md/
- llms.txt reference: https://llmtxt.info/

## Claude Code Support

Installing the npm package does not automatically install a skill into a user's
agent. That is intentional: agent clients keep skills in their own trusted
locations, and users should review third-party skills before enabling them.

Claude Code supports this skill because it is a directory containing
`SKILL.md` with YAML frontmatter, Markdown instructions, and optional supporting
files. We do not use `allowed-tools` in the skill frontmatter, because Claude
Code supports it but the Claude Agent SDK handles tool access through SDK
options instead.

Personal Claude Code install:

```bash
mkdir -p ~/.claude/skills
cp -R node_modules/react-native-model-viewer-webview/agent-skills/react-native-model-viewer-webview ~/.claude/skills/
ls ~/.claude/skills/react-native-model-viewer-webview/SKILL.md
```

Project Claude Code install, for teams that want to commit the skill into an app
repository:

```bash
mkdir -p .claude/skills
cp -R node_modules/react-native-model-viewer-webview/agent-skills/react-native-model-viewer-webview .claude/skills/
ls .claude/skills/react-native-model-viewer-webview/SKILL.md
```

After installing, ask Claude Code:

```text
What Skills are available?
```

or invoke it directly:

```text
/react-native-model-viewer-webview add a GLB preview to this Expo screen
```

If Claude does not list or use the skill, verify the filesystem path and run:

```bash
claude --debug
```

Claude Agent SDK users should make sure user or project settings are loaded and
the skill is enabled. In Python SDK terms, that means `setting_sources` includes
`"user"` or `"project"` and `skills="all"` or a list containing
`"react-native-model-viewer-webview"`.

## Other Agent Clients

After installing the package, users can copy or symlink the skill folder into
their agent's supported skills directory.

Codex-style clients that support filesystem skills can use the same skill folder
from their configured skills directory. If the client does not support skills,
point the agent at `llms.txt`, `AGENTS.md`, and the package README instead.

## What Agents Should Do

When a user asks to add this package to a React Native or Expo app:

1. Confirm the requirement is a simple GLB/glTF preview, not a native 3D engine.
2. Install `react-native-model-viewer-webview` and `react-native-webview`.
3. Use `modelSource` for URLs, static asset module numbers, file/data URIs, or
   Expo asset-like objects.
4. For local `.glb` or `.gltf` imports, add those extensions to Metro asset
   extensions.
5. Use `onModelLoaded`, `onModelError`, and `onStatus` for instrumentation.
6. Recommend Filament, React Three Fiber Native, Three.js, or Expo GLView when
   the user needs native rendering or full scene control.

## Maintenance Checklist

- Keep `SKILL.md` concise and put detailed API material in `references/api.md`.
- Keep `agents/openai.yaml` in sync with `SKILL.md`.
- Keep `llms.txt` links aligned with published docs.
- Keep `AGENTS.md` aligned with package scripts and release policy.
- Run `npm test` after changing agent assets; tests pin the expected files.
