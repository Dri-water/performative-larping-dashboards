# Choreography driven by evidence

Maintain separate source time and presentation time. Live ingestion updates a
source-backed event store; a view cursor controls rendering. Replay reconstructs
state from a fixed trace and cursor. Randomness may place geometry deterministically,
but cannot generate operational events. Read [real work](real-work.md).

## Several layers of real activity

Use different visual scales for the same evidence: individual arrivals, observed
stage transitions, aggregate throughput, queue depth and longer-window history.
High-volume feeds can support simultaneous movement without artificial activity.
Event identity and actual parent/child links connect the layers.

Arrival reveals an object; an observed stage change transforms it; a completed
output leaves a persistent artifact or receipt. Failure interrupts the expected
path. Retry motion occurs only on recorded retry. Unknown duration remains
indeterminate. A view transition is not a domain event.

A dramatic geometry change can accompany a genuine burst, batch completion,
threshold crossing or selected inspection. Define thresholds from measured units
and disclose them. Do not schedule an invented climax every 24 seconds. When the
source is quiet, preserve the composed environment and history while activity
marks become still. Show freshness and distinguish no events from no connection.

## Presentation controls

Use one presentation clock for geometry, shaders, SVG and displayed values. Smooth
within an explicit rendering budget; do not alter recorded quantities or causal
order. Retained trails disclose age. Aggregated packets disclose weight. Source
event timestamps and durations remain available independently of animation duration.

For exported footage, frame/fps selects the replay cursor in a recorded trace.
Label the source interval and playback speed. Seek animation libraries from that
cursor. The [director module](../assets/director.mjs) supplies reusable envelope
and clock utilities; its synthetic score belongs only to legacy fixture demos.

Pausing freezes the view, not the source system. In live mode either buffer within
a bounded limit or snapshot the view, disclose lag/drops, and explicitly catch up
or jump to live on resume. Do not replay a backlog at normal speed under a LIVE
label. Hidden tabs can stop drawing while ingestion follows a documented policy.
Reduced motion uses stable updates/selection instead of looping choreography.

## Verify

Reconstruct the same frame from the same captured trace and cursor. Check pause,
seek, duplicates, late events, reconnects, source silence and dropped data. Follow
one identity through actual observations; do not bridge an instrumentation gap
with invented stages. Inspect a representative real busy interval and a quiet
interval. Evaluate visual drama separately from correctness and frame performance.
