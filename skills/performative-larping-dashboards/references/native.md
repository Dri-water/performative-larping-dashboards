# Native / desktop routes

These are documented recommendations; this repo does not claim native-device tests.

## Desktop shell

Prefer Tauri for an existing web exhibit that needs native packaging. Retain its web
rendering stack. Electron is a valid fallback when existing integrations require
Chromium/Node behavior; account for its distribution footprint. Profile the actual
webview on each supported OS. Native packaging does not guarantee WebGL parity.
Keep shell permissions minimal and never expose arbitrary local execution to scene code.

## React Native

For elaborate 2D/2.5D: React Native Skia for custom drawing/shaders and Reanimated
for UI-thread gestures and motion. For genuine 3D: assess R3F native with Expo GL
against the chosen Expo/React Native versions before committing. Browser-only
postprocessing and DOM labels are not automatically portable.

Use a WebView if reusing the exact browser exhibit is more important than fully
native integration. Define a small typed state/selection bridge; don't stream every
particle over it. This fallback trades native rendering for consistency with web.

## Apple native

SwiftUI for controls and instrument overlays; RealityKit for true 3D scenes. Canvas
is a useful 2D alternative, not a substitute for a requested volumetric hero.
Validate exported asset materials and animation in the actual runtime. Test dynamic
type, gestures, backgrounding, reduced motion, battery, and thermal behavior.

## Android / Flutter

Compose Canvas or Flutter CustomPainter handles dense bespoke 2D instruments.
For true 3D choose a maintained platform renderer only after a device spike proves
asset loading, shading, and lifecycle behavior; otherwise use the documented WebView
route. Do not promise identical shader libraries across engines.

In all routes retain the simulation schema, causal sequence, character identities,
and visual hierarchy. Port the design intent, not browser API calls.
