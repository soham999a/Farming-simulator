import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Wheat Animation Component
export function WheatCrop({ progress, position }) {
  const groupRef = useRef();
  const wheatHeight = (progress / 100) * 3 + 0.5;
  const wheatCount = Math.floor((progress / 100) * 12) + 3;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying animation
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(wheatCount)].map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 3,
          0,
          (Math.random() - 0.5) * 3
        ]}>
          {/* Wheat Stalk */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.05, wheatHeight, 6]} />
            <meshLambertMaterial color="#DAA520" />
          </mesh>
          {/* Wheat Head */}
          {progress > 70 && (
            <mesh position={[0, wheatHeight / 2 + 0.2, 0]}>
              <sphereGeometry args={[0.1, 8, 6]} />
              <meshLambertMaterial color={progress >= 100 ? "#FFD700" : "#F0E68C"} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Corn Animation Component
export function CornCrop({ progress, position }) {
  const groupRef = useRef();
  const cornHeight = (progress / 100) * 4 + 0.3;
  const cornCount = Math.floor((progress / 100) * 8) + 2;

  useFrame((state) => {
    if (groupRef.current) {
      // Slight swaying for tall corn
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(cornCount)].map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 2.5,
          0,
          (Math.random() - 0.5) * 2.5
        ]}>
          {/* Corn Stalk */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.12, cornHeight, 8]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
          {/* Corn Leaves */}
          {progress > 30 && [...Array(3)].map((_, j) => (
            <mesh key={j} position={[0, cornHeight * (0.3 + j * 0.2), 0]} rotation={[0, j * Math.PI / 3, Math.PI / 6]}>
              <boxGeometry args={[0.8, 0.1, 0.02]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
          ))}
          {/* Corn Cob */}
          {progress > 80 && (
            <mesh position={[0, cornHeight * 0.8, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
              <meshLambertMaterial color={progress >= 100 ? "#FFD700" : "#FFFF99"} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Tomato Animation Component
export function TomatoCrop({ progress, position }) {
  const groupRef = useRef();
  const plantHeight = (progress / 100) * 2 + 0.4;
  const tomatoCount = Math.floor((progress / 100) * 6) + 1;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(tomatoCount)].map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 2,
          0,
          (Math.random() - 0.5) * 2
        ]}>
          {/* Tomato Plant Stem */}
          <mesh>
            <cylinderGeometry args={[0.03, 0.06, plantHeight, 6]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
          {/* Tomato Leaves */}
          {progress > 25 && [...Array(4)].map((_, j) => (
            <mesh key={j} position={[
              Math.sin(j * Math.PI / 2) * 0.3,
              plantHeight * (0.4 + j * 0.15),
              Math.cos(j * Math.PI / 2) * 0.3
            ]}>
              <sphereGeometry args={[0.2, 6, 4]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
          ))}
          {/* Tomatoes */}
          {progress > 60 && [...Array(Math.floor(progress / 30))].map((_, j) => (
            <mesh key={j} position={[
              (Math.random() - 0.5) * 0.4,
              plantHeight * (0.5 + j * 0.2),
              (Math.random() - 0.5) * 0.4
            ]}>
              <sphereGeometry args={[0.12, 8, 6]} />
              <meshLambertMaterial color={progress >= 100 ? "#FF6347" : "#FF7F50"} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Carrot Animation Component
export function CarrotCrop({ progress, position }) {
  const groupRef = useRef();
  const leafHeight = (progress / 100) * 1.5 + 0.2;
  const carrotCount = Math.floor((progress / 100) * 10) + 3;

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle wind effect
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.5) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(carrotCount)].map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 3,
          0,
          (Math.random() - 0.5) * 3
        ]}>
          {/* Carrot Leaves */}
          <mesh position={[0, leafHeight / 2, 0]}>
            <coneGeometry args={[0.15, leafHeight, 6]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
          {/* Multiple leaf fronds */}
          {progress > 20 && [...Array(5)].map((_, j) => (
            <mesh key={j} position={[
              Math.sin(j * Math.PI * 2 / 5) * 0.1,
              leafHeight * 0.7,
              Math.cos(j * Math.PI * 2 / 5) * 0.1
            ]} rotation={[Math.PI / 6, j * Math.PI * 2 / 5, 0]}>
              <boxGeometry args={[0.02, 0.4, 0.01]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
          ))}
          {/* Carrot top visible when ready */}
          {progress > 85 && (
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.08, 0.04, 0.1, 8]} />
              <meshLambertMaterial color="#FF8C00" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Potato Animation Component
export function PotatoCrop({ progress, position }) {
  const groupRef = useRef();
  const bushHeight = (progress / 100) * 1.2 + 0.3;
  const bushCount = Math.floor((progress / 100) * 6) + 2;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rustling animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(bushCount)].map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 2.5,
          0,
          (Math.random() - 0.5) * 2.5
        ]}>
          {/* Potato Plant Bush */}
          <mesh position={[0, bushHeight / 2, 0]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
          {/* Potato Leaves */}
          {progress > 30 && [...Array(6)].map((_, j) => (
            <mesh key={j} position={[
              Math.sin(j * Math.PI / 3) * 0.25,
              bushHeight * 0.8,
              Math.cos(j * Math.PI / 3) * 0.25
            ]}>
              <sphereGeometry args={[0.1, 6, 4]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
          ))}
          {/* Small flowers when flowering */}
          {progress > 50 && progress < 90 && (
            <mesh position={[0, bushHeight + 0.1, 0]}>
              <sphereGeometry args={[0.05, 6, 4]} />
              <meshLambertMaterial color="#DDA0DD" />
            </mesh>
          )}
          {/* Potato mounds when ready */}
          {progress > 90 && (
            <mesh position={[0, -0.02, 0]}>
              <sphereGeometry args={[0.2, 8, 4]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Lettuce Animation Component
export function LettuceCrop({ progress, position }) {
  const groupRef = useRef();
  const leafSize = (progress / 100) * 0.8 + 0.2;
  const lettuceCount = Math.floor((progress / 100) * 8) + 3;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(lettuceCount)].map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 3,
          0,
          (Math.random() - 0.5) * 3
        ]}>
          {/* Lettuce Head */}
          <mesh position={[0, leafSize / 2, 0]}>
            <sphereGeometry args={[leafSize, 8, 6]} />
            <meshLambertMaterial color={progress >= 100 ? "#90EE90" : "#9ACD32"} />
          </mesh>
          {/* Individual Lettuce Leaves */}
          {progress > 20 && [...Array(8)].map((_, j) => (
            <mesh key={j} position={[
              Math.sin(j * Math.PI / 4) * leafSize * 0.8,
              leafSize * 0.3,
              Math.cos(j * Math.PI / 4) * leafSize * 0.8
            ]} rotation={[Math.PI / 8, j * Math.PI / 4, 0]}>
              <boxGeometry args={[leafSize * 0.6, 0.02, leafSize * 0.4]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Main Vegetable Component Selector
export function VegetableAnimation({ cropType, progress, position }) {
  const props = { progress, position };

  switch (cropType) {
    case 'wheat':
      return <WheatCrop {...props} />;
    case 'corn':
      return <CornCrop {...props} />;
    case 'tomato':
      return <TomatoCrop {...props} />;
    case 'carrot':
      return <CarrotCrop {...props} />;
    case 'potato':
      return <PotatoCrop {...props} />;
    case 'lettuce':
      return <LettuceCrop {...props} />;
    default:
      return null;
  }
}
