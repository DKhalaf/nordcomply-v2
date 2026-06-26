import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import TenantDetail from './pages/TenantDetail';
import AdminPanel from './pages/AdminPanel';

import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Logger ind...</p>
      </div>
    );
  }

  return (
    <>
      {user && <Navigation />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tenants" element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
        <Route path="/tenant/:tenantId" element={<ProtectedRoute><TenantDetail /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
