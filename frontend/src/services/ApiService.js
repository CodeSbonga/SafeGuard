import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Parent API functions
export const parentApi = {
  // Get all children
  getChildren: () => api.get('/parent/children'),
  
  // Get rules for a specific child or all children
  getRules: (childId = null) => {
    const params = childId ? { child_id: childId } : {};
    return api.get('/parent/rules', { params });
  },
  
  // Create a new rule
  createRule: (childId, websiteUrl, isAllowed = true, studyMode = false) => 
    api.post('/parent/rules', {
      child_id: childId,
      website_url: websiteUrl,
      is_allowed: isAllowed,
      study_mode: studyMode
    }),
  
  // Delete a rule
  deleteRule: (ruleId) => api.delete(`/parent/rules/${ruleId}`),
  
  // Get analytics for a child or all children
  getAnalytics: (childId = null, days = 7) => {
    const params = { days };
    if (childId) params.child_id = childId;
    return api.get('/parent/analytics', { params });
  },
  
  // Export CSV report
  exportCSV: (childId = null, days = 7) => {
    const params = { days };
    if (childId) params.child_id = childId;
    return api.get('/parent/export/csv', { 
      params,
      responseType: 'blob'
    });
  },
  
  // Export PDF report
  exportPDF: (childId = null, days = 7) => {
    const params = { days };
    if (childId) params.child_id = childId;
    return api.get('/parent/export/pdf', { 
      params,
      responseType: 'blob'
    });
  }
};

// Student API functions
export const studentApi = {
  // Get student's rules
  getRules: () => api.get('/student/rules'),
  
  // Start a new session
  startSession: (websiteUrl, startTime) => 
    api.post('/student/sessions', {
      website_url: websiteUrl,
      start_time: startTime
    }),
  
  // End a session
  endSession: (sessionId, endTime) => 
    api.put(`/student/sessions/${sessionId}`, {
      end_time: endTime
    })
};

// Common API functions
export const commonApi = {
  // Login
  login: (username, password) => 
    api.post('/login', { username, password }),
  
  // Register
  register: (username, email, password, role, parentId = null) => 
    api.post('/register', { username, email, password, role, parent_id: parentId }),
  
  // Logout
  logout: () => api.post('/logout')
};

export default api;