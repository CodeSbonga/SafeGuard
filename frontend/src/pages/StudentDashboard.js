import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';
import { studentApi } from '../services/ApiService';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [rules, setRules] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.role === 'student') {
      loadRules();
    }
  }, [user]);

  const loadRules = async () => {
    try {
      const response = await studentApi.getRules();
      setRules(response.data);
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (websiteUrl) => {
    try {
      const startTime = new Date().toISOString();
      const response = await studentApi.startSession(websiteUrl, startTime);
      setCurrentSession({
        id: response.data.session_id,
        website: websiteUrl,
        startTime: startTime,
        isAllowed: response.data.is_allowed,
        isStudyTime: response.data.is_study_time
      });
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;
    
    try {
      const endTime = new Date().toISOString();
      await studentApi.endSession(currentSession.id, endTime);
      setCurrentSession(null);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

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

  if (user.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-telkom-gray">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to students.</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <p className="text-sm opacity-90">Welcome, {user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="telkom-button-secondary text-sm px-4 py-2"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/games'}
                className="telkom-button-secondary text-sm px-4 py-2"
              >
                Game Zone
              </button>
              <button
                onClick={logout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Session */}
        {currentSession && (
          <div className="telkom-card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Session</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">{currentSession.website}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    currentSession.isAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentSession.isAllowed ? 'Allowed' : 'Blocked'}
                  </span>
                  {currentSession.isStudyTime && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Study Mode
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={endSession}
                className="telkom-button px-4 py-2"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        {/* Quick Access Websites */}
        <div className="telkom-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Google', url: 'https://google.com', icon: '🔍' },
              { name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
              { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
              { name: 'Khan Academy', url: 'https://khanacademy.org', icon: '🎓' }
            ].map((site) => (
              <button
                key={site.name}
                onClick={() => startSession(site.url)}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-all"
              >
                <div className="text-2xl mb-2">{site.icon}</div>
                <div className="font-medium text-sm">{site.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Website Rules */}
        <div className="telkom-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Website Rules</h2>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${rule.is_allowed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">{rule.website_url}</span>
                  {rule.study_mode && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Study Mode
                    </span>
                  )}
                </div>
                <button
                  onClick={() => startSession(rule.website_url)}
                  className="telkom-button px-3 py-1 text-sm"
                >
                  Visit
                </button>
              </div>
            ))}
            
            {rules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No website rules configured yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Study Tips */}
        <div className="telkom-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">📚 Focus Mode</h3>
              <p className="text-blue-700 text-sm">
                When study mode is enabled, your time on educational websites is tracked and rewarded.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">🎯 Stay Focused</h3>
              <p className="text-green-700 text-sm">
                Take regular breaks every 25 minutes to maintain focus and productivity.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">🏆 Earn Rewards</h3>
              <p className="text-purple-700 text-sm">
                Complete your study goals to unlock fun games and activities.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">📊 Track Progress</h3>
              <p className="text-yellow-700 text-sm">
                Monitor your study time and see how you're improving each week.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;