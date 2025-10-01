import { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useRoomStore from '../../store/useRoomStore';
import { Trash2, RotateCw, Maximize2 } from 'lucide-react';

const FurnitureItem = ({ item }) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialSize = useRef([1, 1, 1]);
  const { camera, gl } = useThree();
  
  const updateFurniture = useRoomStore((state) => state.updateFurniture);
  const removeFurniture = useRoomStore((state) => state.removeFurniture);
  const setIsDraggingFurniture = useRoomStore((state) => state.setIsDraggingFurniture);

  const { position = [0, 0, 0], rotation = 0, color, size, type, id } = item;

  // Debounced hover state to prevent flickering
  useEffect(() => {
    if (isHovered) {
      // Show controls immediately on hover
      setShowControls(true);
      // Clear any pending hide timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    } else {
      // Delay hiding controls to allow mouse to move to buttons
      hoverTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 500); // Increased delay for more stability
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered]);

  // Cleanup dragging/resizing state if component unmounts
  useEffect(() => {
    return () => {
      if (isDragging || isResizing) {
        setIsDraggingFurniture(false);
      }
    };
  }, [isDragging, isResizing, setIsDraggingFurniture]);

  // Handle dragging in 3D space
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setIsDraggingFurniture(true); // Disable camera controls
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      e.stopPropagation();
      // Update position based on mouse movement
      const newPosition = [e.point.x, position[1], e.point.z];
      updateFurniture(id, { position: newPosition });
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      e?.stopPropagation?.();
      setIsDragging(false);
      setIsDraggingFurniture(false); // Re-enable camera controls
      gl.domElement.style.cursor = 'default';
    }
  };

  // Global pointer event listeners for smooth dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalPointerMove = (event) => {
      // Calculate intersection with ground plane
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Use raycaster to find position
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);
      
      // Intersect with ground plane (y = 0)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        updateFurniture(id, { position: [intersectPoint.x, position[1], intersectPoint.z] });
      }
    };

    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      setIsDraggingFurniture(false);
      gl.domElement.style.cursor = 'default';
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDragging, camera, gl, id, position, updateFurniture, setIsDraggingFurniture]);

  const handleRotate = (e) => {
    e.stopPropagation();
    const newRotation = (rotation + Math.PI / 4) % (Math.PI * 2);
    updateFurniture(id, { rotation: newRotation });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    removeFurniture(id);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setIsDraggingFurniture(true);
    initialSize.current = [...size];
    gl.domElement.style.cursor = 'nwse-resize';
  };

  // Global resize event listeners
  useEffect(() => {
    if (!isResizing) return;

    let startMouseX = null;

    const handleGlobalResizeMove = (event) => {
      if (startMouseX === null) {
        startMouseX = event.clientX;
        return;
      }

      const deltaX = event.clientX - startMouseX;
      const scaleFactor = 1 + (deltaX / 200); // Adjust sensitivity

      // Apply scale factor with minimum size constraints
      const newSize = initialSize.current.map(dim => Math.max(0.3, dim * scaleFactor));
      updateFurniture(id, { size: newSize });
    };

    const handleGlobalResizeUp = () => {
      setIsResizing(false);
      setIsDraggingFurniture(false);
      gl.domElement.style.cursor = 'default';
      startMouseX = null;
    };

    window.addEventListener('pointermove', handleGlobalResizeMove);
    window.addEventListener('pointerup', handleGlobalResizeUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalResizeMove);
      window.removeEventListener('pointerup', handleGlobalResizeUp);
    };
  }, [isResizing, gl, id, updateFurniture, setIsDraggingFurniture]);

  // Render different furniture based on type
  const renderFurniture = () => {
    const [w, h, d] = size;
    const yPos = h / 2; // Position so bottom sits on floor

    switch (type) {
      case 'sofa':
        return (
          <group position={[0, yPos, 0]}>
            {/* Main seat */}
            <mesh>
              <boxGeometry args={[w, h * 0.6, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, h * 0.3, -d * 0.3]}>
              <boxGeometry args={[w, h * 0.8, d * 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-w * 0.4, 0, 0]}>
              <boxGeometry args={[w * 0.2, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[w * 0.4, 0, 0]}>
              <boxGeometry args={[w * 0.2, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case 'chair':
        return (
          <group position={[0, yPos, 0]}>
            {/* Seat */}
            <mesh>
              <boxGeometry args={[w, h * 0.5, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, h * 0.4, -d * 0.3]}>
              <boxGeometry args={[w, h * 0.9, d * 0.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case 'bed':
        return (
          <group position={[0, yPos, 0]}>
            {/* Mattress */}
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, h * 0.5, -d * 0.5]}>
              <boxGeometry args={[w, h * 1.5, d * 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case 'table':
        return (
          <group position={[0, yPos, 0]}>
            {/* Tabletop */}
            <mesh position={[0, h * 0.4, 0]}>
              <boxGeometry args={[w, h * 0.1, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            {[
              [-w * 0.4, -h * 0.3, -d * 0.4],
              [w * 0.4, -h * 0.3, -d * 0.4],
              [-w * 0.4, -h * 0.3, d * 0.4],
              [w * 0.4, -h * 0.3, d * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <cylinderGeometry args={[0.05, 0.05, h * 0.8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );

      case 'lamp':
        return (
          <group position={[0, yPos, 0]}>
            {/* Base */}
            <mesh>
              <cylinderGeometry args={[0.15, 0.2, h * 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Pole */}
            <mesh position={[0, h * 0.4, 0]}>
              <cylinderGeometry args={[0.03, 0.03, h * 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Lampshade */}
            <mesh position={[0, h * 0.8, 0]}>
              <coneGeometry args={[0.3, h * 0.3, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Light */}
            <pointLight position={[0, h * 0.7, 0]} intensity={0.5} color="#fff8e1" />
          </group>
        );

      case 'cupboard':
        return (
          <group position={[0, yPos, 0]}>
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Handles */}
            <mesh position={[w * 0.3, 0, d * 0.5 + 0.05]}>
              <cylinderGeometry args={[0.02, 0.02, 0.1]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[-w * 0.3, 0, d * 0.5 + 0.05]}>
              <cylinderGeometry args={[0.02, 0.02, 0.1]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>
        );

      case 'carpet':
        return (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w, d]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        );

      case 'side-table':
        return (
          <group position={[0, yPos, 0]}>
            {/* Tabletop */}
            <mesh position={[0, h * 0.4, 0]}>
              <boxGeometry args={[w, h * 0.1, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Shelf */}
            <mesh position={[0, -h * 0.2, 0]}>
              <boxGeometry args={[w * 0.9, h * 0.1, d * 0.9]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            {[
              [-w * 0.4, -h * 0.3, -d * 0.4],
              [w * 0.4, -h * 0.3, -d * 0.4],
              [-w * 0.4, -h * 0.3, d * 0.4],
              [w * 0.4, -h * 0.3, d * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <cylinderGeometry args={[0.03, 0.03, h * 0.5]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );

      case 'coffee-table':
        return (
          <group position={[0, yPos, 0]}>
            {/* Tabletop */}
            <mesh position={[0, h * 0.4, 0]}>
              <boxGeometry args={[w, h * 0.15, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            {[
              [-w * 0.4, -h * 0.3, -d * 0.4],
              [w * 0.4, -h * 0.3, -d * 0.4],
              [-w * 0.4, -h * 0.3, d * 0.4],
              [w * 0.4, -h * 0.3, d * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <cylinderGeometry args={[0.04, 0.04, h * 0.7]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );

      case 'bookshelf':
        return (
          <group position={[0, yPos, 0]}>
            {/* Main frame */}
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Shelves */}
            {[0.25, 0.5, 0.75].map((ratio, i) => (
              <mesh key={i} position={[0, -h * 0.5 + h * ratio, d * 0.1]}>
                <boxGeometry args={[w * 0.9, 0.02, d * 0.8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );

      case 'tv-stand':
        return (
          <group position={[0, yPos, 0]}>
            {/* Main body */}
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* TV (optional visual) */}
            <mesh position={[0, h * 0.8, 0]}>
              <boxGeometry args={[w * 0.7, h * 1.2, 0.05]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          </group>
        );

      case 'desk':
        return (
          <group position={[0, yPos, 0]}>
            {/* Desktop */}
            <mesh position={[0, h * 0.4, 0]}>
              <boxGeometry args={[w, h * 0.1, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Drawers on side */}
            <mesh position={[w * 0.3, -h * 0.1, 0]}>
              <boxGeometry args={[w * 0.3, h * 0.5, d * 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            {[
              [-w * 0.4, -h * 0.3, -d * 0.4],
              [-w * 0.4, -h * 0.3, d * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <cylinderGeometry args={[0.04, 0.04, h * 0.7]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );

      case 'nightstand':
        return (
          <group position={[0, yPos, 0]}>
            {/* Main body */}
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Drawer handles */}
            {[0.25, -0.25].map((yOffset, i) => (
              <mesh key={i} position={[0, h * yOffset, d * 0.5 + 0.02]}>
                <cylinderGeometry args={[0.015, 0.015, 0.08]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
            ))}
          </group>
        );

      case 'plant':
        return (
          <group position={[0, yPos, 0]}>
            {/* Pot */}
            <mesh position={[0, -h * 0.3, 0]}>
              <cylinderGeometry args={[w * 0.8, w, h * 0.3, 8]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Plant leaves (simplified) */}
            <mesh position={[0, h * 0.2, 0]}>
              <coneGeometry args={[w * 1.2, h * 0.8, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, h * 0.4, 0]}>
              <sphereGeometry args={[w * 0.6, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case 'artwork':
        return (
          <group position={[0, yPos, 0]}>
            {/* Frame */}
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Canvas/Picture */}
            <mesh position={[0, 0, w * 0.3]}>
              <planeGeometry args={[h * 0.9, d * 0.9]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case 'wardrobe':
        return (
          <group position={[0, yPos, 0]}>
            {/* Main body */}
            <mesh>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Door handles */}
            {[-0.2, 0.2].map((xOffset, i) => (
              <mesh key={i} position={[w * xOffset, 0, d * 0.5 + 0.02]}>
                <cylinderGeometry args={[0.02, 0.02, 0.15]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            ))}
            {/* Middle divider */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.02, h, d]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh position={[0, yPos, 0]}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          setIsHovered(true);
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          setIsHovered(false);
        }
      }}
    >
      {renderFurniture()}
      
      {/* Controls when hovered - with debounced visibility */}
      {showControls && !isDragging && !isResizing && (
        <Html
          position={[0, size[1] + 0.5, 0]}
          center
          distanceFactor={10}
          zIndexRange={[100, 0]}
          occlude={false}
          portal={{ current: gl.domElement.parentNode }}
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="flex gap-2 bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200"
            style={{ pointerEvents: 'auto' }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setIsHovered(true);
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                handleRotate(e);
              }}
              onPointerEnter={() => setIsHovered(true)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition active:scale-95"
              title="Rotate 45°"
            >
              <RotateCw size={16} />
            </button>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                handleResizeStart(e);
              }}
              onPointerEnter={() => setIsHovered(true)}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition active:scale-95"
              title="Resize (drag left/right)"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
              onPointerEnter={() => setIsHovered(true)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition active:scale-95"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </Html>
      )}
      
      {/* Selection outline when hovered or resizing */}
      {(isHovered || isResizing) && (
        <mesh position={[0, size[1] / 2, 0]} renderOrder={-1}>
          <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, size[2] + 0.1]} />
          <meshBasicMaterial 
            color={isResizing ? "#10b981" : "#4f46e5"}
            wireframe 
            transparent 
            opacity={isResizing ? 0.5 : 0.3}
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
};

export default FurnitureItem;

