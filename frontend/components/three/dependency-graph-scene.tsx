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

// Small emissive "data packets" that ride along a subset of edges on a loop.
const PACKET_EDGES = EDGES.filter((_, i) => i % 2 === 0);

function Packets() {
  const refs = React.useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    PACKET_EDGES.forEach((pts, i) => {
      const m = refs.current[i];
      if (!m) return;
      // Loop 0→1 with a per-edge phase offset, ping-ponging direction.
      const frac = (t * 0.4 + i * 0.37) % 1;
      m.position.lerpVectors(pts[0], pts[1], frac);
      const mat = m.material as THREE.MeshStandardMaterial;
      // Fade in/out at the ends so packets don't "teleport".
      mat.opacity = Math.sin(frac * Math.PI);
    });
  });
  return (
    <>
      {PACKET_EDGES.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial
            color="#43e7ff"
            emissive="#43e7ff"
            emissiveIntensity={3}
            transparent
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function Graph() {
  const group = React.useRef<THREE.Group>(null);
  const nodeRefs = React.useRef<(THREE.Mesh | null)[]>([]);
  const start = React.useRef<number | null>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
    // Staggered pop-in + gentle hub pulse.
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    NODES.forEach((n, i) => {
      const m = nodeRefs.current[i];
      if (!m) return;
      const appear = Math.min(1, Math.max(0, (t - i * 0.04) * 3));
      // easeOutBack for a little overshoot.
      const e = appear === 1 ? 1 : 1 - Math.pow(1 - appear, 3);
      const overshoot = 1 + 0.18 * Math.sin(appear * Math.PI);
      m.scale.setScalar(e * (appear < 1 ? overshoot : 1));
      if (n.hub) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.6 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.5;
      }
    });
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
        <mesh key={i} position={n.pos} ref={(el) => { nodeRefs.current[i] = el; }} scale={0}>
          <sphereGeometry args={[n.size, 18, 18]} />
          <meshStandardMaterial
            color={n.hub ? "#43e7ff" : "#b372cf"}
            emissive={n.hub ? "#1f8aa3" : "#8c45ff"}
            emissiveIntensity={n.hub ? 1.6 : 1}
            toneMapped={false}
          />
        </mesh>
      ))}
      <Packets />
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
