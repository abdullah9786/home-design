import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { DndContext, useDroppable } from '@dnd-kit/core';
import Scene3D from './Scene3D';
import FurnitureSidebar from './FurnitureSidebar';
import useRoomStore from '../store/useRoomStore';

const CanvasDropZone = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div ref={setNodeRef} className="flex-1 relative">
      {children}
    </div>
  );
};

const DesignStudio = () => {
  const [isDragging, setIsDragging] = useState(false);
  const addFurniture = useRoomStore((state) => state.addFurniture);
  const roomConfig = useRoomStore((state) => state.roomConfig);

  // Generate random position within room bounds
  const getRandomPosition = () => {
    const { length, width } = roomConfig;
    const x = (Math.random() - 0.5) * (length - 2); // Keep 1m from walls
    const z = (Math.random() - 0.5) * (width - 2);
    return [x, 0, z];
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    const { active, over } = event;
    
    if (over && over.id === 'canvas-drop-zone' && active.data.current) {
      // Add furniture when dropped on canvas with random position
      const item = active.data.current;
      addFurniture({
        type: item.type,
        position: getRandomPosition(),
        rotation: 0,
        color: item.color,
        size: item.size,
        name: item.name,
      });
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="w-full h-full flex">
        {/* Main 3D Canvas with Drop Zone */}
        <CanvasDropZone>
          <Canvas
            camera={{ position: [5, 5, 5], fov: 60 }}
            className="bg-gray-100"
          >
            <Scene3D />
          </Canvas>
          
          {/* Overlay Instructions */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-gray-800 mb-2">Navigation Controls</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>🖱️ <strong>Left Click + Drag:</strong> Rotate camera</li>
              <li>🖱️ <strong>Right Click + Drag:</strong> Pan view</li>
              <li>🖱️ <strong>Scroll:</strong> Zoom in/out</li>
              <li>📦 <strong>Click or drag</strong> furniture from sidebar</li>
              <li>🎯 <strong>Hover furniture</strong> for controls</li>
            </ul>
          </div>
        </CanvasDropZone>

        {/* Sidebar */}
        <FurnitureSidebar />
      </div>
    </DndContext>
  );
};

export default DesignStudio;

