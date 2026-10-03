# Reference exhibit verification

Verified on Windows, 2026-10-03, Node 24.14.1, with the committed npm lockfile.

- Agent Skill metadata: passed the skill-creator validator.
- Production bundle: `npm run build` passed. Vite reports a chunk-size advisory
  for the Three.js bundle (approximately 554 kB minified, 140 kB gzip).
- `npm run verify`: Chromium WebGL, 1500px desktop and 390px portrait, no horizontal
  overflow, specialist selection, scenario changes, pause/resume, reset, frozen
  timestamp, reduced motion, and forced SVG fallback passed; no page errors.
- Desktop and portrait screenshots were visually inspected. The README screenshot
  is the actual browser render at `?t=8`, not an image-generation mockup.
- npm installation audit reported zero known vulnerabilities at verification time.

The fallback test forces the fallback route; it does not emulate every GPU failure.
No Safari, Firefox, physical mobile GPU, native, Blender, or Remotion integration
was tested. Those production recipes are documented recommendations. This is a
procedural browser exhibit; all telemetry is simulated.

Reproduce from `examples/bureau`: `npm ci`, `npx playwright install chromium`,
`npm run build`, `npm run verify`. Screenshots land in ignored `test-results/`.
