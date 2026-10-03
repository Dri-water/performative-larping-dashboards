import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import { orderAt, marketAt } from "./orders.js";

// Cross-view continuity: partial fills become receipts, denials never execute,
// and a blocked venue redirects only its own flow.
assert.equal(orderAt(4, 10.5).stage, 4);
assert.ok(
  orderAt(4, 10.5).filled > 0 &&
    orderAt(4, 10.5).filled < orderAt(4, 10.5).size,
);
assert.equal(orderAt(4, 13).settled, true);
assert.equal(orderAt(3, 20).filled, 0);
assert.equal(orderAt(3, 20).denied, true);
assert.notEqual(orderAt(4, 10, true).venue, 1);
assert.equal(orderAt(5, 11, true).venue, orderAt(5, 11).venue);
assert.equal(
  marketAt(25, true).live.some((o) => o.venue === 1),
  false,
);
const out = "test-results";
await mkdir(out, { recursive: true });
const b = await chromium.launch({
  args:
    process.platform === "win32" ? ["--use-angle=d3d11", "--enable-gpu"] : [],
});
const errors = [];
const hash = (x) => createHash("sha256").update(x).digest("hex");
const ctx = await b.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: out, size: { width: 1440, height: 900 } },
});
const p = await ctx.newPage();
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(process.env.ABYSS_URL ?? "http://127.0.0.1:5231/?t=4");
await p.waitForFunction(() => window.__state);
await p.waitForTimeout(500);
for (const t of [1, 3, 5, 7, 9]) {
  await p.evaluate((t) => window.__seek(t), t);
  await p.screenshot({ path: `${out}/desktop-${t}.png` });
}
await p.evaluate(() => window.__seek(4));
const first = hash(await p.screenshot());
await p.waitForTimeout(400);
assert.equal(first, hash(await p.screenshot()));
await p.evaluate(() => window.__seek(9));
await p.evaluate(() => window.__seek(4));
assert.equal(first, hash(await p.screenshot()));
await p.locator("#block").click();
assert.equal(
  await p.evaluate(() => window.__state.flow.live.some((o) => o.venue === 1)),
  false,
);
await p.screenshot({ path: `${out}/blocked.png` });
await p.locator("#block").click();
await p.setViewportSize({ width: 390, height: 860 });
await p.waitForTimeout(500);
await p.evaluate(() => window.__seek(4));
await p.screenshot({ path: `${out}/portrait.png` });
assert.equal(
  await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  true,
);
await p.setViewportSize({ width: 1440, height: 900 });
await p.evaluate(() => window.__seek(0));
await p.locator("#pause").click();
await p.waitForTimeout(11000);
await p.locator("#pause").click();
const end = await p.evaluate(() => window.__state.time);
assert.ok(end >= 10);
assert.deepEqual(errors, []);
const video = p.video();
await ctx.close();
await video.saveAs(`${out}/work-cycle.webm`);
await b.close();
await writeFile(
  `${out}/checks.json`,
  JSON.stringify(
    {
      model: "partial fills, denial, settlement, venue reroute",
      pausePixels: true,
      seekPixels: true,
      portraitOverflow: false,
      errors,
      playbackSeconds: end,
    },
    null,
    2,
  ),
);
console.log(
  "Model continuity, browser pixels, routing control, portrait fit and playback passed.",
);
