# One machine, one clock

Define `stateAt(time, seed, scenario)` separately from drawing. The same time must
produce the same events, metrics, positions, labels, and chart values. Derive visuals
from state rather than timers that independently invent activity.

## A 12-second theatrical loop

| Time | Cause | Visible consequence |
|---|---|---|
| 0–2s | Intake arrives | Source station receives a dossier; one queue increments |
| 2–5s | Specialists inspect | Packets traverse distinct paths; receiving agent reacts |
| 5–8s | Coordinator commits | Hero aperture rotates; derived instrument readings settle |
| 8–10s | Output dispatched | Receipt enters ledger; downstream workstation acknowledges |
| 10–12s | Recovery / handoff | New input builds while prior trails fade into next loop |

Use this as a causal pattern, not a mandatory duration. Keep the first frame useful.
Do not freeze the whole exhibit for an intro title.

## Motion hierarchy

Ambient: slow precession, material sheen, sparse dust; low salience.
Process: clear packet travel, changing gauges, deliberate agent movement.
Event: localized aperture response or state transition, once per consequence.
Inspection: selection ring, camera focus, legible explanation.

Use phase offsets so the scene breathes. Do not start every pulse on the same beat.
Keep the hero calm enough for secondary motion to register. Pause every layer from
one control, including CSS animations, charts, camera, and telemetry. Pausing must
not accumulate elapsed time and jump on resume. Hidden tabs should not consume a
full render loop. A capture timestamp overrides wall-clock time everywhere.

## Data contract

```ts
type ExhibitEvent = {
  id: string; at: number; source: string; target: string;
  kind: 'intake' | 'inspect' | 'commit' | 'dispatch';
  magnitude: number; // simulated, or measured with documented units
};
```

Calculate summary counts from events. A chart can exaggerate its visual presentation
but cannot falsely label simulated values as observed. Log entries should refer to
the same event that animates a packet. For real telemetry show disconnected/stale
states; never substitute theatrical success when a request fails.

## Performance

Batch repeating 3D marks with instancing or points. Avoid per-frame React state.
Keep DOM updates at a lower rate than the scene, dispose GPU resources on teardown,
cap pixel ratio, and measure on the intended device. Reduce particles and expensive
passes before deleting the primary visual concept. Provide a composed SVG/image
fallback when the renderer is unavailable.
