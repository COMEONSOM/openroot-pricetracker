export default function Lights() {
  return (
    <>
      {/* Soft global light */}
      <ambientLight intensity={0.6} />

      {/* Main rim light (silver glow) */}
      <directionalLight
        position={[4, 2, 6]}
        intensity={1.4}
        color="#ffffff"
      />

      {/* Subtle fill */}
      <directionalLight
        position={[-3, -1, 4]}
        intensity={0.6}
        color="#e5e7eb"
      />
    </>
  );
}
