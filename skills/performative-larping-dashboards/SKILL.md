---
name: performative-larping-dashboards
description: Create extravagantly cinematic, continuously animated dashboards optimized for visual spectacle, sensory density, awe, and social-media impact. Applies to finance, trading, science, infrastructure, fictional telemetry, and agent systems. Use for over-the-top performative interfaces or Hollywood-style screen graphics; information utility is secondary to the requested visual experience.
license: MIT
---

# Performative Larping Dashboards

Build a screen someone would stop scrolling to watch. Treat the brief as production
design for a film's impossible technology: monumental form, intricate surfaces,
spatial instrumentation, continuous layered activity, and recurring spectacular
transformations. The subject can be markets, weather, a build queue, agents, or
invented nonsense. **Agents, mascots, workstations, and realistic utility are optional.**
Apparent purpose is essential: the viewer should feel that the system is doing
work. Design visible inputs, decisions, transformations and consequences before
adding effects. Spectacle comes from dramatizing that fictional activity.

Default ambition is a cinematic set piece. A conventional dashboard with a 3D widget,
glowing borders, or a particle background does not meet this brief. An isolated
primitive surrounded by cards fails even when its controls work and tests pass.

## Establish the visual contract

Read [apparent work](references/apparent-work.md) and
[spectacle direction](references/art-direction.md), then choose a production
route from [the maintained toolkit](references/toolkit.md). Use the relevant
[React](references/react.md), [HTML](references/html.md), or
[native](references/native.md) recipe. Do not load every platform reference.

Write a compact production brief in the target project:

- **Subject → impossible physical metaphor.** A trading engine might be a canyon
  of order-book strata, a gravitational liquidity engine, or a cathedral of price
  trajectories. It need not become a spacecraft or agent network.
- **Supposed job → visible evidence.** Name what enters, what the system does to
  it, what comes out, and which other view changes as a consequence. Track a few
  persistent identities; make waits, decisions and results visible.
- **One-sentence money shot.** Describe the composition, materials, depth, and
  transformation that would make a silent five-second clip worth sharing.
- **Shape / material / motion vocabulary.** Commit to specific choices beyond
  “futuristic,” “premium,” “3D,” “neon,” or “lots of particles.”
- **Capture contract.** Target aspect ratios, rendered opening/climax/recovery
  frames, a continuous sequence, and real versus explicitly fictional telemetry.

Make creative decisions from the user's direction; do not turn this into a survey.
Choose established compatible tools in an existing project, otherwise the named
defaults. Record installed versions, lock dependencies, and disclose fallback
tradeoffs. A smaller renderer budget must preserve the spectacle concept.

## Produce the shot before the dashboard

Read [the construction playbook](references/construction.md) and use
the [full-intensity preset](references/full-intensity.md) for an unrestricted
spectacle brief: declare a monumental hero and several substantial secondary
systems before implementation. A large but sparse 3D scene is still insufficient.
Build and **render** the dominant composition before adding navigation or a grid
of widgets. A successful
first shot already has scale, silhouette, material contrast, and foreground /
midground / background. Hide the HUD: it should still look like a film asset.

Then accumulate authored detail at several scales. Repeat modules with instancing,
but vary assemblies, spacing, orientation, material, and local purpose. Build the
instrumentation into this world through projected labels, cross-sections, contour
fields, exploded views, ribbons, radial scales, waveform sheets, or volumetric books.
Choose forms appropriate to the subject. Text and microtype supply texture; only
the headline state and essential controls need to be immediately decipherable.

Read [choreography](references/choreography.md) and stage a continuous performance:
ambient motion, active processes, instrument sweeps, and a recurring hero event.
Use a shared clock and a small event model so the spectacle feels connected.
The process may be entirely fictional, but its visible cause and effect should
be consistent. A packet arrives, a stage reacts, a result appears, and a related
view changes. Synchronized glow and unrelated number changes are insufficient.
Never leave the opening idle or depend on clicks to reveal the impressive part.

Available implementation aids:

- [Rendering recipes](references/rendering.md): material / bloom pipeline, dense
  geometry, GPU fields, projection, camera, and common failure repairs.
- [Optics helper](assets/optics.mjs): copy into a Three.js project for a PMREM
  environment, directional light, bloom, and output pipeline. Adapt the palette;
  the helper supplies physical visibility, not the subject or layout.
- [Director module](assets/director.mjs): reusable seeded randomness, envelopes,
  pause/seek clock, and an adaptable 24-second example score. Copy and replace its
  subject-specific names/events; it is not a mandatory agent ontology.
- [Production](references/production.md): Blender / GLB, Remotion, and MCP handoffs
  when they improve the requested deliverable. None is universally mandatory.
- [Capture helper](scripts/capture.mjs): run from a project with Playwright installed
  to capture desktop/portrait timestamps and actual playback. Use `--help`; the
  target must implement the documented `?t=` capture contract.

## Earn the result in the renderer

Read [the visual gates](references/quality.md). Inspect real rendered frames at
delivery size, thumbnail size, and multiple times. Watch a continuous sequence.
Functional tests cannot certify impressiveness. Do not give yourself a passing
aggregate score that excuses a weak hero or dead motion.
Also follow one work object through the screen: can a viewer infer what happened
to it? A gorgeous animated sculpture can still fail the intended dashboard illusion.

If it looks ordinary, change composition, silhouette, scale, material, or event
staging before adding more glow. Iterate against the specific observed failure.
Recompose portrait geometry/camera/labels; do not merely shrink desktop.

Deliver a working artifact, setup instructions, lockfile, actual screenshots,
motion evidence, and a short record of checks and limitations. Export edited video
when requested; motion evidence can otherwise be a local browser recording or
verified live preview. Keep simulated data labeled, and never represent theatrical
activity as real trades, returns, or executions. Preserve pause/reduced motion and
avoid rapid full-screen strobing; the paused frame must retain visual richness.
