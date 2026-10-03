import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import {
  stateAt,
  createClock,
  seeded,
} from "../../skills/performative-larping-dashboards/assets/director.mjs";

const output = "test-results";
await mkdir(output, { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "4181",
    "--strictPort",
  ],
  { stdio: "pipe" },
);
let browser;
const origin = "http://127.0.0.1:4181";
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  assert.ok(ready, "server ready");
  // Time/state invariants that matter to seekable exports and coherent motion.
  assert.deepEqual(stateAt(12), stateAt(12));
  assert.ok(stateAt(12).energy > stateAt(3).energy + 40);
  assert.equal(stateAt(14).completed, 0);
  assert.equal(stateAt(15).completed, 1);
  assert.equal(stateAt(39).completed, 2);
  assert.ok(stateAt(12).events.every((e) => e.at <= 12));
  const randomA = seeded(7),
    randomB = seeded(7);
  assert.deepEqual(
    Array.from({ length: 50 }, randomA),
    Array.from({ length: 50 }, randomB),
  );
  const clock = createClock();
  clock.tick(0);
  clock.tick(50);
  clock.pause();
  clock.tick(5000);
  assert.equal(clock.time, 0.05);
  clock.pause(false);
  clock.tick(9000);
  assert.equal(clock.time, 0.05);
  clock.tick(9050);
  assert.equal(clock.time, 0.1);
  clock.tick(9999, false);
  assert.equal(clock.time, 0.1);
  browser = await chromium.launch({
    headless: true,
    args:
      process.platform === "win32" ? ["--use-angle=d3d11", "--enable-gpu"] : [],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(origin + "/?t=12");
  await page.waitForFunction(() => Boolean(window.exhibit));
  await page.waitForTimeout(300);
  assert.equal(
    await page.locator("html").getAttribute("data-renderer"),
    "webgl",
  );
  const captures = [];
  for (const [name, t] of [
    ["opening", 0],
    ["build", 8],
    ["climax", 12],
    ["release", 17],
    ["recovery", 22],
  ]) {
    await page.evaluate((t) => window.exhibit.seek(t), t);
    await page.screenshot({ path: `${output}/${name}.png` });
    captures.push({ name, time: t });
  }
  await page.evaluate(() => window.exhibit.seek(12));
  const first = await page.screenshot();
  await page.waitForTimeout(180);
  assert.ok(first.equals(await page.screenshot()), "paused pixels stable");
  await page.evaluate(() => window.exhibit.seek(3));
  await page.evaluate(() => window.exhibit.seek(12));
  assert.ok(
    first.equals(await page.screenshot()),
    "seeking reconstructs exact pixels",
  );
  await page.locator('[data-station="4"]').click();
  assert.equal(await page.locator("#station-name").textContent(), "MNEME");
  await page.locator("#scenario").selectOption("storm");
  assert.ok(Number(await page.locator("#energy").textContent()) > 100);
  await page.locator("#pause").click();
  await page.waitForTimeout(350);
  await page.locator("#pause").click();
  const paused = await page.evaluate(() => window.exhibit.state().time);
  assert.ok(paused > 12);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => window.exhibit.state().time), paused);
  await page.locator("#climax").click();
  assert.equal(await page.locator("#pause").textContent(), "Pause");
  await page.locator("#capture").click();
  assert.ok(page.url().includes("t="));
  await page.goto(origin + "/?t=12&hud=0");
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${output}/hero-only.png` });
  await page.setViewportSize({ width: 390, height: 860 });
  await page.goto(origin + "/?t=12");
  await page.waitForTimeout(200);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "portrait horizontal fit",
  );
  const bounds = await page.locator(".station").evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, r: r.right, b: r.bottom };
    }),
  );
  for (let i = 0; i < bounds.length; i++)
    for (let j = i + 1; j < bounds.length; j++) {
      const a = bounds[i],
        b = bounds[j];
      assert.ok(
        !(a.x < b.r && a.r > b.x && a.y < b.b && a.b > b.y),
        "portrait station labels do not overlap",
      );
    }
  await page.screenshot({ path: `${output}/portrait.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(origin);
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.exhibit.state().time), 12);
  assert.equal(await page.locator("#pause").textContent(), "Resume");
  await page.goto(origin + "/?t=12&fallback=1");
  assert.equal(await page.locator("html").getAttribute("data-renderer"), "svg");
  await page.screenshot({ path: `${output}/fallback.png` });
  await page.locator('[data-station="1"]').click();
  assert.equal(await page.locator("#station-name").textContent(), "PARALLAX");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(origin + "/?t=12&world=market");
  await page.waitForTimeout(200);
  assert.equal(await page.title(), "BASILISK / Liquidity engine");
  assert.equal(await page.locator("#phase").textContent(), "LIQUIDITY SHOCK");
  assert.equal(await page.locator("#station-name").textContent(), "DARK POOL");
  await page.screenshot({ path: `${output}/market.png` });
  await page.evaluate(() => window.exhibit.seek(17));
  await page.screenshot({ path: `${output}/market-release.png` });
  await page.setViewportSize({ width: 390, height: 860 });
  await page.evaluate(() => window.exhibit.seek(12));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${output}/market-portrait.png` });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(origin + "/?t=12");
  await page.waitForTimeout(200);
  // Actual context loss, in addition to the explicit fallback entrypoint.
  await page.evaluate(() =>
    document
      .querySelector("canvas")
      .getContext("webgl2")
      .getExtension("WEBGL_lose_context")
      .loseContext(),
  );
  await page.waitForFunction(
    () => document.documentElement.dataset.renderer === "svg",
  );
  // Record one whole cycle with live playback; do not manufacture motion from stills.
  const videoContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: output, size: { width: 1440, height: 900 } },
  });
  const motionPage = await videoContext.newPage();
  motionPage.on("pageerror", (e) => errors.push(e.message));
  await motionPage.goto(origin + "/?t=0");
  await motionPage.waitForFunction(() => Boolean(window.exhibit));
  await motionPage.locator("#pause").click();
  await motionPage.waitForFunction(
    () => window.exhibit.state().time >= 24,
    {},
    { timeout: 90000 },
  );
  await motionPage.locator("#pause").click();
  const performance = await motionPage.evaluate(() => {
    const gl = document.querySelector("canvas").getContext("webgl2"),
      extension = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      ua: navigator.userAgent,
      gpu: extension
        ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
        : "unavailable",
      ...window.exhibit.stats(),
    };
  });
  const video = motionPage.video();
  await videoContext.close();
  await video.saveAs(`${output}/cycle.webm`);
  assert.deepEqual(errors, []);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        captures,
        performance,
        checks: [
          "director state/clock",
          "WebGL and shader errors",
          "five phase captures",
          "pixel-stable pause",
          "pixel-stable seek",
          "station selection",
          "scenario",
          "resume",
          "climax",
          "freeze URL",
          "portrait fit and label collisions",
          "reduced motion",
          "SVG fallback",
          "actual context loss",
          "full 24-second live cycle",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: director, optics, controls, deterministic pixels, portrait, reduced motion, fallback/context loss, full-cycle recording.",
  );
  console.log(JSON.stringify(performance));
} finally {
  await browser?.close();
  server.kill();
}
