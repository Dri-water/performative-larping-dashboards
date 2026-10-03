# Verification and visual review

> **Legacy synthetic evidence:** this material predates the real-work requirement.
> It demonstrates rendering/simulation behavior, not a source-connected useful
> dashboard. It does not satisfy the current skill's data-fidelity gate.

Verified 2026-10-03 on Windows, Node 24.14.1, Three.js 0.186.1, Vite 8.3.2,
Playwright 1.63.0. Resolved versions are in the example's lockfile.

## What changed after the first example failed the brief

The Bureau was rejected as an ordinary dashboard containing beginner-level 3D.
The revision changes both the production instructions and the reference artifact:

- A full-viewport environment replaces the boxed hero / metric-card composition.
- A layered mechanical assembly replaces the small orbiting primitive characters.
- Instanced surface detail, articulated shrouds, shader fields, optical layers,
  projected instruments, and a staged transformation supply several scales of activity.
- A finance study changes the hero to an oblique order-book landscape. The skill
  no longer makes agents, characters, or real information utility prerequisites.
- Non-compensating visual gates replace the earlier aggregate score. Passing
  controls and tests cannot make up for a weak visual result.

## Rendered visual evidence

Inspected the actual desktop and portrait renders, hero without HUD, five phase
captures (0, 8, 12, 17, 22 seconds), and a contact sheet extracted across a complete
live-playback recording. The committed GIF is an excerpt of that recording.

Specific observed revisions:

1. The initial outer architecture read as unrelated crossing beams. Replaced it
   with peripheral structural modules so the central assembly owns the frame.
2. Several portrait station labels overlapped. Introduced explicit label lanes and
   leaders; automated rectangle checks confirm no station-to-station overlaps.
3. Early ignition mostly changed brightness. Increased rotor articulation and depth
   separation, added an emerging geometric signal and traveling release wavefronts.

Editorial observations, not an automatic artistic certification:

| Gate | Observed evidence |
|---|---|
| Silhouette / craft | HUD-free render retains a layered housing, shrouds, several internal rotors, and fine fittings |
| Frame ownership / scale | Machinery fills the principal frame; foreground rails and distant structure establish depth |
| Continuous performance | Field particles, filament traffic, counter-rotation, instrument traces, opening geometry, and release waves share the timeline |
| Multiple detail scales | Architectural silhouette, intermediate assemblies, instanced microstructure, and fine optical marks coexist |
| Social composition | Actual desktop/portrait captures and a 13-second moving excerpt are committed |
| Subject transfer | Basilisk uses book strata, a price river, moving slice, and flow particles without agents |

This remains a procedural browser aesthetic. Bespoke sculpted assets, a film-grade
composite, or sound design could take it further. A user's reaction remains the
artistic authority; these observations cannot guarantee awe or every model's output.

## Functional evidence

`npm run build` and `npm run verify` passed. Browser checks exercised:

- WebGL initialization and no page/shader console errors.
- Five phase captures and a full 24-second authored cycle.
- Byte-identical paused screenshots and screenshots reconstructed after arbitrary seeking.
- Station selection, scenario intensity, pause/resume, climax, and freeze URL.
- Portrait horizontal fit and station-label collision checks.
- Reduced-motion held frame.
- Forced SVG fallback and actual loss via WEBGL_lose_context.
- Finance route labels/state and desktop/portrait captures.

A targeted follow-up verified the context-loss status updates even while paused
and the finance fallback uses a finance composition.

The portable skill capture helper was run from the target project with two
timestamps, two viewports, and a two-second live recording. Skill metadata passed
the skill-creator validator with Python UTF-8 mode. Relative Markdown links in
the package were checked for missing local targets.

## Performance evidence

The final recorded run used HeadlessChrome 153 with ANGLE / Direct3D11 on an
**NVIDIA GeForce RTX 3090**, at 1440×900, DPR 1. The final 180-frame sample reported:

- Mean requestAnimationFrame interval: **16.666 ms**, approximately 60 fps.
- Mean JavaScript frame work: **1.984 ms**; this is not a GPU duration.
- Last-frame aggregate: 301 draw calls, 104,650 triangles, 11,100 points, including
  postprocessing. Counts vary with visible effects.

The initial default headless run used SwiftShader and was substantially slower.
The Windows verifier explicitly selects Direct3D11; other platforms use their
browser default. Do not generalize this high-end desktop result to phones.

Raw hardware-run report: [xenolith-verification.json](xenolith-verification.json).

## Reproduce

From `examples/xenolith`:

```sh
npm ci
npx playwright install chromium
npm run build
npm run verify
```

Screenshots, report, and full-cycle WebM are saved under ignored `test-results/`.
For the portable helper, start the dev server and run from the example directory:

```sh
node ../../skills/performative-larping-dashboards/scripts/capture.mjs --url=http://127.0.0.1:5173 --out=test-results/review --times=0,8,12,17,22 --record=24
```

Use the port printed by your server. The helper uses the default headless renderer;
the example verifier records the renderer actually used for its performance run.

## Limits

- The primary examples are one author's implementations. Separate fresh-context
  finance and weather exercises, including a failed first attempt and the changes
  it prompted, are recorded in the [independent evaluation](evaluation/README.md).
  These are limited transfer exercises, not a statistical multi-model benchmark.
- No Safari, Firefox, physical mobile GPU, native, Blender, or Remotion integration
  was tested. Those recipes remain documented recommendations.
- Context-loss fallback is tested; automatic GPU-context restoration is not implemented.
- Local system fonts can differ across OSes. Exact pixels are reproducible within
  the tested browser/OS/renderer, not promised across graphics drivers.
- Build emits a chunk-size advisory for the Three.js/postprocessing bundle
  (approximately 627 kB minified / 162 kB gzip). Build succeeds.
- npm audit reported zero known vulnerabilities at installation time.
- All telemetry and apparent operations are fictional.

The legacy Bureau previously passed its own functional checks, but those checks
did not establish visual quality. It is retained for comparison, not as the benchmark.
