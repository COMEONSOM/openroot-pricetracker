import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function WindFlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  /* -----------------------------
     LEFT-SIDE CURVE (WIDER + CALMER)
  ------------------------------ */
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-6, 1.2, -1),
        new THREE.Vector3(-4.5, 0.6, -0.6),
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(-4.2, -0.6, 0.8),
        new THREE.Vector3(-6, -1.2, 1),
      ],
      false,
      "catmullrom",
      0.9
    );
  }, []);

  /* -----------------------------
     THINNER TUBE (SECONDARY FLOW)
  ------------------------------ */
  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 180, 0.08, 6, false);
  }, [curve]);

  /* -----------------------------
     SOFTER MATERIAL (BACKGROUND)
  ------------------------------ */
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: new THREE.Color("#d1d5db"), // soft silver
      emissiveIntensity: 0.3,
      roughness: 0.5,
      metalness: 0.6,
      transparent: true,
      opacity: 0.55,
    });
  }, []);

  /* -----------------------------
     MOTION (SLOWER THAN MAIN)
  ------------------------------ */
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();

    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.12;
    meshRef.current.rotation.y = Math.cos(t * 0.08) * 0.1;
    meshRef.current.position.y = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[-0.4, 0, -2.6]} // LEFT + DEEPER
    />
  );
}
