import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (token) => {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem('bizsphere_token', token);
};

export const getToken = () => {
  return localStorage.getItem('bizsphere_token');
};

export const removeToken = () => {
  localStorage.removeItem('bizsphere_token');
};

export default api;