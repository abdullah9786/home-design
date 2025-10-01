import { useMemo } from 'react';
import * as THREE from 'three';

const Room = ({ config }) => {
  const { length, width, height, wallColor, doors, windows } = config;

  // Create floor geometry
  const floor = useMemo(() => {
    return (
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
    );
  }, [length, width]);

  // Create ceiling
  const ceiling = useMemo(() => {
    return (
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
    );
  }, [length, width, height]);

  // Create walls
  const walls = useMemo(() => {
    const wallThickness = 0.1;
    const wallsData = [];

    // Back wall (along width, at -length/2)
    wallsData.push({
      position: [0, height / 2, -width / 2],
      rotation: [0, 0, 0],
      size: [length, height, wallThickness],
      hasDoor: doors >= 1,
      hasWindow: windows >= 1,
    });

    // Front wall (along width, at +length/2)
    wallsData.push({
      position: [0, height / 2, width / 2],
      rotation: [0, Math.PI, 0],
      size: [length, height, wallThickness],
      hasDoor: false,
      hasWindow: windows >= 2,
    });

    // Left wall (along length, at -width/2)
    wallsData.push({
      position: [-length / 2, height / 2, 0],
      rotation: [0, Math.PI / 2, 0],
      size: [width, height, wallThickness],
      hasDoor: doors >= 2,
      hasWindow: windows >= 3,
    });

    // Right wall (along length, at +width/2)
    wallsData.push({
      position: [length / 2, height / 2, 0],
      rotation: [0, -Math.PI / 2, 0],
      size: [width, height, wallThickness],
      hasDoor: false,
      hasWindow: windows >= 4,
    });

    return wallsData.map((wall, index) => (
      <Wall
        key={index}
        position={wall.position}
        rotation={wall.rotation}
        size={wall.size}
        color={wallColor}
        hasDoor={wall.hasDoor}
        hasWindow={wall.hasWindow}
      />
    ));
  }, [length, width, height, wallColor, doors, windows]);

  return (
    <group>
      {floor}
      {ceiling}
      {walls}
    </group>
  );
};

// Wall component with optional door and window
const Wall = ({ position, rotation, size, color, hasDoor, hasWindow }) => {
  const [wallWidth, wallHeight, wallDepth] = size;

  // Create wall with cutouts for door/window using CSG-like approach
  const wallShape = useMemo(() => {
    const shape = new THREE.Shape();
    const hw = wallWidth / 2;
    const hh = wallHeight / 2;

    // Outer rectangle
    shape.moveTo(-hw, -hh);
    shape.lineTo(hw, -hh);
    shape.lineTo(hw, hh);
    shape.lineTo(-hw, hh);
    shape.lineTo(-hw, -hh);

    // Door cutout (if present) - centered at bottom
    if (hasDoor) {
      const doorWidth = 0.9;
      const doorHeight = 2.1;
      const doorX = -doorWidth / 2;
      const doorY = -hh;

      const hole = new THREE.Path();
      hole.moveTo(doorX, doorY);
      hole.lineTo(doorX + doorWidth, doorY);
      hole.lineTo(doorX + doorWidth, doorY + doorHeight);
      hole.lineTo(doorX, doorY + doorHeight);
      hole.lineTo(doorX, doorY);
      shape.holes.push(hole);
    }

    // Window cutout (if present) - upper portion
    if (hasWindow) {
      const windowWidth = 1.2;
      const windowHeight = 1.0;
      const windowX = -windowWidth / 2;
      const windowY = hh - windowHeight - 0.5;

      const hole = new THREE.Path();
      hole.moveTo(windowX, windowY);
      hole.lineTo(windowX + windowWidth, windowY);
      hole.lineTo(windowX + windowWidth, windowY + windowHeight);
      hole.lineTo(windowX, windowY + windowHeight);
      hole.lineTo(windowX, windowY);
      shape.holes.push(hole);
    }

    return shape;
  }, [wallWidth, wallHeight, hasDoor, hasWindow]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <extrudeGeometry
          args={[
            wallShape,
            {
              depth: wallDepth,
              bevelEnabled: false,
            },
          ]}
        />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.7} />
      </mesh>

      {/* Window frame */}
      {hasWindow && (
        <mesh position={[0, wallHeight / 2 - 1, wallDepth / 2 + 0.01]}>
          <planeGeometry args={[1.2, 1.0]} />
          <meshStandardMaterial
            color="#87CEEB"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Door frame */}
      {hasDoor && (
        <mesh position={[0, -wallHeight / 2 + 1.05, wallDepth / 2 + 0.01]}>
          <planeGeometry args={[0.9, 2.1]} />
          <meshStandardMaterial color="#654321" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

export default Room;

