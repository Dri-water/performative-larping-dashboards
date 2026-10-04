# AGENTS.md

An open-source Agent Skill (Agent Skills format) for extravagantly visual dashboards of **real** activity, plus legacy synthetic Three.js/Vite rendering studies. The product is the skill; the examples are evidence. Overview: [README.md](README.md). Contribution rules: [CONTRIBUTING.md](CONTRIBUTING.md).

## Layout

- `skills/performative-larping-dashboards/` — the skill. `SKILL.md` is the entrypoint; `references/*.md` (real-work, construction, quality, toolkit, ...), `assets/director.mjs` + `assets/optics.mjs`, `scripts/capture.mjs`, `agents/openai.yaml`. Keep it self-contained and portable: all references stay inside this directory.
- `examples/xenolith/` — main legacy exhibit (also `?world=market` = Basilisk). Has `npm run verify`.
- `examples/abyss/` — synthetic order-flow study; verify with `node verify.mjs`.
- `examples/bureau/` — early lightweight prototype, not the benchmark.
- `evals/abyss/`, `evals/vesper/` — runnable source snapshots from evaluations; treat as records, don't modernize them.
- `docs/` — committed evidence (GIFs, stills, check JSON), [docs/validation.md](docs/validation.md), [docs/evaluation/README.md](docs/evaluation/README.md).

There is no root `package.json`; each example/eval is its own npm project with a pinned lockfile (three 0.186.1, vite 8.3.2, playwright 1.63.0).

## Commands (run inside an example directory)

```sh
npm ci
npm run dev            # vite --host 127.0.0.1 (vesper pins --port 5192)
npm run build          # static bundle in dist/ (ignored)
npx playwright install chromium
npm run verify         # xenolith, bureau: node verify.mjs
node verify.mjs        # abyss: needs the dev server on :5231 (npm run dev -- --port 5231) or ABYSS_URL
```

Capture frames for any exhibit that honours `?t=seconds`:
`node <skill>/scripts/capture.mjs --url=http://127.0.0.1:5173 --out=visual-review --times=0,8,12,17,22 --record=24` (Playwright must be installed in the target project).

Exhibit URL controls: `?t=12` freeze at a moment, `&hud=0` hide instruments, `?fallback=1` static fallback, `?world=market`.

## Constraints

- **Exaggerate visuals, preserve facts.** New dashboards must be driven by observed data with a source-to-visual contract, traffic audit, count reconciliation, and honest quiet/stale/disconnected states. Never fabricate activity, throughput, or outcomes.
- Existing examples are **legacy synthetic studies** and must stay labelled as such; don't present them as validated real-data dashboards.
- Pin versions and commit lockfiles for executable examples. Toolkit changes need evidence level (documented / example-tested / device-tested); never call a route tested because docs exist.
- No credentials, copyrighted reference screenshots, unlicensed models, or misleading live/P&L claims.
- `.editorconfig`: UTF-8, LF, 2-space indent, final newline.

## Verification

For visual changes: build, run verify, and actually inspect desktop and portrait screenshots plus a paused frame (exit code alone is not enough). Evidence goes to ignored `test-results/`. State whether video export or physical-device behaviour was tested. Keep claims in docs proportional to what was observed.
