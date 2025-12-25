import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function WindRibbon() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a smooth curve (Spline-like)
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-4, 0.5, 0),
        new THREE.Vector3(-2, 1.2, -1),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, -1, 1),
        new THREE.Vector3(4, 0.6, 0),
      ],
      false,
      "catmullrom",
      0.8
    );
  }, []);

  // Tube geometry (the ribbon)
  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 240, 0.12, 8, false);
  }, [curve]);

  // Soft silver material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: new THREE.Color("#e5e7eb"),
      emissiveIntensity: 0.45,
      roughness: 0.35,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  // Motion
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();

    meshRef.current.rotation.z = Math.sin(t * 0.15) * 0.2;
    meshRef.current.rotation.y = Math.cos(t * 0.1) * 0.15;
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, -1.5]}
    />
  );
}
