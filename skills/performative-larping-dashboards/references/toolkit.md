# Maintained production toolkit

Reviewed 2026-10-03. This is an opinionated recommendation sheet, not an automatic
installer. **Documented** means a recommendation based on upstream capabilities;
**example-tested** means exercised in this repository. Device-tested requires an
actual named device. Never infer the last two from the first.

| Job | Preferred tool | What it contributes | Evidence / fallback |
|---|---|---|---|
| Vanilla browser exhibit | [Three.js](https://threejs.org/docs/) + Vite + HTML/SVG | Procedural environments, dense assemblies, GPU fields; crisp overlays | Example-tested in Xenolith; SVG static composition when WebGL unavailable |
| Cinematic optics | Three.js EffectComposer + UnrealBloomPass + OutputPass | Controlled emissive bloom and output conversion | Example-tested in Xenolith; unprocessed scene loses optical finish |
| React exhibit | [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) + [Drei](https://drei.docs.pmnd.rs/) + Three.js | Declarative 3D, helpers, model loading | Documented; vanilla Three.js loses React scene composition |
| React UI choreography | [Motion](https://motion.dev/docs/react) | Layout transitions, gestures, staged UI | Documented; shared-clock CSS/SVG loses gesture convenience |
| Vanilla timeline | [GSAP](https://gsap.com/docs/v3/) | Sequenced DOM/SVG/camera motion | Documented; explicit time functions are the reference example default |
| Dense 2D swarm | [PixiJS](https://pixijs.com/8.x/guides) | Large batches of sprites and effects | Documented; Canvas2D with fewer particles |
| Bespoke diagrams and charts | [D3](https://d3js.org/) + SVG | Layouts, scales, technical linework | Documented; plain SVG for a small fixed exhibit |
| Dense analytic instruments | [Apache ECharts](https://echarts.apache.org/handbook/en/get-started/) | Heatmaps, distributions, coordinated charts | Documented; hand-built SVG for a few instruments, fewer interactions |
| Bespoke 3D asset creation | [Blender](https://docs.blender.org/manual/en/latest/) → GLB | Modeling, rigging, baking, authored silhouettes | Documented; procedural Three.js meshes lose custom sculpting |
| Edited social video | [Remotion](https://www.remotion.dev/docs/) + [@remotion/three](https://www.remotion.dev/docs/three) | Exact frames, React composition, audio, renders | Documented; browser capture loses deterministic editing/audio workflow |
| React Native drawing | [React Native Skia](https://shopify.github.io/react-native-skia/) + [Reanimated](https://docs.swmansion.com/react-native-reanimated/) | Native canvas, shaders, UI-thread motion | Documented, no device test; WebView reuses browser scene with bridge costs |
| React Native 3D | [R3F native](https://r3f.docs.pmnd.rs/getting-started/installation) / Expo GL | Actual 3D when needed | Documented, no device test; Skia provides 2D/2.5D only |
| Apple native | [RealityKit](https://developer.apple.com/documentation/realitykit) + SwiftUI | Native 3D, materials, UI | Documented, no device test; SwiftUI Canvas loses true 3D |
| Desktop packaging | [Tauri](https://v2.tauri.app/) | Native shell around browser exhibit | Documented, no packaged test; plain browser loses OS integration |
| Render verification | [Playwright](https://playwright.dev/) | Screenshots, controls, viewport and fallback checks | Example-tested; manual browser QA is disclosed, not called automated |

## Version policy

The runnable baseline is Three.js 0.186.1, Vite 8.3.2, Playwright 1.63.0, Node
24.14.1, with `examples/xenolith/package-lock.json` authoritative for resolved packages.
Other rows are recommendations, not a claim of tested combinations. Resolve supported
stable versions when creating a new project and commit its lockfile. Never copy a
`latest` CDN URL into a reproducibility-sensitive deliverable.

R3F majors must match React: upstream currently documents R3F 8 with React 18 and
R3F 9 with React 19. Match Remotion packages to the same release. Avoid mixing
Three.js core and addons from different releases. Prefer stable APIs over alpha
renderers unless the brief needs a capability and its fallback is demonstrated.

## Maintenance checklist

When changing a recommendation, review official docs, license/commercial terms,
platform compatibility, maintenance health, and a minimal relevant example. Record
review date and evidence level. npm package licensing, Blender application licensing,
Remotion commercial licensing, and imported asset licensing are separate questions;
the MIT license on this repo does not relicense dependencies or external assets.

Do not install all these tools. Pick one scene renderer, one owner of time, and only
the additional tools that make the promised artifact better.
