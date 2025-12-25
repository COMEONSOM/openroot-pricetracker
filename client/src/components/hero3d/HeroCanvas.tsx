// src/components/hero3d/HeroCanvas.tsx

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import Lights from "./Lights";
import CameraRig from "./CameraRig";
import WindScene from "./WindScene";
import WindFlow from "./WindFlow";

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: [0, 0, 8],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      className="absolute inset-0"
    >
      {/* Background color */}
      <color attach="background" args={["#050505"]} />

      {/* Lazy-loaded 3D content */}
      <Suspense fallback={null}>
        <CameraRig />

        <Lights />

        {/* MAIN CENTER HERO OBJECT */}
        <WindScene />

        {/* LEFT / BACKGROUND FLOW */}
        <WindFlow />
      </Suspense>

      {/* Post-processing must be INSIDE Canvas */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.85}
        />
      </EffectComposer>
    </Canvas>
  );
}
