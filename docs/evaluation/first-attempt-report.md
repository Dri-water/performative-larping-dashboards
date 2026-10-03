# Forward-test report: ABYSS

Run `npm ci`, then `npm run dev -- --port 5197`. Build: `npm run build`. Verification: `node verify.mjs`; deterministic isolated test: `node seek.mjs`; contact sheet: `python contact.py`. Server currently at http://127.0.0.1:5197 . No publication or commits were made.

## Skill effect

Read only SKILL.md and its art-direction, toolkit, HTML, construction, choreography, quality and rendering references. Did not inspect examples or existing preview/docs artifacts. The skill directly guided the financial liquidity-canyon metaphor; architecture/assemblies/fine edges; blue bid versus copper sell materials; crossing trade filaments; a common 20-second geometric rupture score; separate portrait camera; fixed-time captures; and explicit fictional-data disclosure. Used the named pinned vanilla Three/Vite toolchain without adding unrelated libraries.

## Observations and repairs

1. First render's floor dominated and appeared blue-grey. Explicit black scene background, darker fog and 12% floor opacity restored negative space and material separation.
2. Thin central paths did not carry the focal read. Thickened selected tubes and used HDR ivory emission, creating a stronger foreground ribbon.
3. Actual screenshots revealed mojibake. Added UTF-8 metadata and saved text as UTF-8. Portrait text and controls now fit without horizontal overflow.

The final result is a working, authored 3D financial exhibit, but it DOES NOT fully meet the skill's default sensory-overload ambition. The silhouette is distinct and portrait owns the frame. Nevertheless desktop has too much empty upper space; the repeated strata lack sufficiently varied intermediate assemblies; and rupture changes spacing/height but is not an extraordinary five-second transformation. The surface is still predominantly linework instead of rich material depth. These are weak scale/craft, performance and social gates, not offset by successful checks. Another visual pass should rebuild the hero rather than add more labels or glow.

## Actual evidence

- `captures/desktop-{0,6,11,18}.png`: 1440 x 900.
- `captures/portrait-{0,6,11,18}.png`: 430 x 900, different camera and reduced peripheral content.
- `captures/hero-first.png`: HUD-hidden scene after optical repair.
- `captures/contact-sheet.png`: inspected opening/build/rupture/recovery comparison.
- `captures/video/page@094688cd20b176ed87ce5d65f5c0c9e7.webm`: actual browser recording (includes capture/test setup before uninterrupted playback).
- `captures/playback-sheet.png`: extracted sequential video frames, inspected. Continuous process motion and gradual wall separation visible; no dramatic surprise reveal.
- `captures/checks.json`: Microsoft Edge 154.0.4258.53, headless on this Windows machine. 21 wall seconds advanced 20.997 simulated seconds; no frame-rate claim. No browser exceptions. Build passes with 574 KB chunk warning.
- Pause produced identical PNG bytes. Scenario selector alters geometry envelope, rupture button seeks to 8s, playback resumes, and reduced-motion holds a rich frame. No horizontal overflow at either target size.
- Combined resize/seek script reports pixel inequality. Isolated same-viewport `seek.mjs` produced images with no differing pixels (Pillow difference bounding box None). Thus deterministic state is supported at fixed viewport, but the combined resize synchronization remains imperfect.

## Skill ambiguities and implementation limitations

The skill is unusually concrete about metaphor, choreography and evidence, and its non-agent scope worked. It says to build/render before HUD; this implementation wrote the overlay concurrently then used hero-only capture, so the workflow was only partially followed. It gives count ranges and material advice but cannot force enough authored geometry; my implementation fell into repetitive slabs despite recognizing the weak gate. A financial mini-recipe with geometric articulation beyond shear, without becoming a copied template, could improve transfer. The skill's rigorous gates should explicitly lead to reporting an incomplete artistic result when time runs out (as here), not quietly relabeling it a success.

No physical phone test. No context-loss recovery test. Missing-WebGL fallback is basic labeled CSS stripes, not visual parity. ETH selector changes envelope intensity but headline asset label remains BTC, so treat it as a visual scenario control, not a complete product. There is no trading functionality. Geometry uses many meshes instead of instancing and has not been profiled at mobile GPU budgets. No edited social export/audio was requested or delivered.
