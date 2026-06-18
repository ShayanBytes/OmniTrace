"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

import { SceneCanvas } from "@/components/three/scene-canvas";

/**
 * Dependency-graph scene: a clustered 3D node graph (hubs + leaves) with
 * highlighted edges, gently auto-rotating. Evokes an interactive import/call
 * graph without the cost of a real physics simulation.
 */

type Node = { pos: THREE.Vector3; size: number; hub: boolean };

const { NODES, EDGES } = (() => {
  // A few hubs, each with orbiting leaf nodes.
  const hubs: [number, number, number][] = [
    [0, 0, 0],
    [2.6, 1.1, -0.6],
    [-2.4, -0.9, 0.8],
    [0.4, -2.2, -0.4],
  ];
  const nodes: Node[] = [];
  const edges: [THREE.Vector3, THREE.Vector3][] = [];

  const hubVecs = hubs.map((h) => new THREE.Vector3(...h));
  hubVecs.forEach((h) => nodes.push({ pos: h, size: 0.18, hub: true }));

  // Connect hubs to each other.
  for (let i = 0; i < hubVecs.length; i++) {
    for (let j = i + 1; j < hubVecs.length; j++) {
      if ((i + j) % 2 === 0) edges.push([hubVecs[i], hubVecs[j]]);
    }
  }

  // Leaves around each hub (seeded trig positions).
  hubVecs.forEach((h, hi) => {
    const count = 5 + (hi % 3);
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + hi;
      const rad = 0.9 + ((Math.sin(hi * 9 + k * 3) + 1) / 2) * 0.5;
      const tilt = Math.cos(hi * 4 + k) * 0.6;
      const leaf = new THREE.Vector3(
        h.x + Math.cos(a) * rad,
        h.y + Math.sin(a) * rad,
        h.z + tilt
      );
      nodes.push({ pos: leaf, size: 0.07, hub: false });
      edges.push([h, leaf]);
    }
  });

  return { NODES: nodes, EDGES: edges };
})();

function Graph() {
  const group = React.useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={group}>
      {EDGES.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color={i % 5 === 0 ? "#43e7ff" : "#8c45ff"}
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}
      {NODES.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.size, 18, 18]} />
          <meshStandardMaterial
            color={n.hub ? "#43e7ff" : "#b372cf"}
            emissive={n.hub ? "#1f8aa3" : "#8c45ff"}
            emissiveIntensity={n.hub ? 1.6 : 1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function DependencyGraphScene() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 8], fov: 42 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={35} color="#43e7ff" />
      <pointLight position={[-5, -3, 3]} intensity={22} color="#8c45ff" />
      <Graph />
    </SceneCanvas>
  );
}
