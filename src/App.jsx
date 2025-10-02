import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { useState } from 'react';
import Dashboard from './components/Dashboard';
import RoomForm from './components/RoomForm';
import DesignStudio from './components/DesignStudio';
import ControlPanel from './components/ControlPanel';

import SignupPage from './pages/SignupPage';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import HomePage from './components/HomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  

  return (
    // <>
    //   <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    //     {renderStep()}
    //   </div>
      
    //   {/* Control Panel - Only show in design mode */}
    //   {currentStep === 'design' && <ControlPanel />}
    // </>
    <AuthProvider>

    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage></HomePage>
            </ProtectedRoute>
          } 
          
          />

           {/* Authentication Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
          
      
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

