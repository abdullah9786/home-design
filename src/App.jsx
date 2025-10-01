import { useState } from 'react';
import useRoomStore from './store/useRoomStore';
import Dashboard from './components/Dashboard';
import RoomForm from './components/RoomForm';
import DesignStudio from './components/DesignStudio';
import ControlPanel from './components/ControlPanel';

function App() {
  const { currentStep } = useRoomStore();

  const renderStep = () => {
    switch (currentStep) {
      case 'dashboard':
        return <Dashboard />;
      case 'form':
        return <RoomForm />;
      case 'design':
        return <DesignStudio />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {renderStep()}
      </div>
      
      {/* Control Panel - Only show in design mode */}
      {currentStep === 'design' && <ControlPanel />}
    </>
  );
}

export default App;

