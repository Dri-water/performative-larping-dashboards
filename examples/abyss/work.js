import * as T from "three";
import "./work.css";
import { marketAt, stages, venues } from "./orders.js";

export function createWork(root, camera) {
  document.querySelector(".axis").remove();
  document.querySelector(".rail").remove();
  document.querySelector(".title").innerHTML =
    'CROSS-VENUE EXECUTION ENGINE<b id="price"></b><span></span>';
  document.querySelector(".status").innerHTML =
    "SIMULATED EXCHANGE<br>ORDER FLOW / RISK / CLEARING";
  document.querySelector(".hud").insertAdjacentHTML(
    "beforeend",
    `
    <section class="intake panel"><div class="eyebrow">01 / ORDER INGRESS <em>STREAMING</em></div><div id="tickets"></div></section>
    <section class="routing panel"><div class="eyebrow">02 / VENUE COMPARISON</div><div id="route-focus"></div><div id="venues"></div><div class="decision" id="decision"></div></section>
    <section class="receipts panel"><div class="eyebrow">06 / CLEARING RECEIPTS</div><div id="receipts"></div></section>
    <section class="pipeline">${stages.map((s, i) => `<div class="process" id="stage-${i}"><div class="eyebrow">0${i + 1} / ${s}<b id="count-${i}"></b></div><div class="work-id" id="id-${i}"></div><div class="meter"><i id="meter-${i}"></i></div><small id="detail-${i}"></small></div>`).join("")}</section>
    <div class="projection" id="work-labels">${stages.map((s, i) => `<div id="anchor-${i}"><b>0${i + 1} ${s}</b><span></span></div>`).join("")}</div>`,
  );
  const block = document.createElement("button");
  block.id = "block";
  block.textContent = "BLOCK NOVA";
  document
    .querySelector("footer")
    .insertBefore(block, document.querySelector("footer span"));
  const nodes = stages.map(
    (_, i) =>
      new T.Vector3((i % 2 ? 1 : -1) * 3.8, 3.2 + i * 0.32, 11 - i * 4.4),
  );
  const nodesGroup = new T.Group();
  root.add(nodesGroup);
  const lamps = nodes.map((v, i) => {
    const g = new T.Group();
    g.position.copy(v);
    nodesGroup.add(g);
    const base = new T.Mesh(
      new T.CylinderGeometry(0.7, 0.9, 0.14, 32),
      new T.MeshBasicMaterial({
        color: 0x315569,
        transparent: true,
        opacity: 0.7,
      }),
    );
    g.add(base);
    const ring = new T.Mesh(
      new T.TorusGeometry(0.7, 0.035, 6, 48),
      new T.MeshBasicMaterial({ color: 0xffbc72 }),
    );
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    const scan = new T.Mesh(
      new T.PlaneGeometry(1.7, 2.1),
      new T.MeshBasicMaterial({
        color: 0x79d4ee,
        transparent: true,
        opacity: 0.12,
        side: T.DoubleSide,
        depthWrite: false,
      }),
    );
    scan.position.y = 1;
    g.add(scan);
    return { g, ring, scan };
  });
  const curves = nodes.slice(0, -1).map((v, i) => {
    const end = nodes[i + 1],
      mid = v.clone().lerp(end, 0.5);
    mid.y += 2.1;
    const curve = new T.QuadraticBezierCurve3(v, mid, end);
    const geo = new T.BufferGeometry().setFromPoints(curve.getPoints(60));
    nodesGroup.add(
      new T.Line(
        geo,
        new T.LineBasicMaterial({
          color: 0x83cadc,
          transparent: true,
          opacity: 0.3,
        }),
      ),
    );
    return curve;
  });
  // Routing is spatial: a blocked venue changes the packet's visible path.
  const venuePaths = venues.map((name, i) => {
    const gate = nodes[3].clone().lerp(nodes[4], 0.5);
    gate.x += (i - 1) * 5;
    gate.y += 3;
    const curve = new T.CatmullRomCurve3([nodes[3], gate, nodes[4]]);
    const material = new T.LineBasicMaterial({
      color: 0xdcb584,
      transparent: true,
      opacity: 0.5,
    });
    nodesGroup.add(
      new T.Line(
        new T.BufferGeometry().setFromPoints(curve.getPoints(60)),
        material,
      ),
    );
    const beacon = new T.Mesh(
      new T.OctahedronGeometry(0.32),
      new T.MeshBasicMaterial({ color: 0xffcb88 }),
    );
    beacon.position.copy(gate);
    nodesGroup.add(beacon);
    const label = document.createElement("div");
    label.className = "venue-label";
    label.innerHTML = `<b>${name}</b><span></span>`;
    document.querySelector("#work-labels").append(label);
    return { curve, material, beacon, label, gate };
  });
  const tokens = Array.from({ length: 16 }, () => {
    const m = new T.Mesh(
      new T.OctahedronGeometry(0.19),
      new T.MeshBasicMaterial({ color: 0xbdf4ff }),
    );
    nodesGroup.add(m);
    return m;
  });
  const proj = new T.Vector3();
  function update(time, blocked) {
    const s = marketAt(time + 20, blocked);
    const fmt = (n) => n.toFixed(2);
    venuePaths.forEach((v, i) => {
      v.material.opacity = blocked && i === 1 ? 0.07 : 0.45;
      v.beacon.material.color.setHex(blocked && i === 1 ? 0x9d4843 : 0xffcb88);
      proj.copy(v.gate).applyMatrix4(root.matrixWorld).project(camera);
      v.label.style.left = (proj.x * 0.5 + 0.5) * innerWidth + "px";
      v.label.style.top = (-proj.y * 0.5 + 0.5) * innerHeight + "px";
      v.label.querySelector("span").textContent =
        blocked && i === 1 ? "OFFLINE" : s.venueLoads[i] + " IN FLIGHT";
    });
    document.querySelector("#tickets").innerHTML = s.all
      .filter((o) => o.age < 5)
      .slice(0, 4)
      .map(
        (o) =>
          `<div class="ticket"><b>${o.tag}</b><span class="${o.side.toLowerCase()}">${o.side} ${fmt(o.size)}</span><small>${o.denied ? "REJECTED" : stages[o.stage]} / ${o.age.toFixed(1)}s</small></div>`,
      )
      .join("");
    const f = s.focus;
    document.querySelector("#route-focus").textContent = f
      ? `${f.tag} / ${f.side} ${fmt(f.size)} BTC`
      : "AWAITING QUOTE";
    document.querySelector("#venues").innerHTML = venues
      .map(
        (v, i) =>
          `<div class="venue ${blocked && i === 1 ? "blocked" : f?.venue === i ? "chosen" : ""}"><b>${v}</b><i style="width:${f ? f.score[i] * 9 : 0}%"></i><span>${blocked && i === 1 ? "OFFLINE" : f ? f.score[i].toFixed(2) + " bps" : "—"}</span></div>`,
      )
      .join("");
    document.querySelector("#decision").textContent = f
      ? f.rerouted
        ? "↳ NOVA unavailable. Rerouting " + f.tag + " → " + venues[f.venue]
        : "↳ " + f.tag + " → " + venues[f.venue] + " / best simulated net quote"
      : "";
    document.querySelector("#receipts").innerHTML = s.receipts
      .slice(0, 4)
      .map(
        (o) =>
          `<div class="receipt ${o.denied ? "denied" : ""}"><b>${o.tag}</b><span>${o.denied ? "REJECT" : "SETTLED " + fmt(o.size)}</span><small>${o.denied ? "Exposure exceeds limit" : venues[o.venue] + " · $" + o.price.toFixed(2) + " · R-" + o.id}</small></div>`,
      )
      .join("");
    stages.forEach((_, i) => {
      const jobs = s.live.filter((o) => o.stage === i),
        o = jobs[0];
      document.querySelector("#count-" + i).textContent = jobs.length
        .toString()
        .padStart(2, "0");
      document.querySelector("#id-" + i).textContent = o
        ? o.tag
        : "BUFFER EMPTY";
      document.querySelector("#meter-" + i).style.width =
        (o ? o.progress * 100 : 0) + "%";
      const detail = o
        ? [
            `${o.side} ${fmt(o.size)} BTC`,
            "3 quotes / net cost",
            o.rejected ? "EXPOSURE > LIMIT" : "EXPOSURE WITHIN LIMIT",
            o.rerouted
              ? "RETRY → " + venues[o.venue]
              : "DISPATCH → " + venues[o.venue],
            `${fmt(o.filled)} / ${fmt(o.size)} BTC`,
            "NET → WRITE RECEIPT",
          ][i]
        : "WAITING FOR INPUT";
      document.querySelector("#detail-" + i).textContent = detail;
      document.querySelector("#stage-" + i).classList.toggle("active", !!o);
      lamps[i].ring.material.color.setHex(
        o?.rejected && i === 2 ? 0xff6860 : jobs.length ? 0xffbd72 : 0x32505c,
      );
      lamps[i].scan.position.z = o ? (o.progress - 0.5) * 1.5 : 0;
      lamps[i].scan.visible = !!o;
      root.updateWorldMatrix(true, true);
      proj.copy(nodes[i]).applyMatrix4(root.matrixWorld).project(camera);
      const el = document.querySelector("#anchor-" + i);
      el.style.left = (proj.x * 0.5 + 0.5) * innerWidth + "px";
      el.style.top = (-proj.y * 0.5 + 0.5) * innerHeight + "px";
      el.querySelector("span").textContent = o
        ? o.tag + " / " + Math.floor(o.progress * 100) + "%"
        : "IDLE";
      el.classList.toggle("busy", !!o);
    });
    tokens.forEach((m, i) => {
      const o = s.live[i];
      m.visible = !!o;
      if (!o) return;
      const stage = Math.min(o.stage, 4);
      m.position.copy(
        (stage === 3 ? venuePaths[o.venue].curve : curves[stage]).getPoint(
          o.progress,
        ),
      );
      m.rotation.set(o.age, 0, o.age * 0.6);
      m.material.color.setHex(
        o.rerouted ? 0xffbd72 : o.side === "BUY" ? 0x85e8f4 : 0xffb895,
      );
    });
    return s;
  }
  return { update, block };
}
