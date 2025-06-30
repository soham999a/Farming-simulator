import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Farmer3D = ({ position = [0, 0, 0], isWorking = false }) => {
  const farmerRef = useRef();
  const [walkCycle, setWalkCycle] = useState(0);

  useFrame((state) => {
    if (farmerRef.current) {
      // Idle animation - slight bobbing
      if (!isWorking) {
        farmerRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        farmerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
      
      // Working animation - more active movement
      if (isWorking) {
        farmerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.2;
        farmerRef.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.1;
      }
    }
  });

  return (
    <group ref={farmerRef} position={position}>
      {/* Farmer Body */}
      <group>
        {/* Head */}
        <Sphere args={[0.3]} position={[0, 1.7, 0]}>
          <meshLambertMaterial color="#FFDBAC" />
        </Sphere>
        
        {/* Hat */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>

        {/* Body */}
        <Box args={[0.6, 0.8, 0.3]} position={[0, 1, 0]}>
          <meshLambertMaterial color="#4169E1" />
        </Box>

        {/* Arms */}
        <Box args={[0.15, 0.6, 0.15]} position={[-0.45, 1, 0]}>
          <meshLambertMaterial color="#FFDBAC" />
        </Box>
        <Box args={[0.15, 0.6, 0.15]} position={[0.45, 1, 0]}>
          <meshLambertMaterial color="#FFDBAC" />
        </Box>

        {/* Legs */}
        <Box args={[0.2, 0.8, 0.2]} position={[-0.2, 0.2, 0]}>
          <meshLambertMaterial color="#8B4513" />
        </Box>
        <Box args={[0.2, 0.8, 0.2]} position={[0.2, 0.2, 0]}>
          <meshLambertMaterial color="#8B4513" />
        </Box>

        {/* Feet */}
        <Box args={[0.3, 0.1, 0.4]} position={[-0.2, -0.15, 0]}>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.3, 0.1, 0.4]} position={[0.2, -0.15, 0]}>
          <meshLambertMaterial color="#654321" />
        </Box>

        {/* Tool - Hoe */}
        <group position={[0.6, 1.2, 0]} rotation={[0, 0, -0.3]}>
          {/* Handle */}
          <Box args={[0.05, 1.5, 0.05]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          {/* Blade */}
          <Box args={[0.3, 0.05, 0.1]} position={[0.15, 0.75, 0]}>
            <meshLambertMaterial color="#C0C0C0" />
          </Box>
        </group>

        {/* Overalls Straps */}
        <Box args={[0.1, 0.6, 0.05]} position={[-0.15, 1.2, 0.16]}>
          <meshLambertMaterial color="#4169E1" />
        </Box>
        <Box args={[0.1, 0.6, 0.05]} position={[0.15, 1.2, 0.16]}>
          <meshLambertMaterial color="#4169E1" />
        </Box>

        {/* Work Gloves */}
        <Sphere args={[0.12]} position={[-0.45, 0.6, 0]}>
          <meshLambertMaterial color="#8B4513" />
        </Sphere>
        <Sphere args={[0.12]} position={[0.45, 0.6, 0]}>
          <meshLambertMaterial color="#8B4513" />
        </Sphere>
      </group>

      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Work particles when working */}
      {isWorking && (
        <group>
          {[...Array(5)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 2,
                Math.random() * 0.5,
                (Math.random() - 0.5) * 2
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial color="#8B4513" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export default Farmer3D;
