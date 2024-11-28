import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere() {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    sphereRef.current.distort = 0.3 + Math.sin(t) * 0.2;
    sphereRef.current.rotation.x = t * 0.1;
    sphereRef.current.rotation.y = t * 0.15;
  });

  return (
    <Sphere ref={sphereRef} args={[1, 100, 100]} scale={2}>
      <MeshDistortMaterial
        color="#ff6b6b"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-50">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
};

export default Background3D;
