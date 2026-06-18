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

// A few packets that travel along the web's edges, fading at each end.
const HERO_PACKET_EDGES = EDGES.filter((_, i) => i % 3 === 0);

function Packets() {
  const refs = React.useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    HERO_PACKET_EDGES.forEach(([a, b], i) => {
      const m = refs.current[i];
      if (!m) return;
      const frac = (t * 0.3 + i * 0.29) % 1;
      m.position.lerpVectors(a, b, frac);
      (m.material as THREE.MeshStandardMaterial).opacity = Math.sin(frac * Math.PI);
    });
  });
  return (
    <>
      {HERO_PACKET_EDGES.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[0.035, 8, 8]} />
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

function Constellation() {
  const group = React.useRef<THREE.Group>(null);
  const nodeRefs = React.useRef<(THREE.Mesh | null)[]>([]);
  const start = React.useRef<number | null>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += delta * 0.02;
    }
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    NODES.forEach((_, i) => {
      const m = nodeRefs.current[i];
      if (!m) return;
      const appear = Math.min(1, Math.max(0, (t - i * 0.03) * 3));
      m.scale.setScalar(appear === 1 ? 1 : 1 - Math.pow(1 - appear, 3));
      if (i % 4 === 0) {
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity =
          1.4 + Math.sin(state.clock.elapsedTime * 2.4 + i) * 0.6;
      }
    });
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
        <mesh key={i} position={p} ref={(el) => { nodeRefs.current[i] = el; }} scale={0}>
          <sphereGeometry args={[i % 4 === 0 ? 0.1 : 0.06, 16, 16]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#43e7ff" : "#b372cf"}
            emissive={i % 4 === 0 ? "#43e7ff" : "#8c45ff"}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      <Packets />
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
