# HTML / vanilla route

Default: Vite + pinned Three.js, plain HTML/CSS instrument layout, SVG chart marks,
and explicit time-based animation. The Bureau example exercises this route.
GSAP is the preferred addition for a complicated authored timeline; seek it from
the shared clock rather than introducing a second independent timeline.

Use an npm lockfile and local bundled modules. For a literal single-file handoff,
bundle dependencies and embed assets with an appropriate build step; do not call a
file self-contained if it fetches a CDN, web font, or remote GLB.

One module defines scenario state. One owns the renderer and teardown. The UI reads
the same state. Keep geometry creation out of requestAnimationFrame. Reuse vectors
and typed arrays for dense effects. Use a ResizeObserver for container size.

Deliver semantic controls, keyboard-visible focus, a pause button, reduced motion,
and an explicit graphics fallback. Test that labels do not overflow at phone widths.
Use an SVG layer for paths and labels when no actual depth is needed; reserve WebGL
for sculptural forms, occlusion, lighting, and three-dimensional relationships.
