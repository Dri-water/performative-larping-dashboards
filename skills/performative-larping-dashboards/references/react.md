# React route

Default: React + TypeScript + Vite, Three.js through React Three Fiber and Drei,
Motion for DOM interactions, HTML/SVG for crisp instrument labels. Use an existing
Next.js project when supplied; isolate the GPU scene in a client boundary.

Structure: simulation module → shared exhibit state → scene canvas + instrument
overlay + inspector. Keep one frame clock outside ordinary React render state;
update mesh refs in the frame loop and publish slower telemetry snapshots to UI.
Do not create multiple full-screen canvases for individual agents.

Build the hero from procedural geometry first. Add Blender GLB assets only for
silhouette, rigging, or material work that warrants the asset pipeline. Drei helpers
are implementation aids, not an art style. Load assets with visible progress and a
fallback. Keep text out of bloom and depth-of-field passes.

Use Motion for selection panels and layout transitions; the simulation owns ongoing
machine choreography. Scrubbing time must reconstruct the whole display without
waiting for entrance transitions. Share projection coordinates between 3D stations
and screen-space labels, or place labels in a separate clearly mapped instrument row.

Verify lockfile peer compatibility, hydration where relevant, canvas resizing,
context loss, pause/resume, unmount cleanup, and both capture aspect ratios.
This recipe is documented, not exercised by the vanilla example.
