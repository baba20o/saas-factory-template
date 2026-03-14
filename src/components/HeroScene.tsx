"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrb({ position, color, speed, distort, size }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  size: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[size, 4]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          distort={distort}
          speed={speed * 2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function WobbleTorus({ position, color, speed }: {
  position: [number, number, number];
  color: string;
  speed: number;
}) {
  return (
    <Float speed={speed * 0.5} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.6, 0.15, 32, 64]} />
        <MeshWobbleMaterial
          color={color}
          factor={0.4}
          speed={speed}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 200, color = "#6366f1" }: { count?: number; color?: string }) {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlowRing({ position, color }: {
  position: [number, number, number];
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.15;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusGeometry args={[1.8, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

function Scene({ primaryColor }: { primaryColor: string }) {
  // Derive complementary colors
  const accentColor = "#818cf8"; // lighter indigo
  const glowColor = "#a78bfa"; // violet

  return (
    <>
      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#e0e7ff" />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color={primaryColor} />
      <pointLight position={[3, -2, 2]} intensity={0.4} color={accentColor} />

      {/* Stars background */}
      <Stars radius={50} depth={50} count={1000} factor={3} saturation={0.5} fade speed={0.5} />

      {/* Floating orbs */}
      <FloatingOrb position={[-2.5, 1, -2]} color={primaryColor} speed={1.2} distort={0.4} size={0.8} />
      <FloatingOrb position={[2.8, -0.5, -3]} color={accentColor} speed={0.8} distort={0.3} size={0.6} />
      <FloatingOrb position={[0.5, 2, -4]} color={glowColor} speed={1.0} distort={0.5} size={0.5} />
      <FloatingOrb position={[-1.5, -1.5, -2.5]} color="#60a5fa" speed={0.6} distort={0.2} size={0.4} />

      {/* Torus rings */}
      <WobbleTorus position={[3, 1.5, -5]} color={primaryColor} speed={1.5} />
      <WobbleTorus position={[-3, -1, -4]} color={glowColor} speed={1.0} />

      {/* Glow rings */}
      <GlowRing position={[0, 0, -6]} color={primaryColor} />
      <GlowRing position={[2, -1, -8]} color={accentColor} />

      {/* Particle field */}
      <ParticleField count={300} color={primaryColor} />
    </>
  );
}

export default function HeroScene({ primaryColor = "#6366f1" }: { primaryColor?: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#050510" }}
      >
        <Scene primaryColor={primaryColor} />
      </Canvas>
      {/* Gradient overlay to blend 3D into content */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/30 via-transparent to-[#050510]/70 pointer-events-none" />
    </div>
  );
}
