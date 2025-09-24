import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TelkomDashboard from './pages/TelkomDashboard';
import MyFamilyDashboard from './pages/MyFamilyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import GameZone from './pages/GameZone';
import { AuthProvider, useAuth } from './services/AuthService';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><TelkomDashboard /></ProtectedRoute>} />
            <Route path="/myfamily" element={<ProtectedRoute><MyFamilyDashboard /></ProtectedRoute>} />
            <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><GameZone /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-telkom-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telkom-blue mx-auto mb-4"></div>
          <p className="text-telkom-dark-gray">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App;