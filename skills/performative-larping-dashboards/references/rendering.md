# Rendering recipes

These are implementation choices, not mandatory aesthetics. Start with the
target platform recipe. Scale complexity to the machine while preserving composition.

## Three.js optical pipeline

Use core and addons from the same pinned Three.js version. Typical browser stack:
`WebGLRenderer → EffectComposer → RenderPass → UnrealBloomPass → OutputPass`.
Apply tone mapping and color conversion exactly once. See the
[official post-processing guide](https://threejs.org/manual/pages/post-processing.html)
and [bloom example](https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html).

Keep physical mass below bloom threshold. Give selected emissive materials HDR
values above it. Start bloom strength around 0.4–0.8 and tune the actual render.
If every reflective surface glows, reduce environment intensity/exposure and
increase threshold before compensating with a darker CSS overlay.

A PMREM environment helps metal read as metal, but does not replace deliberate
key/rim lights. Use low-intensity environmental fill, one cool direction,
and a smaller warm contrast where appropriate. Preserve black values in central
voids; use an unlit dark material for a literal void rather than a shiny sphere.

For a copyable baseline, use [assets/optics.mjs](../assets/optics.mjs) inside the
target project. It owns the renderer, environment, lights, passes, resize observer,
and teardown; it imposes neither content nor a clock. Caller-created asset textures
remain the caller's cleanup responsibility. Its metallic-plane render, resize,
and idempotent disposal have been exercised against the pinned Three.js baseline.

Render important typography and controls in HTML/SVG above postprocessing.
Chromatic aberration, scanlines, noise, and lens flare are finishing touches, not
a substitute for geometry. Avoid full-frame blur that destroys instrument detail.

## Dense assemblies without a draw-call explosion

Use `InstancedMesh` for repeated ribs, ticks, fasteners, ports, and blocks. Share
geometry/material across repeated assemblies. Compute transforms at setup, update
only groups/pivots that move. Thin linework can use batched line geometry.
Hundreds of parts should not mean hundreds of unique shader programs.

Produce structural complexity from layered assemblies, not random “greebles.”
Give details a parent, spacing logic, material, and scale. Each repeated ring or
slab should differ in section, orientation, radius, and purpose. Choose geometry
that retains its silhouette at the final pixel size.

## GPU fields

For thousands of points, store initial seed/angle/radius/phase in buffer attributes
and calculate motion in the vertex shader from the common time uniform. Avoid
JavaScript allocations for every point on every frame. Use alpha/additive blending,
depth test on, depth write off for sparse luminous particles. Keep some particles
behind machinery; occlusion makes the field feel spatial.

Shader planes are useful for spectral membranes, accretion surfaces, contour
fields, glow, and pseudo-volume. Combine them with real 3D depth; don't sell a flat
animated texture as a sculpted volume. Use noise at a few meaningful scales.

For an order book, instanced extrusions can carry price position, side, and volume;
flowing paths supply trade trajectories. For weather, points and slices carry field
direction and magnitude. The technique is reusable across subjects.

## Camera and labels

Compose for the target frame. Slight obliqueness, depth overlap, large cropped
structures, and scale-reference detail sell monumental size. Camera drift should
be slower than local activity. All automatic camera movement must be seekable.

Project world coordinates through the active camera for attached annotations.
Put labels into explicit collision-free lanes; use leader lines to maintain the
connection. Check collisions at several times, not only one view. On portrait,
set a separate camera/stage arrangement and label lanes.

## Performance without losing spectacle

Profile real frame work and GPU capability; record viewport and renderer. Cap DPR,
reduce bloom resolution, reuse resources, throttle DOM telemetry, and suspend
drawing while paused/hidden. Reduce shader cost and particle count before removing
the designed structure. A production fallback should be a composed still/SVG with
an honest status, not a blank canvas or misleading “live” badge.

Dispose observers, passes, geometries, materials, textures, and render targets when
the view unmounts. Context-loss fallback must preserve accessible controls. Test
recovery separately if claiming automatic recovery. Physical-device performance
cannot be inferred from a desktop headless browser result.
