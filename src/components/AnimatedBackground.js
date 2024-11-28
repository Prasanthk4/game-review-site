import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function RandomPoints({ count = 5000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, [count]);

  const pointsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.x = time * 0.1;
    pointsRef.current.rotation.y = time * 0.15;
  });

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={points.length / 3}
          array={Float32Array.from(new Array(points.length).fill().map(() => Math.random()))}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <RandomPoints />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
