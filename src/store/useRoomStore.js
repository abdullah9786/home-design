import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoomStore = create(
  persist(
    (set, get) => ({
      // Room configuration
      roomConfig: {
        roomType: 'living-room',
        length: 5,
        width: 4,
        height: 3,
        doors: 1,
        windows: 2,
        wallColor: '#f5f5f5',
        flooringType: 'wood',
        style: 'modern',
      },
      
      // Furniture items placed in the room
      furnitureItems: [],
      
      // Saved designs array
      savedDesigns: [],
      
      // Current design ID (if editing existing)
      currentDesignId: null,
      
      // Current step: 'dashboard', 'form' or 'design'
      currentStep: 'dashboard',
      
      // Track if user is dragging furniture (to disable camera controls)
      isDraggingFurniture: false,
      
      // Actions
      setRoomConfig: (config) => set({ roomConfig: config }),
      
      addFurniture: (item) => set((state) => ({
        furnitureItems: [...state.furnitureItems, { ...item, id: Date.now() }]
      })),
      
      updateFurniture: (id, updates) => set((state) => ({
        furnitureItems: state.furnitureItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      removeFurniture: (id) => set((state) => ({
        furnitureItems: state.furnitureItems.filter((item) => item.id !== id)
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setIsDraggingFurniture: (isDragging) => set({ isDraggingFurniture: isDragging }),
      
      // Save current design
      saveDesign: (designName) => {
        const state = get();
        const design = {
          id: state.currentDesignId || Date.now(),
          name: designName || `Design ${state.savedDesigns.length + 1}`,
          roomConfig: state.roomConfig,
          furnitureItems: state.furnitureItems,
          createdAt: state.currentDesignId 
            ? state.savedDesigns.find(d => d.id === state.currentDesignId)?.createdAt 
            : Date.now(),
          updatedAt: Date.now(),
        };
        
        const existingIndex = state.savedDesigns.findIndex(d => d.id === design.id);
        const newSavedDesigns = existingIndex >= 0
          ? state.savedDesigns.map(d => d.id === design.id ? design : d)
          : [...state.savedDesigns, design];
          
        set({ 
          savedDesigns: newSavedDesigns,
          currentDesignId: design.id
        });
      },
      
      // Load a saved design
      loadDesign: (designId) => {
        const state = get();
        const design = state.savedDesigns.find(d => d.id === designId);
        if (design) {
          set({
            roomConfig: design.roomConfig,
            furnitureItems: design.furnitureItems,
            currentDesignId: design.id,
            currentStep: 'design',
          });
        }
      },
      
      // Delete a saved design
      deleteDesign: (designId) => {
        const state = get();
        set({
          savedDesigns: state.savedDesigns.filter(d => d.id !== designId),
          currentDesignId: state.currentDesignId === designId ? null : state.currentDesignId,
        });
      },
      
      // Start a new design
      startNewDesign: () => set({
        roomConfig: {
          roomType: 'living-room',
          length: 5,
          width: 4,
          height: 3,
          doors: 1,
          windows: 2,
          wallColor: '#f5f5f5',
          flooringType: 'wood',
          style: 'modern',
        },
        furnitureItems: [],
        currentDesignId: null,
        currentStep: 'form',
        isDraggingFurniture: false,
      }),
      
      resetRoom: () => set({
        furnitureItems: [],
        currentStep: 'form',
        isDraggingFurniture: false,
      }),
      
      clearAllFurniture: () => set({ furnitureItems: [] }),
    }),
    {
      name: 'room-design-storage',
      partialize: (state) => ({
        savedDesigns: state.savedDesigns,
        currentDesignId: state.currentDesignId,
      }),
    }
  )
);

export default useRoomStore;

