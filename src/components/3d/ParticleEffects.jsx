import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Sparkle Effect for Ready Crops
export function SparkleEffect({ position, active }) {
  const particlesRef = useRef();
  const particleCount = 20;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random positions around the field
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 3 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      // Golden sparkle colors
      colors[i * 3] = 1; // R
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
      colors[i * 3 + 2] = 0; // B

      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current && active) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        // Floating animation
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.01;
        
        // Reset particles that go too high
        if (positions[i * 3 + 1] > 4) {
          positions[i * 3 + 1] = 1;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotation animation
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// Growth Particles for Growing Crops
export function GrowthParticles({ position, active, cropType }) {
  const particlesRef = useRef();
  const particleCount = 15;

  const getParticleColor = () => {
    switch (cropType) {
      case 'wheat': return [1, 0.8, 0.2]; // Golden
      case 'corn': return [1, 1, 0.4]; // Yellow
      case 'tomato': return [1, 0.4, 0.4]; // Red
      case 'carrot': return [1, 0.5, 0]; // Orange
      case 'potato': return [0.8, 0.6, 0.4]; // Brown
      case 'lettuce': return [0.4, 1, 0.4]; // Green
      default: return [0.5, 1, 0.5]; // Default green
    }
  };

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const color = getParticleColor();

    for (let i = 0; i < particleCount; i++) {
      // Start from ground level
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      // Upward velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.05 + 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Crop-specific colors
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }

    return { positions, colors, velocities };
  }, [cropType]);

  useFrame((state) => {
    if (particlesRef.current && active) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        // Move particles upward
        positions[i * 3] += particles.velocities[i * 3];
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
        
        // Reset particles that go too high
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3] = (Math.random() - 0.5) * 3;
          positions[i * 3 + 1] = 0.1;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// Harvest Effect
export function HarvestEffect({ position, active, onComplete }) {
  const particlesRef = useRef();
  const particleCount = 30;
  const startTime = useRef(Date.now());

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Start from center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 1;
      positions[i * 3 + 2] = 0;

      // Explosive velocities
      const angle = (i / particleCount) * Math.PI * 2;
      velocities[i * 3] = Math.cos(angle) * 0.1;
      velocities[i * 3 + 1] = Math.random() * 0.1 + 0.05;
      velocities[i * 3 + 2] = Math.sin(angle) * 0.1;

      // Golden harvest colors
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.2;
    }

    return { positions, colors, velocities };
  }, []);

  useFrame((state) => {
    if (particlesRef.current && active) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const elapsed = (Date.now() - startTime.current) / 1000;
      
      for (let i = 0; i < particleCount; i++) {
        // Move particles outward and down
        positions[i * 3] += particles.velocities[i * 3];
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1] - 0.01; // Gravity
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Complete effect after 2 seconds
      if (elapsed > 2 && onComplete) {
        onComplete();
      }
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
