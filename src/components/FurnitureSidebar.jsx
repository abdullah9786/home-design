import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import useRoomStore from '../store/useRoomStore';
import { 
  Sofa, 
  Armchair, 
  Bed, 
  Lamp, 
  Home,
  Box,
  Grid3x3,
  Circle,
  Tv,
  BookOpen,
  TreePine,
  Frame,
  Monitor,
  Briefcase,
  Square
} from 'lucide-react';

const furnitureCategories = [
  {
    id: 'sofa',
    name: 'Sofa',
    icon: Sofa,
    color: '#8b5cf6',
    size: [2, 0.8, 1],
    type: 'sofa'
  },
  {
    id: 'chair',
    name: 'Chair',
    icon: Armchair,
    color: '#ec4899',
    size: [0.6, 0.8, 0.6],
    type: 'chair'
  },
  {
    id: 'bed',
    name: 'Bed',
    icon: Bed,
    color: '#3b82f6',
    size: [2, 0.5, 1.8],
    type: 'bed'
  },
  {
    id: 'table',
    name: 'Dining Table',
    icon: Grid3x3,
    color: '#f59e0b',
    size: [1.5, 0.7, 1],
    type: 'table'
  },
  {
    id: 'coffee-table',
    name: 'Coffee Table',
    icon: Square,
    color: '#d97706',
    size: [1, 0.4, 0.6],
    type: 'coffee-table'
  },
  {
    id: 'lamp',
    name: 'Lamp',
    icon: Lamp,
    color: '#eab308',
    size: [0.3, 1.5, 0.3],
    type: 'lamp'
  },
  {
    id: 'cupboard',
    name: 'Cupboard',
    icon: Box,
    color: '#06b6d4',
    size: [1.2, 2, 0.5],
    type: 'cupboard'
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    icon: BookOpen,
    color: '#0891b2',
    size: [1, 2, 0.4],
    type: 'bookshelf'
  },
  {
    id: 'tv-stand',
    name: 'TV Stand',
    icon: Tv,
    color: '#7c3aed',
    size: [1.5, 0.5, 0.4],
    type: 'tv-stand'
  },
  {
    id: 'desk',
    name: 'Desk',
    icon: Monitor,
    color: '#2563eb',
    size: [1.2, 0.75, 0.6],
    type: 'desk'
  },
  {
    id: 'nightstand',
    name: 'Nightstand',
    icon: Briefcase,
    color: '#dc2626',
    size: [0.5, 0.6, 0.4],
    type: 'nightstand'
  },
  {
    id: 'plant',
    name: 'Plant',
    icon: TreePine,
    color: '#16a34a',
    size: [0.4, 1, 0.4],
    type: 'plant'
  },
  {
    id: 'carpet',
    name: 'Carpet',
    icon: Circle,
    color: '#84cc16',
    size: [2, 0.05, 1.5],
    type: 'carpet'
  },
  {
    id: 'side-table',
    name: 'Side Table',
    icon: Box,
    color: '#f97316',
    size: [0.5, 0.5, 0.5],
    type: 'side-table'
  },
  {
    id: 'artwork',
    name: 'Artwork',
    icon: Frame,
    color: '#be123c',
    size: [0.05, 0.8, 1.2],
    type: 'artwork'
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    icon: Box,
    color: '#4338ca',
    size: [1.5, 2.2, 0.6],
    type: 'wardrobe'
  },
];

const DraggableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });
  
  const addFurniture = useRoomStore((state) => state.addFurniture);
  const roomConfig = useRoomStore((state) => state.roomConfig);

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const Icon = item.icon;

  // Generate random position within room bounds
  const getRandomPosition = () => {
    const { length, width } = roomConfig;
    const x = (Math.random() - 0.5) * (length - 2); // Keep 1m from walls
    const z = (Math.random() - 0.5) * (width - 2);
    return [x, 0, z];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        // Also allow click to add at random position
        addFurniture({
          type: item.type,
          position: getRandomPosition(),
          rotation: 0,
          color: item.color,
          size: item.size,
          name: item.name,
        });
      }}
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-400 active:scale-95"
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: item.color + '20' }}
        >
          <Icon style={{ color: item.color }} className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-gray-700">{item.name}</span>
      </div>
    </div>
  );
};

const FurnitureSidebar = () => {
  return (
    <div className="w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Furniture</h2>
        <p className="text-sm text-gray-600">
          Drag items onto the canvas or click to add
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {furnitureCategories.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FurnitureSidebar;

