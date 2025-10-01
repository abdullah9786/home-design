import { useState } from 'react';
import useRoomStore from '../store/useRoomStore';
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar,
  Package,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { 
    savedDesigns, 
    loadDesign, 
    deleteDesign, 
    startNewDesign 
  } = useRoomStore();
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoomTypeIcon = (roomType) => {
    const icons = {
      'living-room': '🛋️',
      'bedroom': '🛏️',
      'kitchen': '🍳',
      'bathroom': '🚿',
      'office': '💼',
      'dining-room': '🍽️',
      'other': '🏠'
    };
    return icons[roomType] || '🏠';
  };

  const handleDelete = (designId, e) => {
    e.stopPropagation();
    if (deleteConfirm === designId) {
      deleteDesign(designId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(designId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            My Designs Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your saved room designs and start new projects
          </p>
        </div>

        {/* Create New Design Button */}
        <div className="mb-8">
          <button
            onClick={startNewDesign}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-6 px-8 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xl">Create New Design</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>

        {/* Saved Designs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Saved Designs ({savedDesigns.length})
            </h2>
          </div>

          {savedDesigns.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No designs yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first room design to get started
              </p>
              <button
                onClick={startNewDesign}
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition font-medium inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create Your First Design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => loadDesign(design.id)}
                >
                  {/* Design Preview/Header */}
                  <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl">
                        {getRoomTypeIcon(design.roomConfig.roomType)}
                      </span>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-white font-semibold text-sm">
                          {design.furnitureItems.length} items
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 truncate">
                      {design.name}
                    </h3>
                    <p className="text-indigo-100 text-sm capitalize">
                      {design.roomConfig.roomType.replace('-', ' ')} • {design.roomConfig.style}
                    </p>
                  </div>

                  {/* Design Details */}
                  <div className="p-5">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 flex-1">
                          <Calendar size={16} className="text-indigo-500" />
                          <span>Created: {formatDate(design.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 flex-1">
                          <Clock size={16} className="text-purple-500" />
                          <span>Updated: {formatTime(design.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home size={16} className="text-green-500" />
                        <span>
                          {design.roomConfig.length}m × {design.roomConfig.width}m × {design.roomConfig.height}m
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadDesign(design.id);
                        }}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 group/edit"
                        title="Edit Design"
                      >
                        <Edit size={16} className="group-hover/edit:rotate-12 transition-transform" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(design.id, e)}
                        className={`px-4 py-2.5 rounded-lg transition font-semibold ${
                          deleteConfirm === design.id
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                        title={deleteConfirm === design.id ? 'Click again to confirm' : 'Delete Design'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

