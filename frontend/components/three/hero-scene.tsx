"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

import { SceneCanvas } from "@/components/three/scene-canvas";

/**
 * Hero scene: a slowly-rotating constellation of "code artifact" nodes wired
 * together, wrapped in a wireframe icosahedron shell, drifting in an ambient
 * particle field. Reads as an excavation / repository-intelligence object.
 */

// Deterministic node positions on a rough sphere (seeded, no Math.random at
// render → no hydration surprises; this file is client-only anyway).
const NODES: [number, number, number][] = (() => {
  const pts: [number, number, number][] = [];
  const n = 22;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push([Math.cos(theta) * r * 2.2, y * 2.2, Math.sin(theta) * r * 2.2]);
  }
  return pts;
})();

// Connect each node to its 2 nearest neighbors → an organic web.
const EDGES: [THREE.Vector3, THREE.Vector3][] = (() => {
  const v = NODES.map((p) => new THREE.Vector3(...p));
  const edges: [THREE.Vector3, THREE.Vector3][] = [];
  const seen = new Set<string>();
  v.forEach((a, i) => {
    const dist = v
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    dist.forEach(({ j }) => {
      const key = [Math.min(i, j), Math.max(i, j)].join("-");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, v[j]]);
      }
    });
  });
  return edges;
})();

function Constellation() {
  const group = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={group}>
      {/* Wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[2.85, 1]} />
        <meshBasicMaterial color="#8c45ff" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Edges */}
      {EDGES.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#8c45ff"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}

      {/* Nodes */}
      {NODES.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 4 === 0 ? 0.1 : 0.06, 16, 16]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#43e7ff" : "#b372cf"}
            emissive={i % 4 === 0 ? "#43e7ff" : "#8c45ff"}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField() {
  const ref = React.useRef<THREE.Points>(null);
  const geom = React.useMemo(() => {
    const count = 240;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Seeded pseudo-random via trig so it's stable across renders.
      const a = i * 12.9898;
      const b = i * 78.233;
      const rx = (Math.sin(a) * 43758.5453) % 1;
      const ry = (Math.sin(b) * 43758.5453) % 1;
      const rz = (Math.sin(a + b) * 43758.5453) % 1;
      positions[i * 3] = (rx - 0.5) * 14;
      positions[i * 3 + 1] = (ry - 0.5) * 14;
      positions[i * 3 + 2] = (rz - 0.5) * 14;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.03;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.035}
        color="#b372cf"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} intensity={40} color="#8c45ff" />
      <pointLight position={[-6, -4, 2]} intensity={25} color="#43e7ff" />
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <Constellation />
      </Float>
      <ParticleField />
    </SceneCanvas>
  );
}
