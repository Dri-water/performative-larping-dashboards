---
name: performative-larping-dashboards
description: Build useful dashboards that turn real activity into extravagant cinematic visualizations. Discover high-traffic flows and dramatize measured transformations, queues, decisions, and outcomes with dense connected visuals. Use for spectacular finance, infrastructure, science, or agent interfaces; never fabricate activity to make a screen look busy.
license: MIT
---

# Performative Larping Dashboards

Make real work spectacular. The facts, events and transformations must be real;
the scale, geometry, lighting and visual expression can be wildly exaggerated.
The dashboard must help someone understand what is happening, locate a bottleneck,
inspect an outcome or make a decision. Agents are optional. Usefulness and source
fidelity are required. A beautiful sculpture with invented telemetry fails.

## Discover the work before designing the shot

Read [real work](references/real-work.md). Inspect existing data sources,
instrumentation, schemas and dashboards before adding anything. Identify the
busiest meaningful flows and the transformations actually observable within them.
Prefer an existing stream or safe recorded trace; do not generate production
traffic, submit trades, or start costly work merely to animate the screen.

Write a compact production brief:

- **User question:** what should this display help someone understand or do?
- **Source contract:** source, event identity, timestamps, units, observed stages,
  freshness, permissions and gaps. Distinguish facts from derived estimates.
- **Traffic audit:** measured rate, bursts, concurrency, fan-out, latency and
  available history. Pick rich flows without inventing unobserved stages.
- **Event → visual mapping:** what each packet, split, merge, surface and output
  represents; aggregation, sampling and time scaling must be explicit.
- **Money shot:** how a real transformation becomes a spectacular spatial event.
- **Capture contract:** live or recorded provenance, target aspect ratios and a
  representative busy interval plus quiet, stale and disconnected states.

If no suitable source is available, build the adapter boundary and an honest
empty/disconnected state, and identify the missing access. Synthetic fixtures
belong only in explicit development/test mode and cannot satisfy delivery.

## Turn the process into the spectacle

Read [spectacle direction](references/art-direction.md), the
[construction playbook](references/construction.md), and the
[full-intensity preset](references/full-intensity.md). Choose the named defaults
from [the maintained toolkit](references/toolkit.md) or compatible existing tools.
Load the relevant [React](references/react.md), [HTML](references/html.md), or
[native](references/native.md) recipe rather than every platform reference.

Build a monumental composition with several substantial systems whose roles come
from the source. Orders can become flowing strata, spans can become branching
conduits, and actual transformations can unfold into cross-sections. Give objects
stable identities. Show inputs, observed decisions, partial progress and outputs
across linked views. Preserve a useful overview and a readable inspector with
exact values and provenance beneath the exaggerated rendering.

Work at three scales: large process architecture, intermediate assemblies and fine
instrumentation. Use projected labels, ribbons, contour fields, exploded views,
waveforms and volumetric books where they express the data. Render the composition
early. Dense craft, depth and material contrast should survive with the HUD hidden;
that alone does not establish usefulness or truth.

Read [choreography](references/choreography.md). Source events drive semantic
motion. A transition can be expanded visually, but cannot invent a decision,
completion, duration, quantity or causal relationship. Use labeled windows,
aggregates, trails and replay to expose genuine volume. Quiet data stays quiet;
a fixed cinematic timer must never manufacture a surge, failure or success.

## Implementation aids

- [Rendering recipes](references/rendering.md): geometry, GPU fields, optics,
  projection, camera and repair techniques.
- [Optics helper](assets/optics.mjs): a Three.js environment, lights and bloom/output
  baseline. It supplies visibility, not data or meaning.
- [Director module](assets/director.mjs): reusable envelopes, randomness for layout,
  and pause/seek utilities. Its synthetic score is a legacy demo only; replace its
  generated operational state with recorded or live events.
- [Production](references/production.md): optional Blender/GLB, Remotion and MCP
  handoffs. Video exports preserve source provenance and display replay speed.
- [Capture helper](scripts/capture.mjs): desktop/portrait timestamps and playback;
  implement its documented capture contract against a fixed recorded trace.

## Verify both truth and spectacle

Read [the quality gates](references/quality.md). Trace visible objects back to
source records; reconcile aggregate counts; verify units and event ordering.
Inspect busy, quiet, disconnected, stale and replay states. Follow one real object
through observed stages and into a source-backed outcome. Unknown progress stays
unknown; an actual failure cannot turn into a success for a satisfying ending.

Then inspect real rendered output at delivery and thumbnail sizes and watch a
representative sequence. If it feels ordinary, improve the visual mapping,
composition, scale and craft, or choose a richer observed flow. Never add fake
activity to pass an artistic gate. Recompose portrait rather than shrinking it.

Deliver the working artifact, pinned setup, source/adapter contract, actual
captures and a short record of truth checks, visual critique and limitations.
Separate live, delayed, replay and synthetic test modes visibly. Preserve pause,
reduced motion and readable controls; avoid rapid full-screen strobing. Pausing
the view must not falsely imply that the underlying system has paused.
