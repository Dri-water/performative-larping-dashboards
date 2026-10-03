// Fictional event model. Every view consumes these same objects and receipts.
export const stages = ["INGEST", "COMPARE", "RISK", "ROUTE", "FILL", "CLEAR"];
export const venues = ["ARC", "NOVA", "HELIX"];
export function orderAt(id, time, blocked = false) {
  const born = id * 1.25,
    age = time - born;
  const preferred = id % 3;
  const rerouted = blocked && preferred === 1;
  const score = [0, 1, 2].map(
    (v) => 4.2 + ((id * (v + 3)) % 19) / 10 + (v === preferred ? 2 : 0),
  );
  const venue = rerouted ? (score[0] >= score[2] ? 0 : 2) : preferred;
  const rejected = id % 7 === 3;
  const size = 2 + ((id * 17) % 29) / 10;
  const side = id % 2 ? "SELL" : "BUY";
  const thresholds = [0, 1, 2.3, 3.5, 5, 7];
  const stage = thresholds.reduce((n, start, i) => (age >= start ? i : n), 0);
  const filled = rejected ? 0 : size * Math.min(1, Math.max(0, (age - 5) / 2));
  const settled = !rejected && age >= 8;
  const denied = rejected && age >= 3.5;
  const done = settled || denied;
  const end = stage === 5 ? 8 : thresholds[stage + 1];
  const progress = Math.min(
    1,
    Math.max(0, (age - thresholds[stage]) / (end - thresholds[stage])),
  );
  return {
    id,
    tag: `OX-${String(id).padStart(4, "0")}`,
    born,
    age,
    size,
    side,
    preferred,
    venue,
    rerouted,
    rejected,
    denied,
    settled,
    done,
    filled,
    stage,
    progress,
    price: 98410 + ((id * 37) % 91) + venue * 0.4,
    score,
    reason: denied
      ? "EXPOSURE CAP"
      : settled
        ? "NETTED / RECEIPT"
        : rerouted && stage >= 3
          ? "NOVA BLOCKED → ALTERNATE"
          : stages[stage],
  };
}
export function marketAt(time, blocked = false) {
  const latest = Math.floor(time / 1.25);
  const all = Array.from({ length: Math.min(latest + 1, 64) }, (_, i) =>
    orderAt(latest - i, time, blocked),
  );
  const live = all.filter((o) => !o.done);
  const receipts = all.filter((o) => o.done).slice(0, 5);
  const fills = all.filter((o) => o.age >= 5 && !o.rejected);
  const current = fills[0];
  const volume = fills.reduce((n, o) => n + o.filled, 0);
  const counts = stages.map((_, i) => live.filter((o) => o.stage === i).length);
  return {
    time,
    live,
    receipts,
    counts,
    all,
    volume,
    price: current?.price ?? 98410,
    pressure: live.filter((o) => o.stage >= 3).length / 5,
    clearing: all.filter((o) => o.settled && o.age < 9).length,
    focus: live.find((o) => o.stage === 3) ?? live[0],
    venueLoads: venues.map(
      (_, v) => live.filter((o) => o.venue === v && o.stage >= 3).length,
    ),
  };
}
