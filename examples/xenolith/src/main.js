import "./style.css";
import {
  createClock,
  stateAt as directorState,
  stations as defaultStations,
} from "../../../skills/performative-larping-dashboards/assets/director.mjs";
import { createScene } from "./scene.js";
const $ = (s) => document.querySelector(s),
  params = new URLSearchParams(location.search);
if (params.get("hud") === "0")
  document.documentElement.classList.add("hero-only");
const market = params.get("world") === "market";
const stations = market
  ? defaultStations.map((s, i) => ({
      ...s,
      name: [
        "BID WALL",
        "ASK WALL",
        "DARK POOL",
        "FLOW DELTA",
        "BASIS",
        "LIQUIDITY",
      ][i],
      role: [
        "buy-side depth",
        "sell-side depth",
        "hidden volume",
        "aggressive flow",
        "cross-market spread",
        "consolidated book",
      ][i],
      code: ["BID", "ASK", "VOL", "NET", "SPR", "L2"][i],
    }))
  : defaultStations;
const marketPhases = [
  "ACCUMULATE",
  "PRICE DISCOVERY",
  "COMPRESSION",
  "LIQUIDITY SHOCK",
  "SWEEP",
  "REBALANCE",
];
const marketEvents = [
  "Depth acquired",
  "Price surface reconstructed",
  "Spread compression detected",
  "Liquidity shock propagating",
  "Order book swept",
  "Depth rebalanced",
];
function stateAt(t, mode) {
  const s = directorState(t, mode);
  if (!market) return s;
  const events = s.events.map((e) => ({
    ...e,
    label: marketEvents[Number(e.id.split("-").at(-1))],
  }));
  return { ...s, phaseName: marketPhases[s.phase], event: events[0], events };
}
if (market) {
  document.title = "BASILISK / Liquidity engine";
  $(".identity p").innerHTML =
    "SYNTHETIC MARKET MICROSTRUCTURE <span> / </span> TERMINAL 09";
  $("h1").innerHTML = "BASILISK<span>流動性</span>";
  $(".header-center").innerHTML =
    '<span class="signal-dot"></span> LIQUIDITY IS A PHYSICAL FORCE <small>SIMULATED MARKET · NO REAL ORDERS</small>';
  $(".scene-caption").innerHTML =
    "<span>EVERY PRICE HAS GRAVITY.</span><strong>The market beneath the market.</strong><p>VOLUMETRIC ORDER BOOK / SYNTHETIC VENUE 04</p>";
  $(".left-top h2").innerHTML = "<b>01</b> SPREAD COMPRESSION <span>L2</span>";
  $(".metric small").textContent = "BOOK COHERENCE";
  $(".right-top h2").innerHTML = "<b>02</b> IMPLIED VOLATILITY <span>IV</span>";
  $(".left-bottom h2").innerHTML =
    '<b>03</b> DEPTH INSPECTOR <span id="station-code">VOL</span>';
  $(".right-bottom h2").innerHTML = "<b>04</b> MARKET TAPE <span>TRACE</span>";
  $(".transit>span").textContent = "SIMULATED SWEEPS";
  $(".state-caption>span").textContent = "MARKET REGIME";
  $(".energy>span").textContent = "FLOW INTENSITY";
  $("#climax").textContent = "Sweep book";
  $("#beats").innerHTML = marketPhases.map((p) => `<i>${p}</i>`).join("");
  $(".micro-copy").innerHTML = "VENUE: SYNTHETIC<br>ORDERS: VISUALIZATION ONLY";
  $(".coordinate-strip").innerHTML =
    "<span>INSTRUMENT <b>BTC / USD · SYNTHETIC</b></span><span>DEPTH VOLUME <b>24 × 36 × 2</b></span><span>MARKET FEED <b>SIMULATED</b></span>";
  $('#scenario option[value="contact"]').textContent = "Normal flow";
  $('#scenario option[value="storm"]').textContent = "Liquidity shock";
  $('#scenario option[value="silent"]').textContent = "Thin book";
  $("#world").setAttribute(
    "aria-label",
    "A three-dimensional canyon of order-book strata, flowing price ribbons, and scanning volume surfaces",
  );
}
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const clock = createClock({
  time: params.has("t")
    ? Number(params.get("t")) || 0
    : motion.matches
      ? 12
      : 9,
  paused: params.has("t") || motion.matches,
});
let scenario = params.get("mode") || "contact",
  selected = 2;
if (!["contact", "storm", "silent"].includes(scenario)) scenario = "contact";
$("#scenario").value = scenario;
$("#stations").innerHTML = stations
  .map(
    (a, i) =>
      `<button class="station" data-station="${i}" aria-pressed="${i === selected}"><small>0${i + 1} / ${a.code}</small><strong>${a.name}</strong><span class="activity"></span></button>`,
  )
  .join("");
$("#matrix").innerHTML = Array.from({ length: 144 }, () => "<i></i>").join("");
$("#energy-bars").innerHTML = Array.from({ length: 26 }, () => "<i></i>").join(
  "",
);
$("#channels").innerHTML = ["BUS A", "BUS B", "BUS C"]
  .map((a) => `<div><label>${a}</label><span><i></i></span><b></b></div>`)
  .join("");
const graphics = createScene($("#world"), {
  fallback: params.get("fallback") === "1",
  seed: 17,
  world: market ? "market" : "vessel",
});
const stationEls = [...document.querySelectorAll(".station")];
const matrixEls = [...document.querySelectorAll("#matrix i")];
const energyEls = [...document.querySelectorAll("#energy-bars i")];
let lastDOM = -Infinity,
  previousEvent = "",
  frames = 0;
const timings = [];
const intervals = [];
let lastActiveFrame;
function optics(s) {
  graphics.render(s);
  frames++;
  document.documentElement.dataset.time = s.time.toFixed(3);
  document.documentElement.dataset.phase = s.phaseName;
  const mobile = innerWidth < 700;
  const links = stationEls.map((el, i) => {
    const p = graphics.project(i);
    // Label lanes keep projected instruments out of the peripheral telemetry.
    const x = mobile
      ? innerWidth * [0.82, 0.5, 0.18, 0.18, 0.5, 0.82][i]
      : Math.max(310, Math.min(innerWidth - 310, p.x));
    const y = mobile
      ? [356, 327, 356, 414, 435, 414][i]
      : Math.max(270, Math.min($("#bridge").clientHeight - 265, p.y));
    el.style.left = x + "px";
    el.style.top = y + "px";
    return `<path d="M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${i === selected ? "#e9ab73" : "#6597a6"}" stroke-width=".7"/><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="none" stroke="#91b9c3" stroke-width=".7"/>`;
  });
  $("#connections").innerHTML = links.join("");
}
function instruments(s) {
  $("#clock").textContent = new Date(s.time * 1000).toISOString().slice(11, 23);
  $("#renderer").textContent =
    document.documentElement.dataset.renderer === "webgl"
      ? "WEBGL / OPTICS ONLINE"
      : "STATIC / GRAPHICS FALLBACK";
  $("#pause").textContent = clock.paused ? "Resume" : "Pause";
  $("#pause").setAttribute("aria-pressed", String(clock.paused));
  $("#play-state").textContent = clock.paused
    ? "HELD FRAME"
    : "SEQUENCE ACTIVE";
  $("#coherence").textContent = s.coherence.toFixed(1);
  $("#phase").textContent = s.phaseName;
  $("#event-label").textContent = s.event.label;
  $("#energy").textContent = s.energy.toFixed(1);
  $("#cycle").textContent = String(s.cycle + 1).padStart(3, "0");
  $("#completed").textContent = String(s.completed).padStart(4, "0");
  $("#countdown").textContent = s.local.toFixed(1) + " / 24s";
  document
    .querySelectorAll("#beats i")
    .forEach((el, i) => el.classList.toggle("active", i === s.phase));
  energyEls.forEach(
    (el, i) => (el.style.opacity = i / 26 < s.energy / 112 ? 1 : 0.12),
  );
  stationEls.forEach((el, i) => {
    el.setAttribute("aria-pressed", String(i === selected));
    el.dataset.active = String(i === s.active);
    el.style.setProperty("--load", s.loads[i] * 100 + "%");
  });
  const a = stations[selected];
  $("#station-name").textContent = a.name;
  $("#station-code").textContent = a.code;
  $("#station-role").textContent = a.role;
  $("#station-number").textContent = String(selected + 1).padStart(2, "0");
  $("#station-status").textContent =
    selected === s.active
      ? s.event.label
      : "Continuous field analysis · linked";
  document.querySelectorAll("#channels>div").forEach((el, i) => {
    const n =
      (s.loads[selected] * 0.8 + 0.12 * Math.sin(s.time * 0.3 + i)) * 100;
    el.querySelector("i").style.width = n + "%";
    el.querySelector("b").textContent = n.toFixed(0) + "%";
  });
  const waveform = Array.from({ length: 110 }, (_, i) => {
    const amp =
      10 + Math.sin(i * 0.11 + s.time * 0.6) ** 8 * (15 + s.ignition * 14);
    return `${i ? "L" : "M"}${(i * 260) / 109},${41 + Math.sin(i * 0.76 - s.time * 1.4) * amp}`;
  }).join(" ");
  $("#wave").innerHTML =
    `<path d="M0 20H260M0 41H260M0 62H260" stroke="#466c7a33"/><path d="${waveform}" stroke="#88e8ed" stroke-width="1" fill="none"/><path d="M${(s.local / 24) * 260} 0V82" stroke="#f8b278" stroke-width=".7"/>`;
  $("#tomography").innerHTML = Array.from({ length: 10 }, (_, j) => {
    const path = Array.from({ length: 50 }, (_, i) => {
      let x = i * 5.1,
        y =
          93 -
          j * 5 -
          Math.exp(-(((i - 25) / 12) ** 2)) *
            (20 + Math.sin(i * 0.26 + j * 0.5 + s.time * 0.4) * 20);
      return `${i ? "L" : "M"}${x},${y}`;
    }).join(" ");
    return `<path d="${path}" fill="none" stroke="${j % 3 ? "#598899" : "#ecae75"}" stroke-width=".7"/>`;
  }).join("");
  matrixEls.forEach(
    (el, i) =>
      (el.style.opacity = 0.08 + Math.sin(i * 2.1 + s.time * 0.2) ** 8 * 0.7),
  );
  if (previousEvent !== s.event.id) {
    $("#events").innerHTML = s.events
      .map(
        (e) =>
          `<div data-event="${e.id}"><time>${String(Math.floor(e.at / 60)).padStart(2, "0")}:${String(e.at % 60).padStart(2, "0")}</time><span>${e.label}</span></div>`,
      )
      .join("");
    previousEvent = s.event.id;
  }
}
function draw() {
  const s = stateAt(clock.time, scenario);
  optics(s);
  instruments(s);
}
$("#pause").onclick = () => {
  clock.pause(!clock.paused);
  draw();
};
$("#climax").onclick = () => {
  clock.seek(Math.floor(clock.time / 24) * 24 + 11);
  clock.pause(false);
  draw();
};
$("#capture").onclick = () => {
  clock.pause();
  const url = new URL(location.href);
  url.searchParams.set("t", clock.time.toFixed(3));
  url.searchParams.set("mode", scenario);
  history.replaceState(null, "", url);
  draw();
};
$("#scenario").onchange = (e) => {
  scenario = e.target.value;
  draw();
};
$("#stations").onclick = (e) => {
  const el = e.target.closest("button");
  if (el) {
    selected = Number(el.dataset.station);
    draw();
  }
};
motion.addEventListener("change", (e) => {
  if (e.matches) {
    clock.seek(12);
    clock.pause();
    draw();
  }
});
let resized = false;
new ResizeObserver(() => {
  resized = true;
}).observe($("#world"));
function frame(now) {
  const before = performance.now();
  clock.tick(now, !document.hidden);
  if (!document.hidden && (!clock.paused || resized)) {
    if (lastActiveFrame !== undefined) {
      intervals.push(now - lastActiveFrame);
      if (intervals.length > 180) intervals.shift();
    }
    lastActiveFrame = now;
    const s = stateAt(clock.time, scenario);
    optics(s);
    if (now - lastDOM > 100 || resized) {
      instruments(s);
      lastDOM = now;
    }
    resized = false;
    timings.push(performance.now() - before);
    if (timings.length > 180) timings.shift();
  } else lastActiveFrame = undefined;
  requestAnimationFrame(frame);
}
// Capture/test API: exact frame seek uses the same render path as real playback.
window.exhibit = {
  seek(t) {
    clock.seek(t);
    clock.pause();
    draw();
  },
  state: () => stateAt(clock.time, scenario),
  stats: () => ({
    frames,
    render: graphics.stats,
    samples: timings.length,
    meanFrameWorkMs: timings.reduce((a, b) => a + b, 0) / (timings.length || 1),
    meanFrameIntervalMs:
      intervals.reduce((a, b) => a + b, 0) / (intervals.length || 1),
  }),
};
addEventListener("pagehide", () => graphics.dispose(), { once: true });
draw();
requestAnimationFrame(frame);
