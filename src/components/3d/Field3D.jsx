import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const Field3D = ({ field, position, isSelected, onClick, gameState }) => {
  const meshRef = useRef();
  const cropRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animate field selection
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = isSelected ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
      meshRef.current.position.y = position[1] + (isSelected ? Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0);
    }
    
    // Animate crop growth
    if (cropRef.current && field.cropType) {
      const progress = field.growthStage?.progress || 0;
      const targetScale = progress / 100;
      cropRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Get field color based on state
  const getFieldColor = () => {
    if (field.cropType) {
      const progress = field.growthStage?.progress || 0;
      if (progress >= 100) return '#32CD32'; // Lime green when ready
      if (progress >= 75) return '#90EE90'; // Light green when flowering
      if (progress >= 50) return '#9ACD32'; // Yellow green when growing
      return '#8FBC8F'; // Dark sea green when sprouting
    }
    return hovered ? '#DEB887' : '#8B7355'; // Brown when empty
  };

  // Get crop model based on type
  const renderCrop = () => {
    if (!field.cropType) return null;

    const progress = field.growthStage?.progress || 0;
    const cropHeight = (progress / 100) * 2 + 0.5;

    switch (field.cropType) {
      case 'wheat':
        return (
          <group ref={cropRef} position={[0, cropHeight / 2, 0]}>
            {/* Wheat stalks */}
            {[...Array(16)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 3,
                0,
                (Math.random() - 0.5) * 3
              ]}>
                <cylinderGeometry args={[0.02, 0.02, cropHeight, 4]} />
                <meshLambertMaterial color="#DAA520" />
              </mesh>
            ))}
            {/* Wheat heads */}
            {progress >= 75 && [...Array(16)].map((_, i) => (
              <mesh key={`head-${i}`} position={[
                (Math.random() - 0.5) * 3,
                cropHeight / 2,
                (Math.random() - 0.5) * 3
              ]}>
                <sphereGeometry args={[0.1, 4, 3]} />
                <meshLambertMaterial color="#F4A460" />
              </mesh>
            ))}
          </group>
        );

      case 'corn':
        return (
          <group ref={cropRef} position={[0, cropHeight / 2, 0]}>
            {[...Array(9)].map((_, i) => (
              <group key={i} position={[
                (i % 3 - 1) * 1.2,
                0,
                (Math.floor(i / 3) - 1) * 1.2
              ]}>
                {/* Corn stalk */}
                <mesh>
                  <cylinderGeometry args={[0.1, 0.15, cropHeight, 6]} />
                  <meshLambertMaterial color="#228B22" />
                </mesh>
                {/* Corn cob */}
                {progress >= 75 && (
                  <mesh position={[0, cropHeight * 0.3, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
                    <meshLambertMaterial color="#FFD700" />
                  </mesh>
                )}
              </group>
            ))}
          </group>
        );

      case 'potato':
        return (
          <group ref={cropRef} position={[0, 0.2, 0]}>
            {/* Potato plants (low growing) */}
            {[...Array(12)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 3,
                cropHeight * 0.3,
                (Math.random() - 0.5) * 3
              ]}>
                <sphereGeometry args={[0.2, 6, 4]} />
                <meshLambertMaterial color="#228B22" />
              </mesh>
            ))}
          </group>
        );

      case 'carrot':
        return (
          <group ref={cropRef} position={[0, 0.1, 0]}>
            {/* Carrot tops */}
            {[...Array(20)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 3,
                cropHeight * 0.4,
                (Math.random() - 0.5) * 3
              ]}>
                <coneGeometry args={[0.1, cropHeight * 0.8, 4]} />
                <meshLambertMaterial color="#228B22" />
              </mesh>
            ))}
          </group>
        );

      case 'tomato':
        return (
          <group ref={cropRef} position={[0, cropHeight / 2, 0]}>
            {[...Array(6)].map((_, i) => (
              <group key={i} position={[
                (i % 3 - 1) * 1.5,
                0,
                (Math.floor(i / 3) - 1) * 1.5
              ]}>
                {/* Tomato plant */}
                <mesh>
                  <cylinderGeometry args={[0.05, 0.08, cropHeight, 6]} />
                  <meshLambertMaterial color="#228B22" />
                </mesh>
                {/* Tomatoes */}
                {progress >= 75 && [...Array(3)].map((_, j) => (
                  <mesh key={j} position={[
                    (Math.random() - 0.5) * 0.5,
                    cropHeight * (0.3 + j * 0.2),
                    (Math.random() - 0.5) * 0.5
                  ]}>
                    <sphereGeometry args={[0.12, 6, 4]} />
                    <meshLambertMaterial color="#FF6347" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        );

      case 'lettuce':
        return (
          <group ref={cropRef} position={[0, 0.2, 0]}>
            {/* Lettuce heads */}
            {[...Array(16)].map((_, i) => (
              <mesh key={i} position={[
                (i % 4 - 1.5) * 0.8,
                cropHeight * 0.3,
                (Math.floor(i / 4) - 1.5) * 0.8
              ]}>
                <sphereGeometry args={[0.3, 8, 6]} />
                <meshLambertMaterial color="#90EE90" />
              </mesh>
            ))}
          </group>
        );

      default:
        return (
          <group ref={cropRef} position={[0, cropHeight / 2, 0]}>
            <mesh>
              <boxGeometry args={[1, cropHeight, 1]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group position={position}>
      {/* Field Base */}
      <Box
        ref={meshRef}
        args={[4, 0.2, 4]}
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshLambertMaterial 
          color={getFieldColor()}
          transparent
          opacity={isSelected ? 0.8 : 1}
        />
      </Box>

      {/* Field Border */}
      <lineSegments position={[0, 0.11, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 0.2, 4)]} />
        <lineBasicMaterial color={isSelected ? "#FFD700" : "#654321"} linewidth={2} />
      </lineSegments>

      {/* Crop */}
      {renderCrop()}

      {/* Field Label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color={isSelected ? "#FFD700" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        billboard
      >
        Field {field.fieldId}
      </Text>

      {/* Progress Indicator */}
      {field.cropType && (
        <group position={[0, 2.5, 0]}>
          {/* Progress Bar Background */}
          <Box args={[2, 0.1, 0.02]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#333333" />
          </Box>
          {/* Progress Bar Fill */}
          <Box 
            args={[(field.growthStage?.progress || 0) / 50, 0.12, 0.03]} 
            position={[-(1 - (field.growthStage?.progress || 0) / 100), 0, 0]}
          >
            <meshBasicMaterial color={
              (field.growthStage?.progress || 0) >= 100 ? "#32CD32" : "#FFD700"
            } />
          </Box>
          {/* Progress Text */}
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            billboard
          >
            {field.cropType} - {Math.round(field.growthStage?.progress || 0)}%
          </Text>
        </group>
      )}

      {/* Ready to Harvest Indicator */}
      {field.growthStage?.stage === 'ready' && (
        <group position={[0, 3.5, 0]}>
          <Text
            fontSize={0.4}
            color="#32CD32"
            anchorX="center"
            anchorY="middle"
            billboard
          >
            🌾 READY!
          </Text>
        </group>
      )}
    </group>
  );
};

export default Field3D;
