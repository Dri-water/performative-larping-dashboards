/** Copy into a Three.js project. Shared optical baseline, no scene or clock imposed. MIT. */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function createOptics({
  container,
  background = 0x03090e,
  cool = 0xb8e6ff,
  warm = 0xffb37d,
  pixelRatio = Math.min(devicePixelRatio, 1.5),
  bloomStrength = 0.55,
} = {}) {
  if (!container) throw new Error("createOptics requires a container element");
  // Caller owns the fallback if construction fails.
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(background);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(9, 7, 15);
  camera.lookAt(0, 0, 0);
  const room = new RoomEnvironment(),
    pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  // Metal needs something to reflect. Ambient light alone does not supply that.
  const key = new THREE.DirectionalLight(cool, 2.5);
  key.position.set(-5, 9, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(warm, 1.8);
  rim.position.set(7, 3, -4);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(cool, background, 0.35));
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(1, 1),
    bloomStrength,
    0.6,
    1.05,
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  let disposed = false;
  function resize() {
    if (disposed) return;
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    composer.render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  return {
    scene,
    camera,
    renderer,
    composer,
    bloom,
    key,
    rim,
    resize,
    render() {
      if (!disposed) composer.render();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material)
          for (const material of Array.isArray(object.material)
            ? object.material
            : [object.material])
            materials.add(material);
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      environment.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
