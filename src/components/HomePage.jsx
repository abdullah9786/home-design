import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useRoomStore from '../store/useRoomStore';
import Dashboard from './Dashboard';
import RoomForm from './RoomForm';
import DesignStudio from './DesignStudio';
import './LandingPage.css';
function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

    const handleLogout = () => {
    logout(); // This will automatically redirect to login page
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
              <header className="authenticated-header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Home Decor Customizer</span>
          </div>
          
          
          <div className="user-section">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">
                {user?.email ? user.email.split('@')[0] : 'User'}
              </span>
            </div>
            <div className="header-actions">
              
              <button 
                className="header-btn logout-btn"
                onClick={handleLogout}
              >
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
         {renderStep()}
       </div>
  );
}

export default HomePage