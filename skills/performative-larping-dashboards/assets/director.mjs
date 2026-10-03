/** Deterministic stage direction. Copy/adapt to the target project; MIT. */
export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const smooth = (a, b, v) => {
  const x = clamp((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
export const envelope = (t, a, b, c, d) =>
  smooth(a, b, t) * (1 - smooth(c, d, t));
export function seeded(seed = 17) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 4294967296;
  };
}
export const stations = [
  {
    name: "VESPER",
    role: "deep-field listening",
    code: "RX",
    color: "#7ce8ef",
  },
  {
    name: "PARALLAX",
    role: "topology reconstruction",
    code: "MAP",
    color: "#7ce8ef",
  },
  { name: "ORISON", role: "consensus lattice", code: "SYN", color: "#ffc27b" },
  {
    name: "THRENODY",
    role: "causal arbitration",
    code: "SIM",
    color: "#ffc27b",
  },
  { name: "MNEME", role: "memory excavation", code: "MEM", color: "#7ce8ef" },
  {
    name: "LACUNA",
    role: "transit orchestration",
    code: "TX",
    color: "#ffc27b",
  },
];
const beats = [
  { at: 0, station: 0, label: "Carrier acquired", phase: "ACQUIRE" },
  { at: 4, station: 1, label: "Topology reconstructed", phase: "RECONSTRUCT" },
  { at: 8, station: 2, label: "Consensus field converging", phase: "CONVERGE" },
  { at: 11, station: 3, label: "Causal solution committed", phase: "IGNITION" },
  { at: 15, station: 5, label: "Transit aperture opened", phase: "TRANSMIT" },
  { at: 20, station: 4, label: "Echo archived", phase: "RECOVER" },
];
export function stateAt(seconds, mode = "contact", seed = 17) {
  const time = Math.max(0, seconds),
    cycle = Math.floor(time / 24),
    local = time % 24;
  const index = beats.findLastIndex((b) => local >= b.at);
  const strength = mode === "storm" ? 1.28 : mode === "silent" ? 0.68 : 1;
  const ignition = envelope(local, 8, 12, 15, 20) * strength;
  const events = [];
  for (let c = Math.max(0, cycle - 1); c <= cycle; c++)
    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i],
        at = c * 24 + beat.at;
      if (at <= time) events.push({ ...beat, at, id: `${seed}-${c}-${i}` });
    }
  const event = events.at(-1);
  return {
    time,
    local,
    cycle,
    mode,
    seed,
    phase: index,
    phaseName: beats[index].phase,
    event,
    events: events.slice(-5).reverse(),
    active: beats[index].station,
    ignition,
    aperture: 0.18 + ignition * 0.72,
    energy: 32 + ignition * 59,
    coherence: 83 + Math.sin(time * 0.27) * 3 + ignition * 10,
    completed: cycle + (local >= 15 ? 1 : 0),
    loads: stations.map(
      (_, i) =>
        0.22 +
        0.16 * (1 + Math.sin(time * 0.43 + i * 1.8)) +
        (i === beats[index].station ? 0.35 : 0),
    ),
    transport: clamp((local - beats[index].at) / 2.8),
  };
}

/** All animation consumes this clock; no catch-up after paused/hidden intervals. */
export function createClock({ time = 0, paused = false } = {}) {
  let previous;
  return {
    get time() {
      return time;
    },
    get paused() {
      return paused;
    },
    tick(now, visible = true) {
      if (previous !== undefined && !paused && visible)
        time += Math.min(0.1, Math.max(0, (now - previous) / 1000));
      previous = now;
      return time;
    },
    seek(value) {
      time = Math.max(0, value);
      previous = undefined;
    },
    pause(value = true) {
      paused = value;
      previous = undefined;
    },
  };
}
