import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Weather3D = ({ weather }) => {
  const rainRef = useRef();
  const snowRef = useRef();
  const cloudsRef = useRef();

  // Generate rain particles
  const rainParticles = useMemo(() => {
    const particles = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      particles[i * 3] = (Math.random() - 0.5) * 50; // x
      particles[i * 3 + 1] = Math.random() * 30 + 10; // y
      particles[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
    }
    return particles;
  }, []);

  // Generate snow particles
  const snowParticles = useMemo(() => {
    const particles = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      particles[i * 3] = (Math.random() - 0.5) * 50; // x
      particles[i * 3 + 1] = Math.random() * 30 + 10; // y
      particles[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
    }
    return particles;
  }, []);

  // Generate cloud particles
  const cloudParticles = useMemo(() => {
    const particles = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      particles[i * 3] = (Math.random() - 0.5) * 60; // x
      particles[i * 3 + 1] = Math.random() * 5 + 15; // y
      particles[i * 3 + 2] = (Math.random() - 0.5) * 60; // z
    }
    return particles;
  }, []);

  useFrame((state) => {
    // Animate rain
    if (rainRef.current && weather?.weather?.name === 'Rainy') {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.5; // Fall down
        if (positions[i + 1] < 0) {
          positions[i + 1] = 30; // Reset to top
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate snow
    if (snowRef.current && weather?.weather?.name === 'Snowy') {
      const positions = snowRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1; // Fall down slowly
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01; // Drift
        if (positions[i + 1] < 0) {
          positions[i + 1] = 30; // Reset to top
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate clouds
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.001;
      const positions = cloudsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += 0.01; // Move clouds
        if (positions[i] > 30) {
          positions[i] = -30; // Reset position
        }
      }
      cloudsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const renderWeatherEffects = () => {
    const weatherName = weather?.weather?.name || 'Sunny';

    switch (weatherName) {
      case 'Rainy':
        return (
          <>
            {/* Rain */}
            <Points ref={rainRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={rainParticles.length / 3}
                  array={rainParticles}
                  itemSize={3}
                />
              </bufferGeometry>
              <PointMaterial
                size={0.1}
                color="#4169E1"
                transparent
                opacity={0.6}
              />
            </Points>
            
            {/* Dark clouds */}
            <Points ref={cloudsRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={cloudParticles.length / 3}
                  array={cloudParticles}
                  itemSize={3}
                />
              </bufferGeometry>
              <PointMaterial
                size={2}
                color="#696969"
                transparent
                opacity={0.8}
              />
            </Points>
          </>
        );

      case 'Snowy':
        return (
          <>
            {/* Snow */}
            <Points ref={snowRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={snowParticles.length / 3}
                  array={snowParticles}
                  itemSize={3}
                />
              </bufferGeometry>
              <PointMaterial
                size={0.3}
                color="#FFFFFF"
                transparent
                opacity={0.8}
              />
            </Points>
            
            {/* Snow clouds */}
            <Points ref={cloudsRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={cloudParticles.length / 3}
                  array={cloudParticles}
                  itemSize={3}
                />
              </bufferGeometry>
              <PointMaterial
                size={3}
                color="#E6E6FA"
                transparent
                opacity={0.7}
              />
            </Points>
          </>
        );

      case 'Cloudy':
        return (
          <Points ref={cloudsRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={cloudParticles.length / 3}
                array={cloudParticles}
                itemSize={3}
              />
            </bufferGeometry>
            <PointMaterial
              size={4}
              color="#D3D3D3"
              transparent
              opacity={0.6}
            />
          </Points>
        );

      case 'Foggy':
        return (
          <Points ref={cloudsRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={cloudParticles.length / 3}
                array={cloudParticles}
                itemSize={3}
              />
            </bufferGeometry>
            <PointMaterial
              size={6}
              color="#F5F5F5"
              transparent
              opacity={0.4}
            />
          </Points>
        );

      case 'Windy':
        return (
          <>
            {/* Wind particles */}
            <Points ref={cloudsRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={cloudParticles.length / 3}
                  array={cloudParticles}
                  itemSize={3}
                />
              </bufferGeometry>
              <PointMaterial
                size={1}
                color="#87CEEB"
                transparent
                opacity={0.3}
              />
            </Points>
          </>
        );

      default: // Sunny
        return null;
    }
  };

  return (
    <group>
      {renderWeatherEffects()}
      
      {/* Ambient weather lighting effects */}
      {weather?.weather?.name === 'Rainy' && (
        <ambientLight intensity={0.2} color="#4169E1" />
      )}
      
      {weather?.weather?.name === 'Snowy' && (
        <ambientLight intensity={0.3} color="#E6E6FA" />
      )}
      
      {weather?.weather?.name === 'Cloudy' && (
        <ambientLight intensity={0.3} color="#D3D3D3" />
      )}
      
      {weather?.weather?.name === 'Foggy' && (
        <ambientLight intensity={0.2} color="#F5F5F5" />
      )}
    </group>
  );
};

export default Weather3D;
