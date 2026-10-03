# Blender, video, and MCP

## Blender: bespoke props

Use for a custom oracle, rigged creature, glass vessel, or articulated machinery
when procedural geometry cannot deliver the intended silhouette. Save source
`.blend` and export GLB for web. Record units, origin, named animation clips,
material intent, texture paths, asset provenance, and the Blender version.

Prefer a reproducible Python build script for procedural assets. Bake expensive
procedural materials to runtime-compatible textures. Validate GLB in the target
renderer; a Blender viewport render is not proof of browser material fidelity.
Keep transparent surfaces and texture sizes within a measured frame budget.

Fallback: procedural Three.js meshes, with the loss of bespoke sculpting disclosed.
Do not install Blender solely to make a torus.

## Remotion: social film

Use when the deliverable is a rendered film with controlled pacing, camera cuts,
audio, or exact-frame exports. Keep Remotion package versions aligned. Use
`@remotion/three` for the 3D layer, and drive recorded-trace playback from frame/fps. Label the source interval and speed;
never generate operational events to fill the edit.
Do not rely on wall-clock requestAnimationFrame or ordinary CSS animations during
frame rendering. Await assets before rendering frames.

Design 1920×1080 and 1080×1920 compositions as separate arrangements. Start with a
15–30 second cut: immediate spectacle, an understandable causal event, a satisfying
payoff, and a loopable ending. Confirm text at actual phone size and review sampled
frames plus the full exported video. Audio is opt-in for interactive dashboards;
avoid surprise autoplay. Check Remotion's current commercial licensing separately.

Fallback: browser capture. Label it capture rather than claiming an exact-frame
render; disclose missing audio/editing and verify dropped frames visually.

## MCP composition

The default architecture is one agent host coordinating several independently
configured tools. A skill is instructions; it cannot create a tool connection just
by naming a server. Discover actual capabilities and their permissions first.

Handoffs are files and contracts:

`Blender tool/CLI → model.glb + asset manifest → browser scene → Remotion project → MP4`

Each boundary should name output path, format, version, readiness/failure state,
and who owns retries. A render failure is not permission to repeat an expensive
remote job indefinitely. Retain artifacts for diagnosis.

A server can implement an MCP client and call another server, but that requires
explicit code, connection/auth handling, cancellation, and error propagation. This
repo does not need that extra service. Avoid requiring a particular third-party
Blender MCP when Blender's CLI can do the job reproducibly. Use an already connected
MCP when it improves interaction, not as a hidden mandatory dependency.

References: [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture),
[Blender manual](https://docs.blender.org/manual/en/latest/),
[Remotion Three](https://www.remotion.dev/docs/three).
