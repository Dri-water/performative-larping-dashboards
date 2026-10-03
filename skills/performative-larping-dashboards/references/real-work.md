# Real work, amplified visually

Spectacle must reveal actual activity. A plausible simulation is not a substitute
for real events. Exaggerate presentation, never the facts or the system's powers.

## Audit available traffic

Inspect existing logs, event buses, WebSocket/SSE feeds, traces, counters and batch
artifacts. Reuse current instrumentation. For each candidate flow record:

| Evidence | Design implication |
|---|---|
| Event rate, peak rate, concurrency and burst shape | Particle budget, density and visible time window |
| Stable object IDs and parent/child links | Traceable packets, real splits, merges and routes |
| Stage boundaries and input/output artifacts | Transformations the display can actually show |
| Queues, latency distributions, retries and errors | Accumulation, delay, recirculation and failure marks |
| Units, quantities and aggregation rules | Accurate widths, heights, totals, scales and legends |
| Coverage, freshness, missing fields and access | Honest gaps, stale states and inspector provenance |

Prefer flows with both volume and a useful question: where time goes, which path
is congested, what transformed, why something failed, or how the output differs
from its input. A sparse stream with rich payloads may support multiple truthful
views. Several source-backed views of one event are not several new events.
Do not claim an unmeasured rate or choose a source merely because it sounds busy.

Examples: public market trades and book changes; existing request traces/cache
hits; actual ingestion, parsing, indexing and query stages; build dependency and
compilation events; real sensor readings; instrumented model/tool streams. A public
trade feed shows market trades, not the user's orders, routing decisions or P&L.
Token deltas show streamed output, not hidden reasoning or an invented agent team.

## Write a mapping contract

For each prominent layer record source fields → transform → visual encoding →
inspection evidence. A useful normalized event can carry `id`, `source`,
`occurredAt`, `receivedAt`, `kind`, `entityId`, observed `parentId`, stage/status,
quantity/unit and an accessible record reference. Missing fields stay missing.
Derived aggregates retain window boundaries, sample coverage and source IDs or
query provenance. Do not infer causality from coincident timestamps.

One packet can represent one event or a labeled batch. A split requires observed
fan-out; a merge needs known grouping; a completion requires a completion signal.
An animation finishing does not mean the work finished. Unknown-length work can
have an indeterminate scan, but cannot display invented percentage progress.

## Make real transformations extraordinary

| Observed process | Exaggerated visual expression | Useful inspection |
|---|---|---|
| Messages routed to actual destinations | Branching conduits with volume-dependent width | Route, rate, latency, drops |
| Document parsed into real chunks | Document peels into labeled fragments that enter an index | Source ranges, chunk count, status |
| Trace spans fan out and join | Architecture unfolds along parent/child links | Critical path, errors, actual durations |
| Market book levels change | Price strata grow, recede and expose spread cavities | Price, side, quantity, feed age |
| Batch produces artifacts | Input lattice transforms into output structures | Input/output counts, lineage, failures |

Use magnification, persistence, spatial separation, saturated event highlights and
material changes. Each major motion should explain an observed change or a user
inspection action. Camera movement and lighting may add polish, but ambient marks
must not resemble extra transactions, packets or processing. Never fabricate logs,
progress, retries, participants, confidence, decisions, throughput or outcomes.

## Density without fabrication

- **Time windows:** retain real trails and rolling history, with visible age/window.
- **Aggregation:** batch high-volume events; label packet weight and reconcile totals.
- **Sampling:** disclose coverage and missing events; don't extrapolate exact totals
  from samples unless the estimate and method are labeled.
- **Multiple scales:** combine topology, throughput, queue depth, latency and payload
  detail from the same flow. Keep units and mappings interpretable.
- **Replay:** use a recorded busy interval with source dates, range and playback
  speed always visible. Never silently loop it as live activity.
- **Quiet state:** show real retained context, genuine backlog and source freshness.
  If nothing arrives, stop arrival motion. A disconnected feed is not zero traffic.

Visual easing can stretch a brief event for legibility. Retain its true timestamps
and durations in the inspector, bound display delay, and avoid false simultaneity
or ordering. Do not smooth away failures or fabricate intermediate measurements.

## Keep it useful and trustworthy

Provide an inspectable real object, exact values, source timestamps and a clear
legend. Support pause/replay, filtering or selection where they answer the chosen
question. Preserve failures, uncertainty, gaps and late events. Deduplicate by
source ID; handle reconnects and out-of-order records without double counting.
Bound buffering and report dropped data rather than hiding renderer overload.

Read-only source access is the default. Display controls filter, inspect or replay;
blocking a real venue, restarting a service or submitting a trade is a separate
operational action requiring its own authorization. Do not create artificial load
or expose sensitive payloads just to obtain a more impressive video.

Validation should reconcile a bounded capture with its source, follow a real
object, verify a genuine outcome and exercise empty/stale/disconnected states.
Synthetic fixtures can test those behaviors in a clearly labeled development mode;
they cannot substantiate that a production dashboard is connected or useful.
