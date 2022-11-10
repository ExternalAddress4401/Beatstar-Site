import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Arrow = () => {
  const arrow = useLoader(GLTFLoader, "/models/arrow.glb");
  return <primitive object={arrow.scene} color="red" />;
};

export default function App(props) {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, -50] }}>
      <pointLight position={[0, 30, 0]} color="white" />
      <Arrow />
      <OrbitControls />
    </Canvas>
  );
}
