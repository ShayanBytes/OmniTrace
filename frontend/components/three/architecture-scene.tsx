"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { SceneCanvas } from "@/components/three/scene-canvas";

/**
 * Architecture scene: stacked translucent "strata" slabs (the layers of a
 * system) floating apart in an exploded view, with small module cubes resting
 * on them. Slowly rotates to read as a living architecture map.
 */

const LAYERS = [
  { y: 1.5, color: "#8c45ff", w: 4.2 },
  { y: 0.5, color: "#9855ff", w: 3.6 },
  { y: -0.5, color: "#6d3ad6", w: 3.0 },
  { y: -1.5, color: "#43e7ff", w: 2.4 },
];

// Seeded module positions per layer.
function modulesFor(layerIndex: number, width: number) {
  const out: [number, number][] = [];
  const count = 3 + (layerIndex % 3);
  for (let i = 0; i < count; i++) {
    const x = ((i / (count - 1 || 1)) - 0.5) * (width - 1);
    const z = Math.sin(layerIndex * 3 + i * 2) * 0.7;
    out.push([x, z]);
  }
  return out;
}

// Pre-flatten module cubes into a stable, indexed list so refs don't shift.
const MODULES = LAYERS.flatMap((layer, li) =>
  modulesFor(li, layer.w).map(([x, z], mi) => ({ x, z, y: layer.y, color: layer.color, key: `${li}-${mi}` }))
);

function Strata() {
  const group = React.useRef<THREE.Group>(null);
  const cubes = React.useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
    // Module cubes gently bob and pulse, each on its own phase, so the map
    // reads as a living system rather than a frozen diagram.
    const t = state.clock.elapsedTime;
    cubes.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = MODULES[i].y + 0.18 + Math.sin(t * 1.6 + i) * 0.05;
      m.rotation.y = t * 0.4 + i;
      (m.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.6 + (Math.sin(t * 2 + i * 1.3) * 0.5 + 0.5) * 0.9;
    });
  });

  return (
    <group ref={group} rotation={[0.5, 0, 0]}>
      {LAYERS.map((layer, li) => (
        <group key={li} position={[0, layer.y, 0]}>
          {/* Slab */}
          <RoundedBox args={[layer.w, 0.12, layer.w * 0.62]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color={layer.color}
              transparent
              opacity={0.22}
              emissive={layer.color}
              emissiveIntensity={0.25}
              metalness={0.3}
              roughness={0.4}
            />
          </RoundedBox>
          {/* Slab outline */}
          <lineSegments>
            <edgesGeometry
              args={[new THREE.BoxGeometry(layer.w, 0.12, layer.w * 0.62)]}
            />
            <lineBasicMaterial color={layer.color} transparent opacity={0.5} />
          </lineSegments>
        </group>
      ))}

      {/* Module cubes — flattened with stable indexed refs so each bobs/pulses
          on its own phase. Positioned in world space at their layer's height. */}
      {MODULES.map((m, i) => (
        <mesh
          key={m.key}
          position={[m.x, m.y + 0.18, m.z]}
          ref={(el) => {
            cubes.current[i] = el;
          }}
        >
          <boxGeometry args={[0.26, 0.26, 0.26]} />
          <meshStandardMaterial
            color="#e9ddff"
            emissive={m.color}
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ArchitectureScene() {
  return (
    <SceneCanvas camera={{ position: [0, 1.5, 7], fov: 42 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 6, 5]} intensity={32} color="#9855ff" />
      <pointLight position={[-5, -2, 3]} intensity={18} color="#43e7ff" />
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
        <Strata />
      </Float>
    </SceneCanvas>
  );
}
