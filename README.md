# Performative Larping Dashboards

**Make a screen that looks expensive enough to require its own power station.**

An open-source Agent Skill for continuously animated, extravagantly overproduced
dashboards. Finance, trading, science, infrastructure, agents, or pure fiction.
The purpose is sensory spectacle: monumental forms, intricate detail, connected
motion, optical effects, and recurring transformations that make people keep watching.

Agents are optional. Useful information is optional. The visual experience is the product.

![Xenolith — actual browser playback](docs/xenolith-loop.gif)

*Xenolith: procedural machinery, articulated containment, counter-rotating optics,
GPU fields, projected instruments, and a 24-second performance. The GIF is a
13-second excerpt of browser playback, not a generated mockup.*

[Full-resolution playback excerpt](docs/xenolith.mp4) ·
[Still](docs/xenolith.png) · [Portrait](docs/xenolith-portrait.png)

## Install the skill

Copy the complete `skills/performative-larping-dashboards/` directory into your
agent's skill directory: for example `.agents/skills/` in a compatible project,
`~/.codex/skills/`, or `~/.claude/skills/`. References, assets, and scripts stay
inside the skill. Other agents can read its `SKILL.md` directly.

This follows the [Agent Skills format](https://agentskills.io/specification).
It is a skill, not an MCP server. Loading it does not install tools or publish anything.

Example request:

> Use performative-larping-dashboards to make a fictional trading terminal.
> A monumental liquidity canyon, impossibly dense instrumentation, cascading
> price ribbons, and a recurring market shock that physically transforms the scene.
> Go all in on visual spectacle. Include desktop and portrait compositions.

## What the skill supplies

- A **shot-first production workflow**, from silhouette and materials to fine
  geometry, instruments, motion, and rendered critique.
- A **maintained recommendation sheet** for HTML, React, native, 3D assets, and film export.
- **Domain-to-spectacle recipes** that avoid turning every subject into agent circles.
- **Rendering techniques** for dense assemblies, GPU fields, optics, and attached labels.
- A **reusable director module** for deterministic time, phase envelopes, and seeking.
- A **capture script** for desktop/portrait frames and live playback.
- **Visual rejection gates**: a small 3D ornament in a conventional dashboard fails,
  even if its tests pass.

Start with [SKILL.md](skills/performative-larping-dashboards/SKILL.md).
The [toolkit](skills/performative-larping-dashboards/references/toolkit.md) distinguishes
tested combinations from documented recommendations. The
[construction playbook](skills/performative-larping-dashboards/references/construction.md)
and [visual gates](skills/performative-larping-dashboards/references/quality.md) define
the production standard.

## Run the exhibits

```sh
cd examples/xenolith
npm ci
npm run dev
```

Open the localhost address printed by Vite:

| URL suffix | Exhibit / control |
|---|---|
| `/` | Xenolith — non-human cognition vessel |
| `/?world=market` | Basilisk — simulated liquidity canyon |
| `/?t=12` | Hold an exact moment |
| `/?t=12&hud=0` | Inspect the scene without instruments |
| `/?fallback=1` | Exercise the static graphics fallback |

No API keys, remote assets, or paid services are required. All telemetry is
fictional. Pause, scenario, inspection, climax, and freeze-frame controls work.
Reduced motion holds a developed frame. Portrait uses its own staging and label lanes.

![Basilisk — simulated market microstructure](docs/basilisk.png)

*Basilisk changes the physical metaphor to order-book strata and flowing price
ribbons. It shares the renderer and instrument shell; it is a transfer study,
not an independent agent evaluation.*

`npm run build` produces a static bundle. To verify:

```sh
npx playwright install chromium
npm run verify
```

Checks cover deterministic pixels, controls, portrait fit, reduced motion, context
loss, and a full-cycle recording. Evidence goes to ignored `test-results/`.
See [verification and visual review](docs/validation.md) for actual observations,
renderer/performance, and limitations.

The earlier [Bureau example](examples/bureau) remains available as a lightweight
prototype. It is **not the current spectacle benchmark**.

## Standard packaging, opinionated craft

```text
skills/performative-larping-dashboards/
  SKILL.md
  agents/openai.yaml
  references/
  assets/director.mjs
  scripts/capture.mjs
examples/
  xenolith/
  bureau/
docs/
LICENSE
CONTRIBUTING.md
```

Three.js / Vite / HTML-SVG is the tested browser route. React Three Fiber, native
stacks, Blender, and Remotion have documented recipes and distinct use cases.
Blender helps with bespoke assets; Remotion helps with edited, exact-frame film
exports. They are optional, not ritual dependencies.

An agent host normally coordinates separate MCP tools. A server can act as an MCP
client, but a Markdown reference does not establish that connection. The
[production guide](skills/performative-larping-dashboards/references/production.md)
defines artifact handoffs and the boundary.

Awe is subjective. This repo supplies a reproducible process and inspectable
examples; it does not claim one prompt guarantees the same artistic result from
every model. [Contributions](CONTRIBUTING.md) should improve actual rendered output.

MIT. Maximum ceremony.
