# 🏠 3D Home Décor Visualizer

A modern, interactive React-based web application for visualizing and designing home interiors in fully navigable 3D space.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.160.0-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.0-cyan)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)

## ✨ Features

### 🎨 Interactive Room Design
- **Dynamic 3D Room Generation** - Rooms are generated based on your custom specifications
- **Full 360° Navigation** - Orbit, pan, zoom, and explore your room from every angle
- **Real-time Visualization** - See changes instantly as you design

### 📝 Comprehensive Input Form
- Room type selection (Living Room, Bedroom, Kitchen, etc.)
- Custom dimensions (length, width, height)
- Configurable doors and windows
- Wall color picker
- Flooring type options
- Style preferences (Modern, Classic, Minimal, etc.)

### 🪑 Drag-and-Drop Furniture
- **8+ Furniture Items** including:
  - Sofa, Chair, Bed
  - Table, Side Table
  - Cupboard, Lamp
  - Carpet
- Click or drag items onto canvas
- Rotate and position furniture freely
- **Resize furniture** to fit your space perfectly
- Delete unwanted items with one click

### 💾 Save & Export
- Auto-save designs to browser localStorage
- Export high-quality screenshots
- Generate design summary reports
- Reset and start fresh anytime

### 🎯 Advanced 3D Features
- Realistic lighting and shadows
- Contact shadows for depth
- Environment lighting for realism
- Interactive camera controls
- Grid reference for precision placement

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

3. **Build for Production**
```bash
npm run build
```

## 🎮 How to Use

### Step 1: Configure Your Room
1. Select your room type from the dropdown
2. Enter room dimensions in meters
3. Specify number of doors and windows
4. Choose wall color using the color picker
5. Select flooring type and interior style
6. Click "Start Designing in 3D" →

### Step 2: Design Your Space
1. **Navigate the 3D View:**
   - **Left Click + Drag** - Rotate camera around room
   - **Right Click + Drag** - Pan view
   - **Scroll Wheel** - Zoom in/out

2. **Add Furniture:**
   - Click items in the sidebar to add at default position
   - OR drag items directly onto the canvas
   - Hover over furniture to see controls:
     - 🔄 **Rotate** - Change orientation (45° increments)
     - 📏 **Resize** - Drag left/right to scale
     - 🗑️ **Delete** - Remove item

3. **Save Your Design:**
   - Click "Save Design" to store in browser
   - Click "Screenshot" to export image
   - Click "Export Report" for design summary
   - Click "Clear All" to remove all furniture
   - Click "Back to Form" to change room specs

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - UI library
- **Vite** - Build tool and dev server

### 3D Graphics
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F

### UI & Styling
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### State Management & Forms
- **Zustand** - Lightweight state management
- **Formik** - Form handling
- **Yup** - Form validation

### Interactions
- **@dnd-kit/core** - Drag and drop functionality
- **html2canvas** - Screenshot export

## 📁 Project Structure

```
home-design/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Room.jsx          # 3D room with walls, floor, ceiling
│   │   │   └── FurnitureItem.jsx # Individual furniture components
│   │   ├── RoomForm.jsx          # Initial requirement form
│   │   ├── DesignStudio.jsx      # Main design interface
│   │   ├── Scene3D.jsx           # 3D scene setup
│   │   ├── FurnitureSidebar.jsx  # Draggable furniture list
│   │   └── ControlPanel.jsx      # Save/Export controls
│   ├── store/
│   │   └── useRoomStore.js       # Zustand store
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Customization

### Adding New Furniture
Edit `src/components/FurnitureSidebar.jsx`:

```javascript
const furnitureCategories = [
  {
    id: 'custom-item',
    name: 'Custom Item',
    icon: YourIcon,
    color: '#hexcolor',
    size: [width, height, depth],
    type: 'custom-item'
  }
];
```

Then add rendering logic in `src/components/3d/FurnitureItem.jsx`.

### Changing Room Colors
Modify default colors in `src/store/useRoomStore.js`:

```javascript
roomConfig: {
  wallColor: '#f5f5f5',
  // ... other config
}
```

## 🐛 Troubleshooting

### Canvas not rendering?
- Check browser console for WebGL support
- Ensure Three.js dependencies are installed correctly

### Furniture not dragging?
- Make sure @dnd-kit/core is properly installed
- Check that DndContext wraps the components

### Slow performance?
- Reduce number of furniture items
- Lower shadow quality in Scene3D.jsx
- Disable environment lighting temporarily

## 📝 Future Enhancements

- [ ] First-person walk-through mode
- [ ] Texture customization for furniture
- [ ] Import custom 3D models
- [ ] Collaborative design (multiplayer)
- [ ] VR support
- [ ] Measurement tools
- [ ] Material library
- [ ] Cloud save functionality
- [ ] Mobile touch controls optimization
- [ ] Undo/Redo functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React, Three.js, and modern web technologies.

---

**Enjoy designing your dream home in 3D! 🏡✨**

