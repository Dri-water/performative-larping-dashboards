import * as T from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { seeded } from "../../../skills/performative-larping-dashboards/assets/director.mjs";

// A complete environment: massive housing, moving lamellae, inner optic, field,
// conduits, distant structure, near-camera occlusion, and projected instruments.
export function createScene(
  host,
  { fallback = false, seed = 17, world = "vessel" } = {},
) {
  const rand = seeded(seed),
    TAU = Math.PI * 2;
  let renderer,
    lost = false;
  const anchorPositions = [];
  const fallbackScene = () => {
    host.innerHTML = `<svg class="fallback-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="g"><stop stop-color="#2f8eac" stop-opacity=".5"/><stop offset="1" stop-color="#03090e"/></radialGradient></defs><rect width="1440" height="900" fill="#03090e"/><circle cx="720" cy="440" r="450" fill="url(#g)"/><g fill="none" stroke="#598d9e">${Array.from({ length: 13 }, (_, i) => `<ellipse cx="720" cy="440" rx="${110 + i * 18}" ry="${110 + i * 18}" stroke-opacity="${0.2 + i / 25}" stroke-dasharray="${i % 2 ? "2 9" : "80 15"}"/>`).join("")}</g><g stroke="#c39462" stroke-width="3">${Array.from(
      { length: 72 },
      (_, i) => {
        let a = (i / 72) * TAU;
        return `<path d="M${720 + Math.cos(a) * 286} ${440 + Math.sin(a) * 286} L${720 + Math.cos(a) * 320} ${440 + Math.sin(a) * 320}"/>`;
      },
    ).join(
      "",
    )}</g><path d="M720 265 795 440 720 615 645 440Z" fill="#142b3a" stroke="#86e4eb"/><path d="M720 292V588M659 440H781" stroke="#e5ac76"/><circle cx="720" cy="440" r="43" fill="#02060a" stroke="#d7f8ff" stroke-width="3"/></svg>`;
    document.documentElement.dataset.renderer = "svg";
    const label = document.querySelector("#renderer");
    if (label) label.textContent = "STATIC / GRAPHICS FALLBACK";
    if (world === "market")
      host.innerHTML = `<svg class="fallback-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><rect width="1440" height="900" fill="#03090e"/><g fill="none">${Array.from(
        { length: 30 },
        (_, j) => {
          let d = Array.from({ length: 70 }, (_, i) => {
            const x = 300 + i * 12,
              y = 570 - j * 7 - Math.exp(-(((i - 24) / 12) ** 2)) * 180;
            return `${i ? "L" : "M"}${x},${y}`;
          }).join(" ");
          return `<path d="${d}" stroke="${j % 3 ? "#487e91" : "#dcaa77"}" opacity=".6"/>`;
        },
      ).join(
        "",
      )}<path d="M310 570 410 510 500 540 600 380 700 450 800 300 950 340 1080 250" stroke="#eead76" stroke-width="3"/></g></svg>`;
  };
  try {
    if (fallback) throw Error("Requested static route");
    renderer = new T.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    fallbackScene();
    return {
      render() {},
      project(i) {
        return {
          x: host.clientWidth * (0.25 + (i % 2) * 0.5),
          y: host.clientHeight * (0.37 + Math.floor(i / 2) * 0.09),
        };
      },
      dispose() {},
    };
  }
  host.append(renderer.domElement);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x03090e);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  document.documentElement.dataset.renderer = "webgl";
  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x03090e, 0.022);
  const camera = new T.PerspectiveCamera(43, 1, 0.1, 160);
  const pmrem = new T.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const env = pmrem.fromScene(environment, 0.06);
  scene.environment = env.texture;
  environment.dispose();
  pmrem.dispose();
  scene.add(new T.AmbientLight(0x6cbed2, 0.38));
  const lighting = [];
  for (const [color, power, x, y, z] of [
    [0x99eaff, 120, -5, 5, 7],
    [0xffaa62, 95, 4, -2, 5],
    [0x62d8ff, 70, 0, 0, -2],
  ]) {
    const l = new T.PointLight(color, power, 40, 2);
    l.position.set(x, y, z);
    lighting.push(l);
    scene.add(l);
  }
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  renderer.info.autoReset = false;
  const bloom = new UnrealBloomPass(new T.Vector2(1, 1), 0.8, 0.65, 1.05);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const graphite = new T.MeshStandardMaterial({
    color: 0x101c26,
    metalness: 0.86,
    roughness: 0.4,
    envMapIntensity: 0.16,
  });
  const metal = new T.MeshStandardMaterial({
    color: 0x385461,
    metalness: 0.83,
    roughness: 0.32,
    envMapIntensity: 0.3,
  });
  const edge = new T.MeshStandardMaterial({
    color: 0x8babb1,
    metalness: 0.85,
    roughness: 0.27,
    envMapIntensity: 0.34,
  });
  const bronze = new T.MeshStandardMaterial({
    color: 0x9c6742,
    metalness: 0.88,
    roughness: 0.34,
    envMapIntensity: 0.24,
  });
  const ice = new T.MeshBasicMaterial({
    color: new T.Color(0x83eafa).multiplyScalar(2.2),
    toneMapped: false,
  });
  const amber = new T.MeshBasicMaterial({
    color: new T.Color(0xffaf65).multiplyScalar(2),
    toneMapped: false,
  });
  const dim = new T.LineBasicMaterial({
    color: 0x4a879e,
    transparent: true,
    opacity: 0.3,
  });
  const machine = new T.Group();
  scene.add(machine);
  machine.rotation.set(0.12, -0.22, -0.12);
  function mesh(geo, mat, parent = machine) {
    const m = new T.Mesh(geo, mat);
    parent.add(m);
    return m;
  }
  function batchStatic(group) {
    const bins = new Map();
    for (const child of [...group.children]) {
      if (!child.isMesh || child.isInstancedMesh) continue;
      child.updateMatrix();
      const key = child.material.uuid;
      if (!bins.has(key))
        bins.set(key, { material: child.material, parts: [] });
      bins
        .get(key)
        .parts.push(child.geometry.clone().applyMatrix4(child.matrix));
      group.remove(child);
      child.geometry.dispose();
    }
    for (const { material, parts } of bins.values()) {
      const combined = mergeGeometries(parts);
      parts.forEach((g) => g.dispose());
      mesh(combined, material, group);
    }
  }
  function ring(radius, tube, mat, parent = machine, z = 0, arc = TAU) {
    const m = mesh(new T.TorusGeometry(radius, tube, 8, 160, arc), mat, parent);
    m.position.z = z;
    return m;
  }
  function radialInstances(
    count,
    radius,
    z,
    scale,
    mat,
    parent = machine,
    offset = 0,
  ) {
    const m = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), mat, count);
    const d = new T.Object3D();
    for (let i = 0; i < count; i++) {
      let a = (i / count) * TAU + offset;
      d.position.set(Math.cos(a) * radius, Math.sin(a) * radius, z);
      d.rotation.set(0, 0, a);
      d.scale.set(...(typeof scale === "function" ? scale(i) : scale));
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    }
    parent.add(m);
    return m;
  }
  // The dark structural mass is as important as the emissive parts.
  const housing = new T.Group();
  machine.add(housing);
  for (const [r, w, z, mat] of [
    [4.18, 0.16, -0.4, graphite],
    [4.45, 0.08, -0.18, metal],
    [4.65, 0.06, -0.7, bronze],
    [3.78, 0.09, 0.08, edge],
    [3.57, 0.07, 0.32, graphite],
    [4.05, 0.025, 0.29, ice],
  ])
    ring(r, w, mat, housing, z);
  radialInstances(
    96,
    4.28,
    -0.15,
    (i) => [0.48, 0.13, i % 4 === 0 ? 0.6 : 0.25],
    graphite,
    housing,
  );
  radialInstances(96, 4.39, 0.06, [0.11, 0.025, 0.3], edge, housing);
  radialInstances(
    192,
    3.89,
    0.13,
    (i) => [i % 8 === 0 ? 0.23 : 0.07, 0.014, 0.025],
    iMaterial(),
    housing,
  );
  function iMaterial() {
    return new T.MeshBasicMaterial({ color: 0x6395a3 });
  }
  radialInstances(64, 4.57, -0.24, [0.15, 0.018, 0.04], amber, housing);
  radialInstances(
    288,
    4.18,
    0.29,
    (i) => [0.045, 0.022, 0.045],
    metal,
    housing,
  );
  const rotors = [];
  for (let n = 0; n < 3; n++) {
    const rotor = new T.Group();
    machine.add(rotor);
    rotors.push(rotor);
    rotor.position.z = 0.2 + n * 0.29;
    for (let i = 0; i < 6; i++) {
      const arc = ring(
        3.39 - n * 0.19,
        0.022,
        n === 1 ? amber : ice,
        rotor,
        0,
        0.65,
      );
      arc.rotation.z = (i * TAU) / 6;
    }
    radialInstances(
      84,
      3.4 - n * 0.19,
      0,
      [0.05, 0.012, 0.06],
      n === 1 ? bronze : metal,
      rotor,
    );
  }
  // Twelve articulated containment petals form an architectural silhouette.
  const petals = [];
  for (let i = 0; i < 12; i++) {
    const g = new T.Group();
    machine.add(g);
    const angle = (i / 12) * TAU;
    g.rotation.z = angle;
    const pivot = new T.Group();
    g.add(pivot);
    pivot.position.x = 3.77;
    petals.push(pivot);
    const shape = new T.Shape();
    shape.moveTo(-0.67, -0.18);
    shape.lineTo(0.25, -0.36);
    shape.lineTo(1.18, -0.23);
    shape.lineTo(1.57, 0);
    shape.lineTo(0.84, 0.31);
    shape.lineTo(-0.67, 0.18);
    shape.closePath();
    const plate = mesh(
      new T.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.035,
        bevelThickness: 0.035,
      }),
      i % 3 === 0 ? bronze : graphite,
      pivot,
    );
    plate.position.z = 0.25;
    for (let j = 0; j < 7; j++) {
      const rib = mesh(
        new T.BoxGeometry(0.028, 0.34 - j * 0.016, 0.07),
        metal,
        pivot,
      );
      rib.position.set(0.1 + j * 0.14, 0, 0.53);
    }
    const strip = mesh(
      new T.BoxGeometry(0.62, 0.022, 0.025),
      i % 3 === 0 ? amber : ice,
      pivot,
    );
    strip.position.set(0.2, -0.2, 0.5);
    const rivet = mesh(
      new T.CylinderGeometry(0.055, 0.055, 0.06, 8),
      edge,
      pivot,
    );
    rivet.rotation.x = Math.PI / 2;
    rivet.position.set(-0.43, 0, 0.53);
    batchStatic(pivot);
  }
  // Alien optic: black void within a luminous lens, suspended spines, energy surface.
  const inner = new T.Group();
  machine.add(inner);
  const lens = mesh(
    new T.SphereGeometry(0.96, 64, 48),
    new T.MeshBasicMaterial({ color: 0x01050a }),
    inner,
  );
  lens.scale.set(1, 1, 0.53);
  lens.position.z = 0.45;
  ring(1.02, 0.017, ice, inner, 0.45);
  ring(1.12, 0.01, bronze, inner, 0.37);
  const apparition = new T.Group();
  inner.add(apparition);
  apparition.position.z = 1.1;
  for (let i = 0; i < 3; i++) {
    const glyph = new T.LineSegments(
      new T.EdgesGeometry(
        new T.IcosahedronGeometry(0.42 + i * 0.13, i === 0 ? 1 : 0),
      ),
      new T.LineBasicMaterial({
        color: i === 1 ? 0xe8b47c : 0x9ee9f5,
        transparent: true,
        opacity: 0.7,
      }),
    );
    glyph.rotation.set(i * 0.8, i * 0.55, i * 0.37);
    apparition.add(glyph);
  }
  const spines = [];
  for (let i = 0; i < 4; i++) {
    const g = new T.Group();
    inner.add(g);
    g.rotation.z = (i / 4) * TAU + 0.3;
    spines.push(g);
    const shape = new T.Shape();
    shape.moveTo(-0.24, 1.15);
    shape.lineTo(-0.38, 1.6);
    shape.lineTo(-0.08, 2.87);
    shape.lineTo(0.09, 3.08);
    shape.lineTo(0.3, 1.67);
    shape.lineTo(0.12, 1.18);
    shape.closePath();
    const m = mesh(
      new T.ExtrudeGeometry(shape, {
        depth: 0.27,
        bevelEnabled: true,
        bevelSize: 0.04,
        bevelThickness: 0.04,
        bevelSegments: 2,
      }),
      metal,
      g,
    );
    m.rotation.y = 0.2;
    const line = mesh(new T.BoxGeometry(0.018, 1.23, 0.025), ice, g);
    line.position.set(0.01, 2.04, 0.34);
  }
  const fieldUniforms = { uTime: { value: 0 }, uPower: { value: 1 } };
  const field = mesh(
    new T.PlaneGeometry(6.4, 6.4),
    new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: fieldUniforms,
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv;uniform float uTime;uniform float uPower;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float a=atan(p.y,p.x);float n=noise(vec2(a*6.+uTime*.1,r*18.-uTime*.32));float arc=pow(max(0.,sin(a*13.+r*45.-uTime*.7+n*3.)),12.);float bands=exp(-pow((r-.49-n*.07)*30.,2.))+exp(-pow((r-.77)*65.,2.))*.5;float mask=smoothstep(.3,.38,r)*(1.-smoothstep(.88,1.,r));vec3 col=mix(vec3(.12,.6,.8),vec3(1.,.53,.2),smoothstep(.3,.8,n));float value=(bands*.5+arc*.32)*mask*(.7+uPower*.7);gl_FragColor=vec4(col*value*2.,value);}`,
    }),
    inner,
  );
  field.position.z = 0.04;
  // Local glow, never a full-frame flash.
  const aura = mesh(
    new T.PlaneGeometry(14, 14),
    new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: fieldUniforms,
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv;uniform float uPower;void main(){float r=length(vUv-.5)*2.;float v=exp(-r*r*8.)*.09*(.4+uPower);gl_FragColor=vec4(vec3(.12,.45,.66)*v,v);}`,
    }),
    machine,
  );
  aura.position.z = -1.5;
  const releaseWaves = Array.from({ length: 4 }, (_, i) => {
    const m = ring(
      1,
      0.008,
      new T.MeshBasicMaterial({
        color: 0xa0eafa,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: T.AdditiveBlending,
      }),
      machine,
    );
    return m;
  });
  // Dense streams form an accretion field with foreground/background crossings.
  const count = 9500,
    positions = new Float32Array(count * 3),
    data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    data[i * 3] = rand() * TAU;
    data[i * 3 + 1] = 1.25 + Math.pow(rand(), 0.65) * 4.8;
    data[i * 3 + 2] = rand();
  }
  const particleGeo = new T.BufferGeometry();
  particleGeo.setAttribute("position", new T.BufferAttribute(positions, 3));
  particleGeo.setAttribute("aData", new T.BufferAttribute(data, 3));
  const particleMat = new T.ShaderMaterial({
    uniforms: fieldUniforms,
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    vertexShader: `attribute vec3 aData;uniform float uTime;uniform float uPower;varying float vAlpha;varying float vWarm;void main(){float a=aData.x+uTime*(.02+.025/aData.y);float r=aData.y;vec3 p=vec3(cos(a)*r,sin(a)*r,(aData.z-.5)*1.7+sin(a*3.+uTime*.15)*.12);p.xy*=1.+sin(a*4.+uTime*.2)*.016;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.+aData.z*2.)*16./-mv.z,1.,3.5);vAlpha=(.14+aData.z*.6)*(.5+uPower*.4);vWarm=step(.76,aData.z);}`,
    fragmentShader: `varying float vAlpha;varying float vWarm;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d)*vAlpha;gl_FragColor=vec4(mix(vec3(.32,.76,.94),vec3(1.,.63,.3),vWarm)*1.5,a);}`,
  });
  const dust = new T.Points(particleGeo, particleMat);
  machine.add(dust);
  // Filament buses terminate at the six peripheral stations.
  const buses = [],
    nodes = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU + Math.PI / 6;
    const end = new T.Vector3(
      Math.cos(angle) * 5.25,
      Math.sin(angle) * 4.3,
      -0.3,
    );
    anchorPositions.push(end);
    const g = new T.Group();
    g.position.copy(end);
    g.rotation.z = angle;
    machine.add(g);
    nodes.push(g);
    mesh(new T.BoxGeometry(0.52, 0.83, 0.3), graphite, g);
    mesh(new T.BoxGeometry(0.38, 0.56, 0.05), metal, g).position.z = 0.2;
    const chip = mesh(
      new T.BoxGeometry(0.24, 0.36, 0.015),
      i % 2 ? amber : ice,
      g,
    );
    chip.position.z = 0.24;
    for (let k = 0; k < 4; k++) {
      const fin = mesh(new T.BoxGeometry(0.1, 0.65, 0.09), bronze, g);
      fin.position.set(-0.5 + k * 0.14, 0, -0.1);
    }
    batchStatic(g);
    for (let j = 0; j < 3; j++) {
      const start = new T.Vector3(
        Math.cos(angle + 0.3) * 1.22,
        Math.sin(angle + 0.3) * 1.22,
        0.25,
      );
      const curve = new T.CatmullRomCurve3([
        start,
        new T.Vector3(
          Math.cos(angle + 0.4) * (2.5 + j * 0.1),
          Math.sin(angle + 0.4) * (2.5 + j * 0.1),
          0.5 + j * 0.07,
        ),
        end.clone().add(new T.Vector3(0, j * 0.08, 0)),
      ]);
      const line = new T.Line(
        new T.BufferGeometry().setFromPoints(curve.getPoints(80)),
        new T.LineBasicMaterial({
          color: i % 2 ? 0xc59a6d : 0x427b93,
          transparent: true,
          opacity: 0.4,
        }),
      );
      machine.add(line);
      const packets = Array.from({ length: 6 }, () =>
        mesh(
          new T.SphereGeometry(j === 1 ? 0.025 : 0.016, 6, 4),
          i % 2 ? amber : ice,
        ),
      );
      buses.push({ curve, packets, station: i });
    }
  }
  // Distant ship architecture, asymmetrical and partly lost in haze.
  const architecture = new T.Group();
  scene.add(architecture);
  architecture.position.z = -7;
  architecture.rotation.z = -0.35;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU;
    const frame = mesh(
      new T.BoxGeometry(1.2, 2.3, 0.8),
      graphite,
      architecture,
    );
    frame.position.set(Math.cos(a) * 9, Math.sin(a) * 9, 0);
    frame.rotation.z = a - Math.PI / 2;
    const rim = mesh(new T.BoxGeometry(0.06, 2.1, 0.12), metal, frame);
    rim.position.set(0.5, 0, 0.47);
  }
  for (let i = 0; i < 5; i++)
    ring(7 + i * 0.65, 0.025, i % 2 ? metal : graphite, architecture, -i * 0.7);
  const stars = new Float32Array(1600 * 3);
  for (let i = 0; i < 1600; i++) {
    stars[i * 3] = (rand() - 0.5) * 60;
    stars[i * 3 + 1] = (rand() - 0.5) * 36;
    stars[i * 3 + 2] = -5 - rand() * 25;
  }
  scene.add(
    new T.Points(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.BufferAttribute(stars, 3),
      ),
      new T.PointsMaterial({
        color: 0x86abbf,
        size: 0.022,
        transparent: true,
        opacity: 0.52,
      }),
    ),
  );
  // Near-camera rails are cropped by the frame; overlap sells physical scale.
  const near = new T.Group();
  scene.add(near);
  for (const side of [-1, 1]) {
    const rail = mesh(new T.BoxGeometry(0.34, 17, 0.5), graphite, near);
    rail.position.set(side * 8, 0, 2);
    rail.rotation.z = side * -0.14;
    for (let j = 0; j < 9; j++) {
      const clasp = mesh(new T.BoxGeometry(0.6, 0.035, 0.2), metal, near);
      clasp.position.set(side * (8 + j * 0.016), j * 1.2 - 5, 2.3);
    }
  }
  batchStatic(near);
  // A second subject uses a completely different physical metaphor: a liquidity
  // canyon. Shared optics and director, no mascots or agent graph required.
  let market = null;
  if (world === "market") {
    machine.visible = false;
    architecture.visible = false;
    near.visible = false;
    const group = new T.Group();
    scene.add(group);
    const sides = [],
      marketLines = [];
    const marketMat = new T.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.55,
      roughness: 0.35,
      envMapIntensity: 0.35,
    });
    const dummy = new T.Object3D(),
      color = new T.Color();
    for (const side of [-1, 1]) {
      const g = new T.Group();
      group.add(g);
      sides.push(g);
      const blocks = new T.InstancedMesh(
        new T.BoxGeometry(1, 1, 1),
        marketMat,
        24 * 36,
      );
      for (let x = 0; x < 24; x++)
        for (let z = 0; z < 36; z++) {
          const height =
            0.25 +
            Math.pow(Math.sin(x * 0.14 + z * 0.11 + side) * 0.5 + 0.5, 3) *
              2.6 +
            (1 - x / 24) * 0.75;
          dummy.position.set(
            side * (1.15 + x * 0.15),
            height / 2 - 1.4,
            (z - 18) * 0.24,
          );
          dummy.scale.set(0.125, height, 0.2);
          dummy.updateMatrix();
          blocks.setMatrixAt(x * 36 + z, dummy.matrix);
          color
            .set(side < 0 ? 0x276e87 : 0x9d663d)
            .multiplyScalar(0.5 + height * 0.2);
          blocks.setColorAt(x * 36 + z, color);
        }
      g.add(blocks);
      for (let row = 0; row < 24; row++) {
        const pts = Array.from({ length: 80 }, (_, i) => {
          const z = (i / 79 - 0.5) * 8.4;
          return new T.Vector3(
            side * (1.12 + row * 0.15),
            -0.1 +
              Math.sin(row * 0.12 + z * 0.5) * 0.7 +
              Math.cos(z * 0.9) * 0.4,
            z,
          );
        });
        const line = new T.Line(
          new T.BufferGeometry().setFromPoints(pts),
          new T.LineBasicMaterial({
            color: side < 0 ? 0x64d9ee : 0xd4955f,
            transparent: true,
            opacity: 0.4,
          }),
        );
        g.add(line);
      }
      for (let z = 0; z < 14; z++) {
        const pts = Array.from(
          { length: 50 },
          (_, i) =>
            new T.Vector3(
              side * (1.1 + (i / 49) * 3.6),
              2.3 + Math.sin(i * 0.13 + z * 0.2) * 0.5,
              (z - 7) * 0.65,
            ),
        );
        const line = new T.Line(
          new T.BufferGeometry().setFromPoints(pts),
          new T.LineBasicMaterial({
            color: side < 0 ? 0x5bc6dd : 0xdfa068,
            transparent: true,
            opacity: 0.25,
          }),
        );
        g.add(line);
        marketLines.push(line);
      }
    }
    const pathPoints = Array.from(
      { length: 26 },
      (_, i) =>
        new T.Vector3(
          Math.sin(i * 1.73) * 0.5,
          Math.sin(i * 0.43) * 0.6 + 0.4,
          (i / 25 - 0.5) * 10,
        ),
    );
    const pricePath = new T.CatmullRomCurve3(pathPoints);
    mesh(new T.TubeGeometry(pricePath, 180, 0.025, 6, false), amber, group);
    const traces = [];
    for (let i = 0; i < 18; i++) {
      const points = pathPoints.map(
        (p, j) =>
          new T.Vector3(
            p.x + (i - 9) * 0.028,
            p.y + i * 0.055 + Math.sin(j * 0.5 + i * 0.2) * 0.1,
            p.z,
          ),
      );
      const line = new T.Line(
        new T.BufferGeometry().setFromPoints(
          new T.CatmullRomCurve3(points).getPoints(160),
        ),
        new T.LineBasicMaterial({
          color: i % 3 ? 0x61cce2 : 0xffbd79,
          transparent: true,
          opacity: 0.23,
        }),
      );
      group.add(line);
      traces.push(line);
    }
    const planeMat = new T.MeshBasicMaterial({
      color: 0x6ad4ef,
      transparent: true,
      opacity: 0.065,
      side: T.DoubleSide,
      depthWrite: false,
      blending: T.AdditiveBlending,
    });
    const slice = mesh(new T.PlaneGeometry(11, 6), planeMat, group);
    slice.position.y = 0.7;
    const sliceEdge = new T.LineSegments(
      new T.EdgesGeometry(new T.PlaneGeometry(11, 6)),
      new T.LineBasicMaterial({
        color: 0x82c1d3,
        transparent: true,
        opacity: 0.4,
      }),
    );
    slice.add(sliceEdge);
    const tradeGeo = new T.BufferGeometry();
    const tradeData = new Float32Array(5000 * 3);
    for (let i = 0; i < tradeData.length; i++) tradeData[i] = rand();
    tradeGeo.setAttribute(
      "position",
      new T.BufferAttribute(new Float32Array(5000 * 3), 3),
    );
    tradeGeo.setAttribute("aData", new T.BufferAttribute(tradeData, 3));
    const trades = new T.Points(
      tradeGeo,
      new T.ShaderMaterial({
        uniforms: fieldUniforms,
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        vertexShader: `attribute vec3 aData;uniform float uTime;uniform float uPower;varying float a;void main(){float z=mod(aData.x*10.+uTime*.9,10.)-5.;float x=sin(z*1.5+aData.y*2.)*(.25+uPower*.2)+(aData.y-.5)*.6;float y=.3+sin(z*.8)*.6+aData.z*.8;vec4 mv=modelViewMatrix*vec4(x,y,z,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(24./-mv.z,1.,3.);a=aData.z;}`,
        fragmentShader: `varying float a;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(mix(vec3(.3,.8,1.),vec3(1.,.6,.2),a)*1.5,smoothstep(.5,0.,r)*.7);}`,
      }),
    );
    group.add(trades);
    const floor = new T.GridHelper(20, 80, 0x35687b, 0x10212d);
    floor.position.y = -1.45;
    group.add(floor);
    market = { group, sides, slice, pricePath, traces };
  }
  let portrait = false,
    w = 0,
    h = 0;
  const resize = () => {
    w = host.clientWidth;
    h = host.clientHeight;
    portrait = w < 700;
    renderer.setSize(w, h);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    fallbackScene();
  });
  const projected = new T.Vector3();
  let lastStats = {};
  return {
    render(s) {
      if (lost) return;
      const t = s.time;
      // Portrait re-stages the machine vertically instead of cropping a desktop camera.
      camera.position.set(
        portrait ? 0.2 : Math.sin(t * 0.06) * 0.12,
        portrait ? 1.25 : 0.55,
        portrait ? 26.8 : 19.8,
      );
      camera.setViewOffset(w, h, 0, portrait ? Math.round(h * 0.09) : 0, w, h);
      camera.lookAt(0, 0, 0);
      machine.scale.setScalar(portrait ? 0.69 : 1);
      machine.position.y = portrait ? 1.65 : -0.13;
      machine.rotation.y = -0.32 + Math.sin(t * 0.07) * 0.045;
      if (market) {
        camera.position.set(
          portrait ? 9 : 10,
          portrait ? 14 : 10,
          portrait ? 19 : 15,
        );
        camera.lookAt(0, portrait ? 0.1 : 0, 0);
        market.group.scale.setScalar(portrait ? 0.6 : 1.15);
        market.group.position.y = portrait ? 2 : 0;
        market.sides.forEach(
          (g, i) => (g.position.x = (i ? 1 : -1) * s.ignition * 0.52),
        );
        market.slice.position.z = (s.local / 24 - 0.5) * 9;
        market.traces.forEach(
          (line, i) => (line.position.y = Math.sin(t * 0.5 + i * 0.2) * 0.08),
        );
      }
      rotors.forEach((g, i) => {
        g.rotation.z =
          t * (i % 2 ? -0.045 : 0.027) * (1 + s.ignition * 0.25) + i * 0.7;
        g.rotation.x = (i - 1) * s.ignition * 0.95;
        g.rotation.y = i === 1 ? s.ignition * 0.45 : 0;
        g.position.z = 0.2 + i * 0.29 + s.ignition * i * 0.5;
      });
      petals.forEach((p, i) => {
        p.rotation.y = -0.12 - s.aperture * 0.65;
        p.position.x = 3.77 + s.aperture * 0.55 + Math.sin(i * 2) * 0.035;
      });
      inner.rotation.z = -t * 0.021;
      spines.forEach((g, i) => {
        g.rotation.y = Math.sin(t * 0.15 + i) * 0.12;
        g.position.z = s.ignition * 1.1;
      });
      apparition.rotation.set(t * 0.1, t * 0.14, 0);
      apparition.scale.setScalar(0.3 + s.ignition * 1.3);
      releaseWaves.forEach((m, i) => {
        const progress = (s.local - 15 - i * 0.65) / 3.4;
        m.visible = progress >= 0 && progress <= 1;
        m.scale.setScalar(1 + Math.max(0, progress) * 5);
        m.position.z = 0.9 + Math.max(0, progress) * 3;
        m.material.opacity = Math.max(0, 1 - progress) * 0.42;
      });
      fieldUniforms.uTime.value = t;
      fieldUniforms.uPower.value = s.ignition;
      buses.forEach((bus) =>
        bus.packets.forEach((m, i) => {
          const p = (s.transport + i / 6) % 1;
          m.position.copy(bus.curve.getPoint(p));
          m.scale.setScalar(bus.station === s.active ? 1.8 : 0.7);
        }),
      );
      nodes.forEach((n, i) => {
        n.scale.setScalar(i === s.active ? 1.12 : 1);
      });
      lighting[2].intensity = 55 + s.ignition * 35;
      bloom.strength = 0.45 + s.ignition * 0.16;
      renderer.info.reset();
      composer.render();
      lastStats = {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        points: renderer.info.render.points,
      };
    },
    project(i) {
      if (lost) return { x: w * (0.25 + (i % 2) * 0.5), y: h * 0.45 };
      if (market) {
        projected.set(i % 2 ? 3 : -3, 0.6, (Math.floor(i / 2) - 1) * 3);
        market.group.localToWorld(projected);
      } else {
        projected.copy(anchorPositions[i]);
        machine.localToWorld(projected);
      }
      projected.project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * w,
        y: (-0.5 * projected.y + 0.5) * h,
      };
    },
    get stats() {
      return lastStats;
    },
    dispose() {
      observer.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          for (const m of Array.isArray(o.material) ? o.material : [o.material])
            m.dispose();
        }
      });
      env.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
