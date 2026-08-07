"use client";

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#10B981" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#3B82F6" />
      
      <Sphere ref={meshRef} args={[2.5, 32, 32]}>
        <MeshDistortMaterial
          color="#064E3B"
          attach="material"
          distort={0.15}
          speed={1}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.6, 32, 32]}>
        <meshBasicMaterial color="#10B981" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}
