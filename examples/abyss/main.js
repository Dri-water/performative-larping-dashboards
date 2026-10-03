import * as T from "three";
import { createOptics } from "./optics.mjs";
import { createWork } from "./work.js";
import { marketAt } from "./orders.js";
const q = new URLSearchParams(location.search);
if (q.has("hero")) document.body.classList.add("hero");
const host = document.createElement("div");
host.style.cssText = "position:fixed;inset:0";
document.body.prepend(host);
let optics;
try {
  optics = createOptics({
    container: host,
    background: 0x030a12,
    bloomStrength: 0.5,
  });
} catch (e) {
  document.querySelector(".fallback").style.display = "block";
  throw e;
}
const { scene, camera, renderer } = optics;
scene.fog = new T.FogExp2(0x030a12, 0.015);
scene.environmentIntensity = 0.75;
const root = new T.Group();
scene.add(root);
let seed = 447;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const cube = new T.BoxGeometry(1, 1, 1);
const metal = [
  new T.MeshStandardMaterial({
    color: 0x477789,
    metalness: 0.72,
    roughness: 0.27,
  }),
  new T.MeshStandardMaterial({
    color: 0xaa7151,
    metalness: 0.73,
    roughness: 0.28,
  }),
];
const black = new T.MeshStandardMaterial({
  color: 0x0b1d28,
  metalness: 0.65,
  roughness: 0.32,
});
const glow = [
  new T.MeshBasicMaterial({ color: new T.Color(0.15, 0.75, 1.25) }),
  new T.MeshBasicMaterial({ color: new T.Color(1.65, 0.7, 0.22) }),
];
const white = new T.MeshBasicMaterial({ color: new T.Color(1.9, 1.5, 1.05) });
function block(parent, x, y, z, sx, sy, sz, mat) {
  const m = new T.Mesh(cube, mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  parent.add(m);
  return m;
}
function line(parent, points, color, opacity = 1) {
  const l = new T.Line(
    new T.BufferGeometry().setFromPoints(points),
    new T.LineBasicMaterial({ color, transparent: true, opacity }),
  );
  parent.add(l);
  return l;
}
const wings = [];
const inserts = new T.InstancedMesh(cube, white, 1800);
let ni = 0;
const dummy = new T.Object3D();
for (let side = -1; side <= 1; side += 2) {
  const idx = side < 0 ? 0 : 1;
  for (let r = 0; r < 20; r++) {
    const z = (r - 9.5) * 1.12;
    const g = new T.Group();
    g.position.set(side * 2, 0, z);
    root.add(g);
    const span = 3.8 + Math.sin(r * 0.48) * 0.8 + rnd() * 0.6;
    const tall = 1.7 + Math.sin(r * 0.29) * 0.5;
    for (let l = 0; l < 8; l++) {
      const w = span * (1 - l * 0.048);
      block(
        g,
        side * w * 0.5,
        l * 0.31,
        0,
        w,
        0.18,
        0.88,
        l % 3 ? metal[idx] : black,
      );
      block(
        g,
        side * w * 0.5,
        l * 0.31 + 0.095,
        -0.445,
        w,
        0.028,
        0.024,
        glow[idx],
      );
      if (l % 2 === 0) {
        block(
          g,
          side * w * 0.88,
          l * 0.31 + 0.14,
          0,
          0.35,
          0.09,
          0.74,
          metal[1 - idx],
        );
      }
    }
    for (let k = 0; k < 5; k++) {
      block(
        g,
        side * (0.7 + k * 0.58),
        2.4 + k * 0.14,
        0,
        0.2,
        0.2,
        0.64,
        black,
      );
      block(
        g,
        side * (0.7 + k * 0.58),
        2.51 + k * 0.14,
        0,
        0.12,
        0.026,
        0.5,
        glow[idx],
      );
    }
    const spar = block(
      g,
      side * span * 0.55,
      1.15,
      0,
      0.15,
      3,
      0.97,
      metal[idx],
    );
    if (r % 3 === 0) {
      block(g, side * (span + 0.4), 0.5, 0, 0.55, 1.6, 0.63, black);
      block(g, side * (span + 0.4), 1.4, 0, 0.5, 0.08, 0.58, glow[idx]);
    }
    wings.push({ g, side, r, span });
  }
}
// Exposed ladder bridges and a densely machined interior keel.
for (let r = 0; r < 42; r++) {
  const z = (r - 20.5) * 0.56;
  block(root, 0, -0.55, z, 4.1, 0.12, 0.18, metal[r % 2]);
  block(root, 0, -0.45, z, 2.6, 0.03, 0.07, glow[r % 2]);
  for (let s = -1; s <= 1; s += 2) {
    block(root, s * 1.5, -0.2, z, 0.12, 0.8, 0.12, metal[0]);
    for (let k = 0; k < 4; k++) {
      dummy.position.set(s * (0.3 + k * 0.3), -0.34, z);
      dummy.scale.set(0.035, 0.025, 0.12);
      dummy.updateMatrix();
      inserts.setMatrixAt(ni++, dummy.matrix);
    }
  }
}
inserts.count = ni;
root.add(inserts);
// Towers of execution volume: irregular depth, dark backs, luminous moving fronts.
const curtains = [];
for (let s = -1; s <= 1; s += 2) {
  const group = new T.Group();
  group.position.set(s * 10.8, -0.3, -4);
  root.add(group);
  for (let j = 0; j < 28; j++) {
    const h = 3 + rnd() * 6;
    block(group, 0, h * 0.5, (j - 14) * 0.62, 0.32, h, 0.35, black);
    const bar = block(
      group,
      -s * 0.2,
      h * 0.5,
      (j - 14) * 0.62,
      0.085,
      h,
      0.25,
      glow[s < 0 ? 0 : 1],
    );
    curtains.push({ bar, h, j, s });
    block(
      group,
      0,
      h + 0.16,
      (j - 14) * 0.62,
      0.65,
      0.12,
      0.42,
      metal[s < 0 ? 0 : 1],
    );
  }
}
// Broad volatility membrane: authored surface with a funnel deformation.
const nx = 64,
  nz = 68,
  mempos = new Float32Array((nx + 1) * (nz + 1) * 3),
  indices = [];
for (let z = 0; z < nz; z++)
  for (let x = 0; x < nx; x++) {
    const a = z * (nx + 1) + x;
    indices.push(a, a + 1, a + nx + 1, a + 1, a + nx + 2, a + nx + 1);
  }
const mg = new T.BufferGeometry();
mg.setAttribute("position", new T.BufferAttribute(mempos, 3));
mg.setIndex(indices);
const membrane = new T.Mesh(
  mg,
  new T.MeshPhysicalMaterial({
    color: 0x277c9a,
    metalness: 0.25,
    roughness: 0.35,
    transparent: true,
    opacity: 0.11,
    side: T.DoubleSide,
    depthWrite: false,
  }),
);
root.add(membrane);
const contour = new T.Mesh(
  mg,
  new T.MeshBasicMaterial({
    color: 0x63bdd7,
    wireframe: true,
    transparent: true,
    opacity: 0.075,
    depthWrite: false,
  }),
);
root.add(contour);
// Massive cross-venue circulation loops, each with a distinct route and phase.
const routes = [],
  packets = [];
for (let k = 0; k < 7; k++) {
  const z = (k - 3) * 3;
  const points = [
    new T.Vector3(-9, 0.8, z - 1),
    new T.Vector3(-6, 7.8 + k * 0.25, z - 3),
    new T.Vector3(0, 9.2 + Math.sin(k) * 1.2, z),
    new T.Vector3(6, 7.4, z + 3),
    new T.Vector3(9, 1.1, z + 1),
  ];
  const curve = new T.CatmullRomCurve3(points);
  const pipe = new T.Mesh(
    new T.TubeGeometry(curve, 80, 0.036, 5, false),
    k % 2 ? glow[1] : glow[0],
  );
  root.add(pipe);
  routes.push({ curve, pipe });
  for (let p = 0; p < 6; p++) {
    const m = new T.Mesh(new T.SphereGeometry(0.085, 5, 4), white);
    root.add(m);
    packets.push({ m, k, p });
  }
}
const arteries = [];
for (let k = 0; k < 24; k++) {
  const pts = [];
  for (let j = 0; j < 100; j++) {
    const z = (j / 99 - 0.5) * 36;
    pts.push(
      new T.Vector3(
        Math.sin(z * 0.26 + k * 0.04) * (0.5 + k * 0.02),
        0.1 + k * 0.055 + Math.sin(z * 0.34) * 0.25,
        z,
      ),
    );
  }
  const mesh = new T.Mesh(
    new T.TubeGeometry(
      new T.CatmullRomCurve3(pts),
      100,
      k % 6 === 0 ? 0.06 : 0.016,
      5,
      false,
    ),
    k % 6 === 0 ? white : glow[k % 2],
  );
  root.add(mesh);
  arteries.push(mesh);
}
const pc = 2200,
  pp = new Float32Array(pc * 3),
  pb = Array.from({ length: pc }, () => [rnd(), rnd(), rnd()]);
const pg = new T.BufferGeometry();
pg.setAttribute("position", new T.BufferAttribute(pp, 3));
const dust = new T.Points(
  pg,
  new T.PointsMaterial({
    color: 0xc6f5ff,
    size: 0.035,
    transparent: true,
    opacity: 0.75,
  }),
);
root.add(dust);
// Engraved floor/foreground perimeter and massive suspension ribs.
const grid = new T.GridHelper(65, 100, 0x386478, 0x152f42);
grid.position.y = -1;
grid.material.transparent = true;
grid.material.opacity = 0.26;
root.add(grid);
for (let side = -1; side <= 1; side += 2) {
  for (let j = 0; j < 5; j++) {
    const z = (j - 2) * 5;
    const pts = [
      new T.Vector3(side * 11, -1, z),
      new T.Vector3(side * 11, 3, z),
      new T.Vector3(side * 9, 10.5, z),
      new T.Vector3(side * 4, 12, z),
    ];
    line(root, pts, 0x3f6f86, 0.55);
    for (let k = 0; k < 12; k++)
      block(root, side * 10.8, k * 0.42, z, 0.25, 0.03, 0.18, metal[0]);
  }
}

// Rear spectral terraces: stacked yield profiles and measuring plates.
const spectra = [];
for (let row = 0; row < 8; row++) {
  const group = new T.Group();
  group.position.set(0, 1.2 + row * 1.15, -15 - row * 0.12);
  root.add(group);
  const pts = [];
  for (let j = 0; j < 100; j++) {
    const x = (j / 99 - 0.5) * 23;
    pts.push(
      new T.Vector3(
        x,
        0.2 +
          Math.sin(j * 0.19 + row * 0.6) * 0.18 +
          Math.exp(-Math.pow((j - 45 - row * 2) / 13, 2)) * 1.4,
        0,
      ),
    );
  }
  const curve = line(group, pts, row % 2 ? 0xa87a57 : 0x518ca0, 0.7);
  line(
    group,
    [new T.Vector3(-12, 0, 0), new T.Vector3(12, 0, 0)],
    0x345268,
    0.5,
  );
  for (let j = 0; j < 48; j++)
    block(group, (j - 24) * 0.5, -0.14, 0, 0.017, 0.14, 0.08, metal[row % 2]);
  spectra.push(curve);
}
function label(text, x, y, z, color) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(3,12,19,.8)";
  ctx.fillRect(0, 0, 768, 128);
  ctx.fillStyle = color;
  ctx.font = "30px Consolas";
  ctx.fillText(text, 18, 47);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(18, 65);
  ctx.lineTo(750, 65);
  ctx.stroke();
  ctx.font = "17px Consolas";
  ctx.fillText("SYNTHETIC / DEPTH VECTOR  00.819 · 128 VENUES", 18, 96);
  const tex = new T.CanvasTexture(c);
  const mesh = new T.Mesh(
    new T.PlaneGeometry(6, 1),
    new T.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: T.DoubleSide,
    }),
  );
  mesh.position.set(x, y, z);
  root.add(mesh);
  return mesh;
}
label("Σ  VOLATILITY SURFACE / VIX", 0, 12, -12, "#98bdce");
label("BID RESERVOIR / 8.71T", -9, 10, 4, "#8cc3d6");
label("ASK RESERVOIR / 9.02T", 9, 10, 1, "#d7ad8c");
let portrait = false;
function resize() {
  portrait = innerWidth < 600;
  optics.resize();
  draw();
}
addEventListener("resize", resize);
let time = q.has("t") ? Number(q.get("t")) : 3;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced && !q.has("t")) time = 11;
let paused = q.has("t") || reduced,
  last = performance.now(),
  mode = 1;
const pause = document.querySelector("#pause");
pause.textContent = paused ? "PLAY" : "PAUSE";
pause.onclick = () => {
  paused = !paused;
  pause.textContent = paused ? "PLAY" : "PAUSE";
  last = performance.now();
};
document.querySelector("#rupture").textContent = "NEXT ARRIVAL";
document.querySelector("#rupture").onclick = () => {
  time = Math.ceil((time + 20) / 1.25) * 1.25 - 20 + 0.05;
  draw();
};
document.querySelector("#mode").remove();
const work = createWork(root, camera);
let blocked = false;
work.block.onclick = () => {
  blocked = !blocked;
  work.block.textContent = blocked ? "RESTORE NOVA" : "BLOCK NOVA";
  draw();
};
dust.visible = false;
routes.forEach((r) => (r.pipe.visible = false));
packets.forEach((p) => (p.m.visible = false));
arteries.forEach((m, i) => (m.visible = i % 6 === 0));

function stateAt(t) {
  const p = ((t % 20) + 20) % 20;
  const a = Math.max(0, Math.min(1, (p - 5) / 4)),
    b = Math.max(0, Math.min(1, (18 - p) / 4));
  const e = Math.min(a * a * (3 - 2 * a), b * b * (3 - 2 * b));
  return {
    p,
    e,
    phase:
      p < 5
        ? "ACCUMULATE"
        : p < 9
          ? "PRESSURE BUILD"
          : p < 14
            ? "SPREAD RUPTURE"
            : "RECONVERGENCE",
  };
}
function draw() {
  portrait = innerWidth < 600;
  const flow = marketAt(time + 20, blocked);
  const p = ((time % 20) + 20) % 20;
  const e = Math.min(1, flow.pressure * 0.6 + flow.clearing * 0.25);
  const phase = flow.focus?.reason ?? "WAITING";
  for (const w of wings) {
    const wave = Math.sin(w.r * 0.34 + time * 0.7);
    w.g.rotation.z =
      w.side * (e * (1.35 + Math.sin(w.r * 0.35) * 0.16) + wave * 0.025);
    w.g.position.y = e * (2.4 + Math.sin(w.r * 0.3) * 1.1) + wave * 0.12;
    w.g.position.x = w.side * (2 + e * 0.65);
    w.g.rotation.y = e * Math.sin(w.r * 0.23) * 0.27;
  }
  for (let z = 0; z <= nz; z++)
    for (let x = 0; x <= nx; x++) {
      const xx = (x / nx - 0.5) * 16,
        zz = (z / nz - 0.5) * 24;
      const r = Math.sqrt(xx * xx + zz * zz * 0.4);
      const n = (z * (nx + 1) + x) * 3;
      mempos[n] = xx;
      mempos[n + 1] =
        7.4 +
        Math.sin(xx * 0.7 + time * 0.4) * 0.35 +
        Math.cos(zz * 0.7 - time * 0.65) * 0.28 -
        e * 5.6 * Math.exp((-r * r) / 15);
      mempos[n + 2] = zz;
    }
  mg.attributes.position.needsUpdate = true;
  mg.computeVertexNormals();
  for (const c of curtains) {
    const f =
      0.2 +
      0.8 *
        (flow.live
          .filter((o) => o.stage === 4 && o.venue === (c.s < 0 ? 0 : 2))
          .reduce((n, o) => n + o.filled / o.size, 0) %
          1);
    c.bar.scale.y = c.h * (0.38 + f * 0.62);
    c.bar.position.y = c.bar.scale.y * 0.5 + e * Math.sin(c.j * 0.35) * 1.8;
    c.bar.material = glow[c.s < 0 ? 0 : 1];
  }
  for (const pck of packets) {
    const u = (time * (0.065 + pck.k * 0.007) + pck.p / 6) % 1;
    pck.m.position.copy(routes[pck.k].curve.getPoint(u));
  }
  for (let k = 0; k < arteries.length; k++) {
    arteries[k].position.x = (k % 2 ? 1 : -1) * e * (k / 24) * 2;
    arteries[k].position.y = e * (k / 24) * 6.5;
  }
  for (let i = 0; i < pc; i++) {
    const [a, b, c] = pb[i],
      z = ((a * 38 + time * (2 + c * 3)) % 38) - 19;
    pp[i * 3] = Math.sin(z * 0.26 + b * 0.7) + e * (b - 0.5) * 3;
    pp[i * 3 + 1] = 0.2 + c * 2 + e * b * 3;
    pp[i * 3 + 2] = z;
  }
  pg.attributes.position.needsUpdate = true;
  root.rotation.y = portrait ? -0.09 : -0.22;
  camera.position.set(
    portrait ? 1 : 20,
    portrait ? 23 : 18,
    portrait ? 37 : 26,
  );
  camera.position.x += Math.sin(time * 0.12) * 0.4;
  camera.fov = portrait ? 44 : 43;
  camera.updateProjectionMatrix();
  camera.lookAt(0, portrait ? 4 : 4.2, 0);
  camera.updateMatrixWorld();
  work.update(time, blocked);
  document.querySelector("#phase").textContent = phase;
  document.querySelector("#event").textContent = flow.clearing
    ? "SETTLEMENT WRITTEN"
    : flow.focus
      ? "ROUTING " + flow.focus.tag
      : "AWAITING FLOW";
  document.querySelector("#price").textContent =
    "$" +
    (flow.price / mode).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  document.querySelector(".title span").textContent =
    "BTC / USD · LAST SIMULATED FILL";
  document.querySelector("#trace").setAttribute(
    "d",
    flow.all
      .filter((o) => o.settled)
      .slice(0, 40)
      .reverse()
      .map((o, i) => `${i ? "L" : "M"}${i * 9},${70 - (o.price - 98410) * 0.6}`)
      .join(""),
  );
  optics.render();
  window.__state = {
    time,
    paused,
    mode,
    event: phase,
    blocked,
    flow,
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
  };
}
window.__seek = (t) => {
  time = t;
  draw();
};
window.__ready = true;
draw();
requestAnimationFrame(function frame(now) {
  requestAnimationFrame(frame);
  if (!document.hidden && !paused) {
    time += (now - last) / 1000;
    draw();
  }
  last = now;
});
document.addEventListener("visibilitychange", () => (last = performance.now()));
