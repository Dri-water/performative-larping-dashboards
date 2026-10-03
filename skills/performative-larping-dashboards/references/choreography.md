# A continuous performance, one clock

Define stateAt(time, seed, scenario) separately from drawing. A given timestamp
must reconstruct geometry, fields, instruments, camera, and event state. Connect
layers through a common score. This connection may be fictional: the purpose is
to make the entire display feel active and coordinated, not to prove agent work.
Coordination alone is insufficient: use a small event model with persistent work
objects and state transitions. Read [apparent work](apparent-work.md). A result
should leave a receipt, changed inventory, revealed feature or other visible trace.

## Simultaneous motion bands

Keep all four bands alive during ordinary playback, with different periods:

| Band | Typical period | Examples | Visual priority |
|---|---|---|---|
| Environmental | 20–90s | Slow precession, fog drift, parallax, evolving field | Broad, low contrast |
| Continuous process | 1–8s | Packets, flowing trade ribbons, scanners, moving sections | Several local points of interest |
| Instrument | 0.3–3s | Trace drawing, changing ladders, counter sweeps, heatmap propagation | Fine, peripheral detail |
| Hero event | 8–24s cycle | Architecture separates, a field collapses, strata shear, output wave | Temporarily dominant |

These ranges are starting points. Avoid synchronized breathing across the whole
screen. Offset phases, alternate directions, vary path lengths, and overlap
recovery with the next buildup. “Always doing something” means development across
the scene, not a single spinner or an occasional number update.

## Example 24-second score

| Time | Dramatic function | Spatial change | Secondary activity |
|---|---|---|---|
| 0–4s | Establish / acquire | Field already alive; intake sweeps across scene | Instruments trace, streams flow |
| 4–8s | Build anticipation | Assemblies align; channels converge | Side fields grow and subdivide |
| 8–12s | Transform | Containment opens, depth layers separate, topology unfolds | Traffic accelerates into the focal volume |
| 12–17s | Payoff / release | New path or volume becomes visible; wave leaves the centre | Readouts change in a cascading sequence |
| 17–24s | Recover / handoff | Machinery settles into a new configuration | Echoes propagate while new input accumulates |

Adapt every noun to the subject. Trading can shear a liquidity canyon and release
a trade torrent; a weather display can reveal a rotating storm interior. Agents
and intake/approval workflows are not required.

Opening at a developed frame helps the first impression. Do not make the user
wait for a title card, a slow loader, a click, or an empty intro to see the work.

## Implement the score

The included [director module](../assets/director.mjs) contains deterministic random
numbers, smooth envelopes, a pause/seek clock, and one example score. Copy/adapt it
into the target project. Its station names and events belong to the Xenolith demo;
replace them for finance, weather, or other domains.

Drive motion with time functions instead of incremental “rotate by delta” state
when reliable seeking matters. An envelope can simultaneously drive aperture
opening, line intensity, field density, scan reveal, camera offset, and readings.
Avoid simply animating every property with the same sine wave.

For edited video, use time = frame / fps. For an interactive exhibit, use one
requestAnimationFrame clock. Seek GSAP/Motion timelines from this source when they
participate in ongoing machine animation. Interactions may have their own short
transitions only if pause and frame capture still behave as promised.

## Pause, concealment, and repeatability

Pause all geometry, shaders, camera, particles, SVG, CSS, and data changes together.
Resume without accumulating paused wall time. Hidden tabs skip expensive drawing
and resume without a time jump. A fixed timestamp overrides live time everywhere.
Reduced motion holds a composed climax instead of removing visual detail.

Summary data can derive from staged events; decorative values can be seeded
functions. Neither should masquerade as real measured activity. In a real-data
dashboard, show genuine connection/error state separately from theatrical layers.

## Verification

Compare screenshots at the same time before and after arbitrary seeking. Compare
pixels while paused. Inspect a full cycle, not only one attractive frame. A change
in timestamp proves the clock runs, not that the motion is dramatic. Record the
visual transformation seen at the peak and confirm ambient processes continue
during it. Measure actual frame behavior separately from the artistic judgment.
