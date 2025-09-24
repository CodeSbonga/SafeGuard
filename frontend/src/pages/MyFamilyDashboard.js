import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';
import { parentApi } from '../services/ApiService';
import Plot from 'react-plotly.js';

const MyFamilyDashboard = () => {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [rules, setRules] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    website_url: '',
    is_allowed: true,
    study_mode: false
  });

  useEffect(() => {
    if (user.role === 'parent') {
      loadChildren();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChild) {
      loadRules();
      loadAnalytics();
    }
  }, [selectedChild]);

  const loadChildren = async () => {
    try {
      const response = await parentApi.getChildren();
      setChildren(response.data);
      if (response.data.length > 0) {
        setSelectedChild(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      const response = await parentApi.getRules(selectedChild);
      setRules(response.data);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await parentApi.getAnalytics(selectedChild, 7);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    try {
      await parentApi.createRule(
        selectedChild,
        newRule.website_url,
        newRule.is_allowed,
        newRule.study_mode
      );
      setNewRule({ website_url: '', is_allowed: true, study_mode: false });
      setShowAddRule(false);
      loadRules();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await parentApi.deleteRule(ruleId);
      loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await parentApi.exportCSV(selectedChild, 7);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `family_usage_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await parentApi.exportPDF(selectedChild, 7);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `family_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
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

  if (user.role !== 'parent') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-telkom-gray">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to parents.</p>
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
                <h1 className="text-2xl font-bold">myFamily</h1>
                <p className="text-sm opacity-90">Parental Control Dashboard</p>
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
        {/* Child Selection */}
        <div className="telkom-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Child</h2>
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChild === child.id
                    ? 'bg-telkom-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {child.username}
              </button>
            ))}
          </div>
        </div>

        {selectedChild && (
          <>
            {/* Analytics Section */}
            {analytics && (
              <div className="telkom-card p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics (Last 7 Days)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-telkom-blue">{analytics.total_study_time}m</div>
                    <div className="text-sm text-gray-600">Study Time</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{analytics.total_distraction_time}m</div>
                    <div className="text-sm text-gray-600">Distraction Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{analytics.study_efficiency}%</div>
                    <div className="text-sm text-gray-600">Study Efficiency</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{analytics.total_time}m</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analytics.charts.time_distribution && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Time Distribution</h3>
                      <Plot
                        data={JSON.parse(analytics.charts.time_distribution).data}
                        layout={JSON.parse(analytics.charts.time_distribution).layout}
                        style={{ width: '100%', height: '300px' }}
                      />
                    </div>
                  )}
                  
                  {analytics.charts.most_visited && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Most Visited Sites</h3>
                      <Plot
                        data={JSON.parse(analytics.charts.most_visited).data}
                        layout={JSON.parse(analytics.charts.most_visited).layout}
                        style={{ width: '100%', height: '300px' }}
                      />
                    </div>
                  )}
                </div>

                {/* AI Suggestion */}
                {analytics.ai_suggestion && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">AI Recommendation</h4>
                    <p className="text-yellow-700">{analytics.ai_suggestion}</p>
                  </div>
                )}

                {/* Export Buttons */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={handleExportCSV}
                    className="telkom-button-secondary px-6 py-2"
                  >
                    📊 Export CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="telkom-button px-6 py-2"
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>
            )}

            {/* Rules Management */}
            <div className="telkom-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Website Rules</h2>
                <button
                  onClick={() => setShowAddRule(true)}
                  className="telkom-button px-4 py-2"
                >
                  Add Rule
                </button>
              </div>

              {/* Add Rule Form */}
              {showAddRule && (
                <form onSubmit={handleAddRule} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="url"
                      placeholder="Website URL (e.g., https://example.com)"
                      value={newRule.website_url}
                      onChange={(e) => setNewRule({ ...newRule, website_url: e.target.value })}
                      className="telkom-input"
                      required
                    />
                    <select
                      value={newRule.is_allowed}
                      onChange={(e) => setNewRule({ ...newRule, is_allowed: e.target.value === 'true' })}
                      className="telkom-input"
                    >
                      <option value="true">Allowed</option>
                      <option value="false">Blocked</option>
                    </select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRule.study_mode}
                        onChange={(e) => setNewRule({ ...newRule, study_mode: e.target.checked })}
                        className="mr-2"
                      />
                      Study Mode
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="telkom-button px-4 py-2">
                      Add Rule
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddRule(false)}
                      className="telkom-button-secondary px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Rules List */}
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
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                
                {rules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No rules configured yet. Add your first rule to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyFamilyDashboard;