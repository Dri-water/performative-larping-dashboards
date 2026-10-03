# ABYSS — a fictional exchange visibly processing work

The earlier finance evaluation looked active but did not sufficiently imply useful
activity. This revision gives its spectacle a small deterministic order model:
ingest → compare venues → risk → route → partial fill → clearing receipt.

```sh
npm ci
npm run dev -- --port 5231
```

Orders retain IDs across the ingress list, stage strip, projected stations, routing
comparison and receipts. Every seventh order fails an exposure check. Accepted
orders accumulate partial fills before settlement. Last-fill price and the trace
come from those orders. Workload and clearing events drive structural articulation;
most ambient dust and generic orbiting packets have been removed.

**BLOCK NOVA** switches to a counterfactual scenario where NOVA is unavailable:
affected orders use another venue, their packets follow a different spatial branch,
and the comparison shows the exclusion. Switching scenarios recomputes the whole
fictional history, including receipts; it is not a live exchange outage event.
Pause freezes everything; NEXT ARRIVAL steps time. `?t=4` holds a reproducible frame.
Reduced motion holds a composed frame. No actual trades or APIs are involved.

```sh
npm run build
npx playwright install chromium
node verify.mjs
```

Keep the dev server on port 5231 for verification, or set `ABYSS_URL` to another
server URL including `?t=4`. Verification checks model continuity, denied orders,
partial fills, settlement, venue rerouting, exact pause/seek pixels, portrait fit
and actual playback. Captures are written under ignored `test-results/`.

The tests prove internal continuity, not audience impressiveness. Remaining
limits: procedural geometry, small peripheral type, abbreviated financial logic,
scenario-wide rather than historical outage handling, and no physical-phone
performance testing. The frozen earlier evaluation is preserved in `evals/abyss`.
