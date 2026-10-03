#!/usr/bin/env node
/** Portable visual evidence capture. Requires Playwright in the target project. */
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const i = arg.indexOf("=");
    return i < 0 ? [arg, true] : [arg.slice(0, i), arg.slice(i + 1)];
  }),
);
if (args["--help"] || !args["--url"]) {
  console.log(
    "From the target project: node /path/to/skill/scripts/capture.mjs --url=http://127.0.0.1:5173 --out=visual-review --times=0,8,12,17,22 --record=24",
  );
  console.log(
    "The exhibit must honor ?t=seconds. Recording omits t and captures actual playback. Install Playwright in the target project first.",
  );
  process.exit(args["--help"] ? 0 : 1);
}
const base = new URL(args["--url"]);
if (!["http:", "https:"].includes(base.protocol))
  throw Error("Expected HTTP(S) URL");
const require = createRequire(resolve(process.cwd(), "package.json"));
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  throw Error(
    "Install Playwright in the target project, then run this script from that project.",
  );
}
const out = resolve(String(args["--out"] || "visual-review"));
const times = String(args["--times"] || "0,8,12,17,22")
  .split(",")
  .map(Number);
if (times.some((t) => !Number.isFinite(t) || t < 0))
  throw Error("Times must be finite nonnegative seconds");
const seconds = Number(args["--record"] || 0);
if (!Number.isFinite(seconds) || seconds < 0 || seconds > 120)
  throw Error("Record duration must be 0–120 seconds");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [],
  errors = [];
try {
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["portrait", 390, 860],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) =>
      errors.push({ viewport: name, message: e.message }),
    );
    for (const time of times) {
      const url = new URL(base);
      url.searchParams.set("t", String(time));
      await page.goto(url.href, { waitUntil: "networkidle" });
      await page.screenshot({ path: resolve(out, `${name}-${time}.png`) });
      results.push({
        viewport: name,
        width,
        height,
        time,
        file: `${name}-${time}.png`,
      });
    }
    await page.close();
  }
  if (seconds) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: out, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    const url = new URL(base);
    url.searchParams.delete("t");
    await page.goto(url.href, { waitUntil: "networkidle" });
    await page.waitForTimeout(seconds * 1000);
    const video = page.video();
    await context.close();
    await video.saveAs(resolve(out, "playback.webm"));
  }
  await writeFile(
    resolve(out, "manifest.json"),
    JSON.stringify(
      {
        url: base.href,
        recordedWallSeconds: seconds,
        results,
        errors,
        note: "Captures support editorial inspection. They do not certify visual quality or prove that the target honors t.",
      },
      null,
      2,
    ),
  );
  console.log(
    `Saved ${results.length} frames${seconds ? " and playback.webm" : ""} in ${out}. Inspect the images and motion before assigning a visual result.`,
  );
  if (errors.length)
    throw Error(`Observed ${errors.length} page errors; inspect manifest.json`);
} finally {
  await browser.close();
}
