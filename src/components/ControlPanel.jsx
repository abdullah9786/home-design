import { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Camera, 
  ArrowLeft, 
  Trash2,
  Download,
  CheckCircle,
  Settings,
  X,
  Home as HomeIcon,
  Edit3
} from 'lucide-react';
import useRoomStore from '../store/useRoomStore';
import html2canvas from 'html2canvas';

const ControlPanel = () => {
  const {
    setCurrentStep,
    clearAllFurniture,
    roomConfig,
    furnitureItems,
    saveDesign,
    savedDesigns,
    currentDesignId,
  } = useRoomStore();

  const [saveStatus, setSaveStatus] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [designName, setDesignName] = useState('');

  const handleBackToDashboard = () => {
    if (confirm('Go back to dashboard? Make sure to save your changes.')) {
      setCurrentStep('dashboard');
    }
  };

  const handleBackToForm = () => {
    if (confirm('Edit room configuration? This will take you back to the form.')) {
      setCurrentStep('form');
    }
  };

  const handleReset = () => {
    if (confirm('Clear all furniture? This cannot be undone.')) {
      clearAllFurniture();
    }
  };

  const handleSaveClick = () => {
    // Get current design name if editing existing
    const currentDesign = savedDesigns.find(d => d.id === currentDesignId);
    setDesignName(currentDesign?.name || '');
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = () => {
    const name = designName.trim() || `Design ${savedDesigns.length + 1}`;
    saveDesign(name);
    setSaveStatus('saved');
    setShowSaveDialog(false);
    setDesignName('');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleExportScreenshot = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // Get the canvas data
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.download = `room-design-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        
        setSaveStatus('exported');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Error exporting screenshot:', error);
      alert('Failed to export screenshot');
    }
  };

  const handleExportPDF = () => {
    // Create a simple text report
    const report = `
=================================
3D HOME DESIGN SUMMARY
=================================

ROOM SPECIFICATIONS:
-------------------
Room Type: ${roomConfig.roomType}
Dimensions: ${roomConfig.length}m × ${roomConfig.width}m × ${roomConfig.height}m
Doors: ${roomConfig.doors}
Windows: ${roomConfig.windows}
Wall Color: ${roomConfig.wallColor}
Flooring: ${roomConfig.flooringType}
Style: ${roomConfig.style}

FURNITURE ITEMS (${furnitureItems.length}):
-------------------
${furnitureItems.map((item, i) => `${i + 1}. ${item.name} at position (${item.position.map(p => p.toFixed(2)).join(', ')})`).join('\n')}

Generated: ${new Date().toLocaleString()}
=================================
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `room-design-report-${Date.now()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Save Dialog Overlay */}
      {showSaveDialog && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]"
          onClick={() => setShowSaveDialog(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Save className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Save Design</h3>
                <p className="text-sm text-gray-500">Give your design a name</p>
              </div>
            </div>
            
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="My Awesome Room Design"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none mb-6 text-lg"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSaveConfirm()}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Control Panel */}
      <div 
        className="z-50"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999
        }}
      >
        {/* Control Panel Content - Slides In/Out - Above button */}
        {isOpen && (
          <div 
            className="bg-white rounded-xl shadow-2xl p-4 space-y-3 transition-all duration-300 origin-bottom-right mb-3 animate-in fade-in slide-in-from-bottom-2"
          >
          <div className="text-center mb-2">
            <h3 className="font-bold text-gray-800 text-sm">Design Controls</h3>
            <p className="text-xs text-gray-500 mt-1">Hover furniture for more options</p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              {saveStatus === 'saved' && 'Design saved!'}
              {saveStatus === 'exported' && 'Screenshot exported!'}
            </div>
          )}

          {/* Back to Dashboard */}
          <button
            onClick={handleBackToDashboard}
            className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition font-medium text-sm"
          >
            <HomeIcon size={16} />
            Dashboard
          </button>

          {/* Back to Form */}
          <button
            onClick={handleBackToForm}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm"
          >
            <Edit3 size={16} />
            Edit Room Config
          </button>

          {/* Save Design */}
          <button
            onClick={handleSaveClick}
            className="w-full flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-medium text-sm"
          >
            <Save size={16} />
            Save Design
          </button>

          {/* Export Screenshot */}
          <button
            onClick={handleExportScreenshot}
            className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium text-sm"
          >
            <Camera size={16} />
            Screenshot
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition font-medium text-sm"
          >
            <Download size={16} />
            Export Report
          </button>

          {/* Clear All */}
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium text-sm"
          >
            <Trash2 size={16} />
            Clear All
          </button>

          {/* Stats */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
            {furnitureItems.length} furniture items
          </p>
        </div>
      </div>
        )}

      {/* Toggle Button - Always Visible - Below popup */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 font-medium text-sm w-full
          ${isOpen 
            ? 'bg-gray-700 hover:bg-gray-800 text-white' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
          }
        `}
        title={isOpen ? 'Close controls' : 'Open controls'}
      >
        {isOpen ? (
          <>
            <X size={18} />
            Close
          </>
        ) : (
          <>
            <Settings size={18} />
            Controls ({furnitureItems.length})
          </>
        )}
      </button>
    </div>
    </>
  );
};

export default ControlPanel;
