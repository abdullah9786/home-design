import { useRef } from 'react';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import Room from './3d/Room';
import FurnitureItem from './3d/FurnitureItem';
import useRoomStore from '../store/useRoomStore';

const Scene3D = () => {
  const { furnitureItems, roomConfig, isDraggingFurniture } = useRoomStore();
  const controlsRef = useRef();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.4} />
      
      {/* Environment for realistic lighting */}
      <Environment preset="apartment" />
      
      {/* Camera Controls - Full 360 degree navigation */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        enabled={!isDraggingFurniture}
        makeDefault
      />
      
      {/* Ground Grid for reference - positioned below floor to avoid Z-fighting */}
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6e6e6e"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        position={[0, -0.02, 0]}
      />
      
      {/* The Room */}
      <Room config={roomConfig} />
      
      {/* Furniture Items */}
      {furnitureItems.map((item) => (
        <FurnitureItem key={item.id} item={item} />
      ))}
    </>
  );
};

export default Scene3D;

