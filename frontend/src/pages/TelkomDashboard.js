import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const TelkomDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleMyFamilyClick = () => {
    if (user.role === 'parent') {
      navigate('/myfamily');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="telkom-header text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4">
                <span className="text-telkom-blue text-xl font-bold">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Telkom</h1>
                <p className="text-sm opacity-90">Family Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Welcome, {user.username}</p>
                <p className="text-xs opacity-75">{currentTime.toLocaleString()}</p>
              </div>
              <button
                onClick={handleMyFamilyClick}
                className="telkom-button-secondary text-sm px-4 py-2"
              >
                myFamily
              </button>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="telkom-card p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Telkom Family Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Manage your family's digital experience with our comprehensive parental control system
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleMyFamilyClick}
                className="telkom-button px-8 py-3 text-lg"
              >
                {user.role === 'parent' ? 'Manage Family' : 'View My Dashboard'}
              </button>
              <button
                onClick={() => navigate('/games')}
                className="telkom-button-secondary px-8 py-3 text-lg"
              >
                Game Zone
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="telkom-card p-6">
            <div className="w-12 h-12 bg-telkom-light-blue rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-telkom-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Website Control</h3>
            <p className="text-gray-600">
              Create whitelists and blacklists to control which websites your children can access.
            </p>
          </div>

          <div className="telkom-card p-6">
            <div className="w-12 h-12 bg-telkom-light-blue rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-telkom-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Study Mode</h3>
            <p className="text-gray-600">
              Track study hours and ensure productive learning time with our study mode feature.
            </p>
          </div>

          <div className="telkom-card p-6">
            <div className="w-12 h-12 bg-telkom-light-blue rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-telkom-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Get detailed insights into your family's digital habits with comprehensive reports.
            </p>
          </div>

          <div className="telkom-card p-6">
            <div className="w-12 h-12 bg-telkom-light-blue rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-telkom-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Educational Games</h3>
            <p className="text-gray-600">
              Fun and educational games designed to keep children engaged while learning.
            </p>
          </div>

          <div className="telkom-card p-6">
            <div className="w-12 h-12 bg-telkom-light-blue rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-telkom-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Recommendations</h3>
            <p className="text-gray-600">
              Get intelligent suggestions to improve your family's digital wellness and study habits.
            </p>
          </div>

          <div className="telkom-card p-6">
            <div className="w-12 h-12 bg-telkom-light-blue rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-telkom-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mobile Ready</h3>
            <p className="text-gray-600">
              Access all features on any device with our responsive design and mobile app.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="telkom-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-telkom-blue">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-telkom-blue">100%</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-telkom-blue">Easy</div>
              <div className="text-sm text-gray-600">Setup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-telkom-blue">Free</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelkomDashboard;