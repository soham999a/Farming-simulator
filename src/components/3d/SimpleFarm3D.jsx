import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { VegetableAnimation } from './VegetableAnimations';
import { SparkleEffect, GrowthParticles } from './ParticleEffects';

// Helper function to get crop emojis
function getCropEmoji(cropType) {
  const emojis = {
    wheat: '🌾',
    corn: '🌽',
    tomato: '🍅',
    carrot: '🥕',
    potato: '🥔',
    lettuce: '🥬'
  };
  return emojis[cropType] || '🌱';
}

// Helper function to get crop names
function getCropDisplayName(cropType) {
  const names = {
    wheat: 'Wheat',
    corn: 'Corn',
    tomato: 'Tomato',
    carrot: 'Carrot',
    potato: 'Potato',
    lettuce: 'Lettuce'
  };
  return names[cropType] || cropType;
}

// Simple 3D Field Component
function Field3DSimple({ position, field, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const getFieldColor = () => {
    if (field.cropType) {
      const progress = field.growthStage?.progress || 0;
      if (progress >= 100) return '#32CD32'; // Ready - bright green
      if (progress >= 75) return '#90EE90'; // Flowering - light green
      if (progress >= 50) return '#9ACD32'; // Growing - yellow green
      return '#8FBC8F'; // Sprouting - dark sea green
    }
    return hovered ? '#DEB887' : '#8B7355'; // Empty - brown
  };

  const getCropHeight = () => {
    if (!field.cropType) return 0;
    const progress = field.growthStage?.progress || 0;
    return (progress / 100) * 2 + 0.5;
  };

  return (
    <group position={position}>
      {/* Field Base */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4, 0.2, 4]} />
        <meshLambertMaterial 
          color={getFieldColor()}
          transparent
          opacity={isSelected ? 0.8 : 1}
        />
      </mesh>

      {/* Field Border */}
      <lineSegments position={[0, 0.11, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 0.2, 4)]} />
        <lineBasicMaterial color={isSelected ? "#FFD700" : "#654321"} />
      </lineSegments>

      {/* Realistic Vegetable Animations */}
      {field.cropType && (
        <VegetableAnimation
          cropType={field.cropType}
          progress={field.growthStage?.progress || 0}
          position={[0, 0.1, 0]}
        />
      )}

      {/* Particle Effects */}
      {field.cropType && (
        <>
          {/* Sparkle effect for ready crops */}
          <SparkleEffect
            position={[0, 0, 0]}
            active={field.growthStage?.stage === 'ready'}
          />

          {/* Growth particles for growing crops */}
          <GrowthParticles
            position={[0, 0, 0]}
            active={field.cropType && field.growthStage?.stage !== 'ready'}
            cropType={field.cropType}
          />
        </>
      )}

      {/* Field Label with Crop Emoji */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color={isSelected ? "#FFD700" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
      >
        {field.cropType ? getCropEmoji(field.cropType) : "🌾"} Field {field.fieldId}
      </Text>

      {/* Progress Bar */}
      {field.cropType && (
        <group position={[0, 2.5, 0]}>
          {/* Background */}
          <mesh>
            <boxGeometry args={[2, 0.1, 0.02]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          {/* Progress Fill */}
          <mesh position={[-(1 - (field.growthStage?.progress || 0) / 100), 0, 0.01]}>
            <boxGeometry args={[(field.growthStage?.progress || 0) / 50, 0.12, 0.03]} />
            <meshBasicMaterial color={
              (field.growthStage?.progress || 0) >= 100 ? "#32CD32" : "#FFD700"
            } />
          </mesh>
          {/* Progress Text */}
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {getCropDisplayName(field.cropType)} - {Math.round(field.growthStage?.progress || 0)}%
          </Text>
        </group>
      )}

      {/* Ready Indicator */}
      {field.growthStage?.stage === 'ready' && (
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.4}
          color="#32CD32"
          anchorX="center"
          anchorY="middle"
        >
          🌾 READY!
        </Text>
      )}
    </group>
  );
}

// Simple 3D Farm Scene
const SimpleFarm3D = ({ gameState, onFieldClick }) => {
  const [selectedField, setSelectedField] = useState(null);

  const handleFieldClick = (fieldId) => {
    setSelectedField(fieldId);
    onFieldClick(fieldId);
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ 
          position: [0, 15, 20], 
          fov: 60 
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 5]}
          intensity={1}
          castShadow
        />

        {/* Sky */}
        <mesh>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
        </mesh>

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshLambertMaterial color="#4a5d23" />
        </mesh>

        {/* Farm Fields */}
        {gameState.farm.fields.map((field, index) => (
          <Field3DSimple
            key={field.fieldId}
            field={field}
            position={[
              (index % 3) * 8 - 8, // X position
              0.1, // Y position
              Math.floor(index / 3) * 8 - 4 // Z position
            ]}
            isSelected={selectedField === field.fieldId}
            onClick={() => handleFieldClick(field.fieldId)}
          />
        ))}

        {/* Simple Barn */}
        <group position={[-15, 0, -10]}>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[6, 4, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <boxGeometry args={[7, 1, 9]} />
            <meshLambertMaterial color="#654321" />
          </mesh>
        </group>

        {/* Farm Sign */}
        <group position={[0, 0, 15]}>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[8, 3, 0.2]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          <Text
            position={[0, 3, 0.2]}
            fontSize={0.8}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {gameState.farm.name}
          </Text>
        </group>

        {/* Trees */}
        {[...Array(6)].map((_, i) => (
          <group key={i} position={[
            Math.sin(i * Math.PI / 3) * 20,
            0,
            Math.cos(i * Math.PI / 3) * 20
          ]}>
            {/* Trunk */}
            <mesh castShadow>
              <cylinderGeometry args={[0.5, 0.8, 6, 8]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 5, 0]} castShadow>
              <sphereGeometry args={[3, 8, 6]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
          </group>
        ))}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg border border-green-400">
        <h3 className="text-lg font-bold mb-2 text-green-400">🎮 3D Farm Controls</h3>
        <p className="text-sm">🖱️ Click & drag to rotate camera</p>
        <p className="text-sm">🔍 Mouse wheel to zoom in/out</p>
        <p className="text-sm">🌾 Click fields to plant/harvest</p>
        <p className="text-sm">✨ Watch crops grow in real-time!</p>
        <p className="text-xs text-green-300 mt-2">🎯 Selected field highlighted in gold</p>
      </div>

      {/* Field Info */}
      {selectedField && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-xl border-2 border-green-400">
          <h3 className="text-lg font-bold mb-2 text-green-700">🎯 Field {selectedField}</h3>
          {(() => {
            const field = gameState.farm.fields.find(f => f.fieldId === selectedField);
            if (!field) return null;
            
            if (field.cropType) {
              return (
                <div>
                  <p className="text-sm font-bold">{getCropEmoji(field.cropType)} Crop: {getCropDisplayName(field.cropType)}</p>
                  <p className="text-sm">📊 Progress: {Math.round(field.growthStage?.progress || 0)}%</p>
                  <p className="text-sm">🎯 Stage: {field.growthStage?.stage || 'planted'}</p>
                  {field.growthStage?.stage === 'ready' && (
                    <p className="text-sm text-green-600 font-bold">✨ Ready to Harvest!</p>
                  )}
                </div>
              );
            } else {
              return <p className="text-sm">🌾 Empty field - Ready to plant!</p>;
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default SimpleFarm3D;
